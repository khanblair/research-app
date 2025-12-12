"use client";

import { useState, ReactElement } from "react";
import { User, Bot, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

// Strip markdown symbols for copying
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .trim();
};

// Render markdown with proper formatting
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: ReactElement[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join('\n');
      elements.push(
        <p key={key++} className="mb-3 last:mb-0">
          {formatInlineMarkdown(content)}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line, idx) => {
    // Headers
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h1Match) {
      flushParagraph();
      elements.push(
        <h1 key={key++} className="text-xl font-bold mb-3 mt-4 first:mt-0">
          {formatInlineMarkdown(h1Match[1])}
        </h1>
      );
    } else if (h2Match) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-lg font-bold mb-2 mt-3 first:mt-0">
          {formatInlineMarkdown(h2Match[1])}
        </h2>
      );
    } else if (h3Match) {
      flushParagraph();
      elements.push(
        <h3 key={key++} className="text-base font-semibold mb-2 mt-2 first:mt-0">
          {formatInlineMarkdown(h3Match[1])}
        </h3>
      );
    } else if (line.trim() === '') {
      flushParagraph();
    } else {
      currentParagraph.push(line);
    }
  });

  flushParagraph();
  return elements.length > 0 ? elements : <p>{text}</p>;
};

// Format inline markdown (bold, italic, code)
const formatInlineMarkdown = (text: string) => {
  const parts: (string | ReactElement)[] = [];
  let remaining = text;
  let key = 0;

  // Process bold (**text** or __text__)
  const boldRegex = /(\*\*|__)(.+?)\1/g;
  let match;
  let lastIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = stripMarkdown(message.content);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Message copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={cn(
            "rounded-lg p-3",
            isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
          )}
        >
          <div className="text-sm leading-relaxed">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              renderMarkdown(message.content)
            )}
          </div>
        </div>
        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-fit text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
