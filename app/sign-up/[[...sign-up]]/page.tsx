import { SignUp } from "@clerk/nextjs";
import { Bot, Share2, FileText } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-base">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col px-14 py-10 border-r border-surface-border">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand flex-shrink-0" />
          <span className="text-base font-semibold text-copy-primary">Ghost AI</span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-[2.5rem] font-bold text-copy-primary leading-tight tracking-tight">
            Design systems at the<br />speed of thought.
          </h1>
          <p className="mt-4 text-sm text-copy-muted leading-relaxed">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <div className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-elevated border border-surface-border">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copy-primary">{title}</p>
                  <p className="mt-0.5 text-sm text-copy-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-copy-faint">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-4">
        <SignUp />
      </div>
    </div>
  );
}
