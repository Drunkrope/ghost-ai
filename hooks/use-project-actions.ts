"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import type { Project } from "@/types/project"

type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()

  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [roomSuffix, setRoomSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slugPreview = nameInput.trim()
    ? `${toSlug(nameInput)}-${roomSuffix}`
    : ""

  function openCreate() {
    setNameInput("")
    setRoomSuffix(randomSuffix())
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

  async function submitCreate() {
    if (isLoading || !nameInput.trim()) return
    setIsLoading(true)
    setError(null)
    const currentDialog = openDialog
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        const message =
          payload?.error || payload?.message || `Failed to create project (${res.status})`
        throw new Error(message)
      }

      const project: Project = await res.json()
      closeDialogIfCurrent(currentDialog)
      router.push(`/editor/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRename() {
    if (isLoading || !nameInput.trim() || !targetProject) return
    setIsLoading(true)
    setError(null)
    const currentDialog = openDialog
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        const message =
          payload?.error || payload?.message || `Failed to rename project (${res.status})`
        throw new Error(message)
      }

      closeDialogIfCurrent(currentDialog)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename project")
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDelete() {
    if (isLoading || !targetProject) return
    setIsLoading(true)
    const currentDialog = openDialog
    const deletedId = targetProject.id
    try {
      const res = await fetch(`/api/projects/${deletedId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      closeDialogIfCurrent(currentDialog)
      if (pathname === `/editor/${deletedId}`) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    openDialog,
    targetProject,
    nameInput,
    setNameInput,
    slugPreview,
    isLoading,
    error,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}

export type UseProjectActionsReturn = ReturnType<typeof useProjectActions>
