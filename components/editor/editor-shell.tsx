"use client"

import { useState } from "react"

import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { EditorContext } from "./editor-context"
import { EditorNavbar } from "./editor-navbar"
import { ProjectDialogs } from "./project-dialogs"
import { ProjectSidebar } from "./project-sidebar"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <EditorContext.Provider value={{ openCreate: dialogs.openCreate }}>
      <div className="h-screen bg-base">
        <EditorNavbar
          isSidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen((v) => !v)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          projects={dialogs.projects}
          onNewProject={dialogs.openCreate}
          onRenameProject={dialogs.openRename}
          onDeleteProject={dialogs.openDelete}
        />
        <main className="h-full pt-12">{children}</main>
        <ProjectDialogs dialogs={dialogs} />
      </div>
    </EditorContext.Provider>
  )
}
