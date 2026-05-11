"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Link2, Loader2, Mail, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Collaborator {
  email: string
  name: string | null
  imageUrl: string | null
}

interface OwnerInfo {
  name: string | null
  email: string | null
  imageUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectName: string
  isOwner: boolean
  ownerInfo: OwnerInfo
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
  ownerInfo,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchCollaborators = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (res.ok) setCollaborators(await res.json())
    } finally {
      setLoadingList(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) fetchCollaborators()
  }, [open, fetchCollaborators])

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase()
    if (!email || inviteLoading) return
    setInviteLoading(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error ?? `Failed to invite (${res.status})`)
      }
      const added: Collaborator = await res.json()
      setCollaborators((prev) =>
        prev.some((c) => c.email === added.email) ? prev : [...prev, added]
      )
      setInviteEmail("")
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to invite")
    } finally {
      setInviteLoading(false)
    }
  }

  async function handleRemove(email: string) {
    if (removingEmail) return
    setRemovingEmail(email)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.email !== email))
      }
    } finally {
      setRemovingEmail(null)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/editor/${projectId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalCount = 1 + collaborators.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="rounded-3xl bg-elevated text-copy-primary max-w-md gap-5"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-copy-primary">
            Share project
          </DialogTitle>
          <DialogDescription className="text-sm text-copy-muted">
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        {/* Workspace link card */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-surface-border bg-subtle px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-copy-primary">Workspace link</span>
            <span className="text-xs text-copy-muted">
              Share a direct link with teammates after you grant them access.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2"
            onClick={copyLink}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>

        {/* Invite input (owner only) */}
        {isOwner && (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-copy-muted" />
                <Input
                  type="email"
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInvite()
                  }}
                  className="h-10 pl-9 text-copy-primary"
                  disabled={inviteLoading}
                />
              </div>
              <Button
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail.trim()}
                className="h-10 shrink-0 bg-[var(--accent-primary)] text-[var(--bg-base)] hover:opacity-90"
              >
                {inviteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Invite"
                )}
              </Button>
            </div>
            {inviteError && (
              <p className="text-xs text-[var(--state-error)]">{inviteError}</p>
            )}
          </div>
        )}

        {/* People with access */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-copy-primary">People with access</span>
            <span className="text-xs text-copy-muted">{totalCount} total</span>
          </div>

          <ul className="flex flex-col gap-2">
            {/* Owner row */}
            <PersonRow
              name={ownerInfo.name}
              email={ownerInfo.email ?? ""}
              imageUrl={ownerInfo.imageUrl}
              role="OWNER"
            />

            {/* Collaborator rows */}
            {loadingList ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-5 w-5 animate-spin text-copy-faint" />
              </div>
            ) : (
              collaborators.map((c) => (
                <PersonRow
                  key={c.email}
                  name={c.name}
                  email={c.email}
                  imageUrl={c.imageUrl}
                  role="COLLABORATOR"
                  onRemove={isOwner ? () => handleRemove(c.email) : undefined}
                  isRemoving={removingEmail === c.email}
                />
              ))
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface PersonRowProps {
  name: string | null
  email: string
  imageUrl: string | null
  role: "OWNER" | "COLLABORATOR"
  onRemove?: () => void
  isRemoving?: boolean
}

function PersonRow({ name, email, imageUrl, role, onRemove, isRemoving }: PersonRowProps) {
  const initials = name
    ? name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : email.length > 0
    ? email[0].toUpperCase()
    : ""

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-surface-border bg-subtle px-4 py-3">
      {/* Avatar */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name ?? email}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xs font-semibold text-brand">
          {initials}
        </div>
      )}

      {/* Name + email */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          {name && (
            <span className="truncate text-sm font-medium text-copy-primary">{name}</span>
          )}
          <RoleBadge role={role} />
        </div>
        <span className="truncate text-xs text-copy-muted">{email}</span>
      </div>

      {/* Remove (collaborator rows, owner only) */}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={isRemoving}
          className="shrink-0 text-[var(--state-error)] hover:bg-[rgba(255,77,79,0.1)] hover:text-[var(--state-error)]"
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="sr-only">Remove</span>
        </Button>
      )}
    </li>
  )
}

function RoleBadge({ role }: { role: "OWNER" | "COLLABORATOR" }) {
  const isOwner = role === "OWNER"
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
        isOwner
          ? "border-[var(--accent-primary)] text-brand"
          : "border-surface-border text-copy-muted"
      }`}
    >
      {role}
    </span>
  )
}
