import { redirect } from "next/navigation"
import { clerkClient } from "@clerk/nextjs/server"

import { getCurrentIdentity, getProjectWithAccess } from "@/lib/project-access"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

interface Props {
  params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: Props) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const project = await getProjectWithAccess(roomId)
  if (!project) {
    return <AccessDenied />
  }

  const isOwner = project.ownerId === identity.userId

  let ownerInfo = {
    name: identity.name,
    email: identity.email,
    imageUrl: identity.imageUrl,
  }

  if (!isOwner) {
    const clerk = await clerkClient()
    const ownerUsers = await clerk.users.getUserList({ userId: [project.ownerId], limit: 1 })
    const owner = ownerUsers.data[0]

    if (owner) {
      ownerInfo = {
        name:
          [owner.firstName, owner.lastName].filter(Boolean).join(" ").trim() || owner.username || null,
        email: owner.emailAddresses[0]?.emailAddress ?? null,
        imageUrl: owner.hasImage ? owner.imageUrl : null,
      }
    }
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(),
    getSharedProjects(),
  ])

  return (
    <WorkspaceShell
      projectName={project.name}
      activeProjectId={project.id}
      isOwner={isOwner}
      ownerInfo={ownerInfo}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
