"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useEditorContext } from "./editor-context"

export function NewProjectButton() {
  const { openCreate } = useEditorContext()

  return (
    <Button onClick={openCreate} className="gap-2">
      <Plus className="h-4 w-4" />
      New Project
    </Button>
  )
}
