"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { QuickActions } from "./QuickActions";
import { chatWithAI } from "@/lib/puter";
import { isApiFreeLlmRateLimitMessage, parseApiFreeLlmWaitSeconds } from "@/lib/apifreellm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  bookId?: string;
  context?: string;
}

export function ChatInterface({ bookId, context }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownUntilMs, setCooldownUntilMs] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isCoolingDown = cooldownUntilMs ? Date.now() < cooldownUntilMs : false;

  useEffect(() => {
    if (!cooldownUntilMs) {
      setCooldownSecondsLeft(0);
      return;
    }

    const tick = () => {
      const msLeft = cooldownUntilMs - Date.now();
      const secondsLeft = Math.max(0, Math.ceil(msLeft / 1000));
      setCooldownSecondsLeft(secondsLeft);
      if (secondsLeft <= 0) {
        setCooldownUntilMs(null);
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [cooldownUntilMs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isCoolingDown) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextMessage = context
        ? `Context from the book:\n${context}\n\nUser question: ${input}`
        : input;

      const response = await chatWithAI([
        ...messages,
        { role: "user", content: contextMessage },
      ]);

      const assistantMessage: Message = {
        role: "assistant",
        content: (response.text as string) || "I couldn't generate a response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMsg = error?.message || error?.toString() || "Unknown error occurred";
      console.error("Chat error:", errorMsg, error);

      if (isApiFreeLlmRateLimitMessage(errorMsg)) {
        const wait = parseApiFreeLlmWaitSeconds(errorMsg) ?? 5;
        setCooldownUntilMs(Date.now() + wait * 1000);
      }

      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMsg}. If this is a rate limit, please wait a few seconds and try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your research
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Start a conversation</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Ask me anything about your research materials
            </p>
            <QuickActions onAction={handleQuickAction} />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question..."
            className="min-h-[60px] resize-none"
            disabled={isLoading || isCoolingDown}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isCoolingDown}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isCoolingDown ? (
              <span className="text-xs tabular-nums">{cooldownSecondsLeft || 5}s</span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isCoolingDown && (
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            Please wait {cooldownSecondsLeft || 5}s before sending another message.
          </p>
        )}
      </div>
    </div>
  );
}
