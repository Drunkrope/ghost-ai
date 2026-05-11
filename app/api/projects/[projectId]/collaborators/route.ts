import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

interface Context {
  params: Promise<{ projectId: string }>
}

// GET /api/projects/[projectId]/collaborators
// Any authenticated user with access can list collaborators.
export async function GET(_request: Request, { params }: Context) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  // Verify the caller has access to the project.
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const isOwner = project.ownerId === userId

  if (!isOwner) {
    // Collaborator check: get caller's primary email from Clerk.
    const clerk = await clerkClient()
    const callerUsers = await clerk.users.getUserList({ userId: [userId] })
    const callerEmail = callerUsers.data[0]?.emailAddresses[0]?.emailAddress

    if (!callerEmail) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const entry = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: callerEmail } },
      select: { projectId: true },
    })

    if (!entry) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { email: true },
  })

  if (rows.length === 0) {
    return Response.json([])
  }

  // Enrich with Clerk user data where available.
  const emails = rows.map((r) => r.email)
  const clerk = await clerkClient()

  type ClerkUserListResponse = {
    next_cursor?: string
    nextCursor?: string
  }

  const userByEmail = new Map<string, { name: string | null; imageUrl: string | null }>()
  const emailSet = new Set(emails)
  const batchSize = 100

  for (let i = 0; i < emails.length; i += batchSize) {
    const batchEmails = emails.slice(i, i + batchSize)
    let cursor: string | undefined = undefined

    do {
      const response = await clerk.users.getUserList({
        emailAddress: batchEmails,
        limit: batchSize,
        cursor,
      })

      for (const u of response.data) {
        const email = u.emailAddresses.find((e) => emailSet.has(e.emailAddress))?.emailAddress
        if (email) {
          const name =
            [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.username || null
          userByEmail.set(email, { name, imageUrl: u.hasImage ? u.imageUrl : null })
        }
      }

      const paginationResponse = response as ClerkUserListResponse
      cursor = paginationResponse.nextCursor ?? paginationResponse.next_cursor ?? undefined
    } while (cursor)
  }

  const collaborators = rows.map((r) => ({
    email: r.email,
    name: userByEmail.get(r.email)?.name ?? null,
    imageUrl: userByEmail.get(r.email)?.imageUrl ?? null,
  }))

  return Response.json(collaborators)
}

// POST /api/projects/[projectId]/collaborators
// Owner only. Body: { email: string }
export async function POST(request: Request, { params }: Context) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : null

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Valid email is required" }, { status: 400 })
  }

  // Verify this email belongs to an existing Clerk user.
  const clerk = await clerkClient()
  const clerkUsers = await clerk.users.getUserList({ emailAddress: [email], limit: 1 })
  const clerkUser = clerkUsers.data[0] ?? null

  await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  })

  const name = clerkUser
    ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
      clerkUser.username ||
      null
    : null
  const imageUrl = clerkUser?.hasImage ? clerkUser.imageUrl : null

  return Response.json({ email, name, imageUrl }, { status: 201 })
}

// DELETE /api/projects/[projectId]/collaborators
// Owner only. Body: { email: string }
export async function DELETE(request: Request, { params }: Context) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : null

  if (!email) {
    return Response.json({ error: "email is required" }, { status: 400 })
  }

  await prisma.projectCollaborator.deleteMany({
    where: { projectId, email },
  })

  return new Response(null, { status: 204 })
}
