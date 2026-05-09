import { Bot, FileText, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];
