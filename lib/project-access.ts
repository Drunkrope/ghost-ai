import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "./prisma"

interface Identity {
  userId: string
  email: string | null
  name: string | null
  imageUrl: string | null
}

export async function getCurrentIdentity(): Promise<Identity | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null
  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username || null
    : null
  const imageUrl = user?.hasImage ? user.imageUrl : null

  return { userId, email, name, imageUrl }
}

export async function getProjectWithAccess(projectId: string) {
  const identity = await getCurrentIdentity()
  if (!identity) return null

  const { userId, email } = identity

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) return null

  if (project.ownerId === userId) return project

  if (!email) return null

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
    select: { projectId: true },
  })

  return collaborator ? project : null
}
