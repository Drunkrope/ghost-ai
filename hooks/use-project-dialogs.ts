"use client"

import { useState } from "react"

import { Project } from "@/types/project"
import { MOCK_PROJECTS } from "@/lib/mock-projects"

type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slugPreview = toSlug(nameInput)

  function openCreate() {
    setNameInput("")
    setTargetProject(null)
    setOpenDialog("create")
  }

  function openRename(project: Project) {
    setNameInput(project.name)
    setTargetProject(project)
    setOpenDialog("rename")
  }

  function openDelete(project: Project) {
    setTargetProject(project)
    setOpenDialog("delete")
  }

  function closeDialog() {
    setOpenDialog(null)
    setTargetProject(null)
    setNameInput("")
  }

  function closeDialogIfCurrent(dialog: DialogType) {
    setOpenDialog((current) => {
      if (current !== dialog) return current
      setTargetProject(null)
      setNameInput("")
      return null
    })
  }

  function submitCreate() {
    if (isLoading) return
    if (!nameInput.trim()) return
    setIsLoading(true)
    const currentDialog = openDialog
    setTimeout(() => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: nameInput.trim(),
        slug: toSlug(nameInput.trim()),
        isOwned: true,
      }
      setProjects((prev) => [...prev, newProject])
      setIsLoading(false)
      closeDialogIfCurrent(currentDialog)
    }, 400)
  }

  function submitRename() {
    if (isLoading) return
    if (!nameInput.trim() || !targetProject) return
    setIsLoading(true)
    const currentDialog = openDialog
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === targetProject.id
            ? { ...p, name: nameInput.trim(), slug: toSlug(nameInput.trim()) }
            : p
        )
      )
      setIsLoading(false)
      closeDialogIfCurrent(currentDialog)
    }, 400)
  }

  function submitDelete() {
    if (isLoading) return
    if (!targetProject) return
    setIsLoading(true)
    const currentDialog = openDialog
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== targetProject.id))
      setIsLoading(false)
      closeDialogIfCurrent(currentDialog)
    }, 400)
  }

  return {
    projects,
    openDialog,
    targetProject,
    nameInput,
    setNameInput,
    slugPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}

export type UseProjectDialogsReturn = ReturnType<typeof useProjectDialogs>
