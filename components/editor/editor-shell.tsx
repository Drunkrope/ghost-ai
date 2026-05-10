"use client"

import { useState } from "react"

import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"
import { EditorContext } from "./editor-context"
import { EditorNavbar } from "./editor-navbar"
import { ProjectDialogs } from "./project-dialogs"
import { ProjectSidebar } from "./project-sidebar"

interface EditorShellProps {
  children: React.ReactNode
  initialOwnedProjects: Project[]
  initialSharedProjects: Project[]
}

export function EditorShell({
  children,
  initialOwnedProjects,
  initialSharedProjects,
}: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <EditorContext.Provider value={{ openCreate: actions.openCreate }}>
      <div className="h-screen bg-base">
        <EditorNavbar
          isSidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen((v) => !v)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={initialOwnedProjects}
          sharedProjects={initialSharedProjects}
          onNewProject={actions.openCreate}
          onRenameProject={actions.openRename}
          onDeleteProject={actions.openDelete}
        />
        <main className="h-full pt-12">{children}</main>
        <ProjectDialogs dialogs={actions} />
      </div>
    </EditorContext.Provider>
  )
}
