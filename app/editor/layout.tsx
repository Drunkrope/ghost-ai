import { getOwnedProjects, getSharedProjects } from "@/lib/projects"
import { EditorShell } from "@/components/editor/editor-shell"

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(),
    getSharedProjects(),
  ])

  return (
    <EditorShell
      initialOwnedProjects={ownedProjects}
      initialSharedProjects={sharedProjects}
    >
      {children}
    </EditorShell>
  )
}
