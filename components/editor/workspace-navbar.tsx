"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, SidebarClose, SidebarOpen } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  isAiPanelOpen: boolean
  onSidebarToggle: () => void
  onAiPanelToggle: () => void
  onShareClick: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  isAiPanelOpen,
  onSidebarToggle,
  onAiPanelToggle,
  onShareClick,
}: WorkspaceNavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-12 items-center border-b border-surface-border bg-surface px-3">
      <div className="flex flex-1 items-center">
        <Button variant="ghost" size="icon-sm" onClick={onSidebarToggle}>
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5 text-copy-muted" />
          ) : (
            <PanelLeftOpen className="h-5 w-5 text-copy-muted" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <span className="max-w-xs truncate text-sm font-medium text-copy-primary">
          {projectName}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={onShareClick}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onAiPanelToggle}>
          {isAiPanelOpen ? (
            <SidebarClose className="h-5 w-5 text-copy-muted" />
          ) : (
            <SidebarOpen className="h-5 w-5 text-copy-muted" />
          )}
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}
