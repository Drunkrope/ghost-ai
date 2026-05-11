"use client"

import { useState } from "react"

import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"
import { EditorContext } from "./editor-context"
import { ProjectDialogs } from "./project-dialogs"
import { ProjectSidebar } from "./project-sidebar"
import { ShareDialog } from "./share-dialog"
import { WorkspaceNavbar } from "./workspace-navbar"

interface OwnerInfo {
  name: string | null
  email: string | null
  imageUrl: string | null
}

interface WorkspaceShellProps {
  projectName: string
  activeProjectId: string
  isOwner: boolean
  ownerInfo: OwnerInfo
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function WorkspaceShell({
  projectName,
  activeProjectId,
  isOwner,
  ownerInfo,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <EditorContext.Provider value={{ openCreate: actions.openCreate }}>
      <div className="flex h-screen flex-col bg-base">
        <WorkspaceNavbar
          projectName={projectName}
          isSidebarOpen={sidebarOpen}
          isAiPanelOpen={aiPanelOpen}
          onSidebarToggle={() => setSidebarOpen((v) => !v)}
          onAiPanelToggle={() => setAiPanelOpen((v) => !v)}
          onShareClick={() => setShareOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden pt-12">
          <ProjectSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            ownedProjects={ownedProjects}
            sharedProjects={sharedProjects}
            activeProjectId={activeProjectId}
            onNewProject={actions.openCreate}
            onRenameProject={actions.openRename}
            onDeleteProject={actions.openDelete}
          />

          {/* Canvas area */}
          <main className="relative flex flex-1 items-center justify-center bg-base">
            <span className="select-none text-sm text-copy-faint">Canvas coming soon</span>
          </main>

          {/* AI sidebar placeholder */}
          {aiPanelOpen && (
            <aside
              aria-label="AI chat sidebar"
              className="flex w-80 flex-col border-l border-surface-border bg-surface"
            >
              <div className="flex flex-1 items-center justify-center">
                <span className="select-none text-sm text-copy-faint">AI chat coming soon</span>
              </div>
            </aside>
          )}
        </div>
      </div>

      <ProjectDialogs dialogs={actions} />
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        projectId={activeProjectId}
        projectName={projectName}
        isOwner={isOwner}
        ownerInfo={ownerInfo}
      />
    </EditorContext.Provider>
  )
}
