import { getOwnedProjects, getSharedProjects } from "@/lib/projects"
import { EditorShell } from "@/components/editor/editor-shell"

export default async function EditorHomeLayout({ children }: { children: React.ReactNode }) {
  let ownedProjects = [] as Awaited<ReturnType<typeof getOwnedProjects>>
  let sharedProjects = [] as Awaited<ReturnType<typeof getSharedProjects>>

  try {
    ;[ownedProjects, sharedProjects] = await Promise.all([
      getOwnedProjects(),
      getSharedProjects(),
    ])
  } catch (error) {
    console.error("Failed to load editor project lists:", error)
  }

  return (
    <EditorShell
      initialOwnedProjects={ownedProjects}
      initialSharedProjects={sharedProjects}
    >
      {children}
    </EditorShell>
  )
}
