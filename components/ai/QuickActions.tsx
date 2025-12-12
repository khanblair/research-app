"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, HelpCircle, FileText } from "lucide-react";

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

const quickPrompts = [
  {
    icon: BookOpen,
    label: "Summarize this chapter",
    prompt: "Can you summarize the main points from this chapter?",
  },
  {
    icon: Lightbulb,
    label: "Key takeaways",
    prompt: "What are the key takeaways from this section?",
  },
  {
    icon: HelpCircle,
    label: "Explain concept",
    prompt: "Can you explain this concept in simpler terms?",
  },
  {
    icon: FileText,
    label: "Related topics",
    prompt: "What other topics are related to this content?",
  },
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {quickPrompts.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => onAction(action.prompt)}
          >
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-sm">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
