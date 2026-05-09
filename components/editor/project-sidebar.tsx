"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/types/project"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  onNewProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((p) => p.isOwned)
  const sharedProjects = projects.filter((p) => !p.isOwned)

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={onClose}
        />
      )}

      <aside
        role="complementary"
        aria-label="Project sidebar"
        className={`fixed left-0 top-12 z-40 flex h-[calc(100vh-3rem)] w-72 flex-col border-r border-surface-border bg-surface transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <span className="text-sm font-semibold text-copy-primary">Projects</span>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4 text-copy-muted" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col overflow-hidden">
          <div className="px-3 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1 text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1 text-xs">
                Shared
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-projects" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {ownedProjects.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <span className="text-sm text-copy-faint">No projects yet</span>
                </div>
              ) : (
                <ul className="p-2">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="mt-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {sharedProjects.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <span className="text-sm text-copy-faint">No shared projects</span>
                </div>
              ) : (
                <ul className="p-2">
                  {sharedProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-3">
          <Button variant="outline" className="w-full gap-2" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

interface ProjectItemProps {
  project: Project
  onRename?: (project: Project) => void
  onDelete?: (project: Project) => void
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  const showActions = project.isOwned && (onRename || onDelete)

  return (
    <li className="group flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-subtle">
      <span className="flex-1 truncate text-sm text-copy-secondary">
        {project.name}
      </span>
      {showActions && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {onRename && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                onRename(project)
              }}
            >
              <Pencil className="h-3.5 w-3.5 text-copy-muted" />
              <span className="sr-only">Rename</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project)
              }}
            >
              <Trash2 className="h-3.5 w-3.5 text-copy-muted" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      )}
    </li>
  )
}
