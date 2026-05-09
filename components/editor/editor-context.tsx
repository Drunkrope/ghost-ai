"use client"

import { createContext, useContext } from "react"

interface EditorContextValue {
  openCreate: () => void
}

export const EditorContext = createContext<EditorContextValue>({
  openCreate: () => {},
})

export function useEditorContext() {
  return useContext(EditorContext)
}
