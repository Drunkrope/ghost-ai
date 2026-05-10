import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "./prisma"
import type { Project } from "@/types/project"

export async function getOwnedProjects(): Promise<Project[]> {
  const { userId } = await auth()
  if (!userId) return []

  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  })
}

export async function getSharedProjects(): Promise<Project[]> {
  const user = await currentUser()
  if (!user) return []

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) return []

  return prisma.project.findMany({
    where: { collaborators: { some: { email } } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  })
}
