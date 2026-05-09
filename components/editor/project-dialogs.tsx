"use client"

import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UseProjectDialogsReturn } from "@/hooks/use-project-dialogs"

interface ProjectDialogsProps {
  dialogs: UseProjectDialogsReturn
}

export function ProjectDialogs({ dialogs }: ProjectDialogsProps) {
  const {
    openDialog,
    targetProject,
    nameInput,
    setNameInput,
    slugPreview,
    isLoading,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = dialogs

  return (
    <>
      <CreateProjectDialog
        open={openDialog === "create"}
        nameInput={nameInput}
        setNameInput={setNameInput}
        slugPreview={slugPreview}
        isLoading={isLoading}
        onClose={closeDialog}
        onSubmit={submitCreate}
      />
      <RenameProjectDialog
        open={openDialog === "rename"}
        currentName={targetProject?.name ?? ""}
        nameInput={nameInput}
        setNameInput={setNameInput}
        isLoading={isLoading}
        onClose={closeDialog}
        onSubmit={submitRename}
      />
      <DeleteProjectDialog
        open={openDialog === "delete"}
        projectName={targetProject?.name ?? ""}
        isLoading={isLoading}
        onClose={closeDialog}
        onSubmit={submitDelete}
      />
    </>
  )
}

interface CreateDialogProps {
  open: boolean
  nameInput: string
  setNameInput: (v: string) => void
  slugPreview: string
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}

function CreateProjectDialog({
  open,
  nameInput,
  setNameInput,
  slugPreview,
  isLoading,
  onClose,
  onSubmit,
}: CreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent showCloseButton={false} className="rounded-3xl bg-elevated text-copy-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">New Project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Give your architecture workspace a name.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Input
            autoFocus
            placeholder="Project name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSubmit() }}
            className="h-9 text-copy-primary"
          />
          <p className="text-xs text-copy-muted">
            Slug:{" "}
            <span className="font-mono text-copy-secondary">
              {slugPreview || "your-project-slug"}
            </span>
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !nameInput.trim()}>
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RenameDialogProps {
  open: boolean
  currentName: string
  nameInput: string
  setNameInput: (v: string) => void
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}

function RenameProjectDialog({
  open,
  currentName,
  nameInput,
  setNameInput,
  isLoading,
  onClose,
  onSubmit,
}: RenameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent showCloseButton={false} className="rounded-3xl bg-elevated text-copy-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Rename Project</DialogTitle>
          {currentName && (
            <DialogDescription className="text-copy-muted">
              Renaming &ldquo;{currentName}&rdquo;
            </DialogDescription>
          )}
        </DialogHeader>

        <Input
          autoFocus
          placeholder="New project name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit() }}
          className="h-9 text-copy-primary"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !nameInput.trim()}>
            {isLoading ? "Renaming…" : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteDialogProps {
  open: boolean
  projectName: string
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}

function DeleteProjectDialog({
  open,
  projectName,
  isLoading,
  onClose,
  onSubmit,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent showCloseButton={false} className="rounded-3xl bg-elevated text-copy-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Delete Project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Are you sure you want to delete &ldquo;{projectName}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Deleting…" : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
