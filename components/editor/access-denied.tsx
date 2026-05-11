import Link from "next/link"
import { Lock } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 bg-base">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-subtle">
          <Lock className="h-7 w-7 text-copy-muted" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-semibold text-copy-primary">Access denied</h1>
          <p className="max-w-xs text-sm text-copy-muted">
            This project doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
      </div>
      <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
        Back to editor
      </Link>
    </div>
  )
}
