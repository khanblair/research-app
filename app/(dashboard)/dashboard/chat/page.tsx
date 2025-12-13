"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Plus, 
  Trash2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { chatWithAI } from "@/lib/puter";
import { AI_MODELS, DEFAULT_AI_MODEL_ID, getModelById, isApiFreeLlmModelId } from "@/lib/ai-models";
import { isApiFreeLlmRateLimitMessage, parseApiFreeLlmWaitSeconds } from "@/lib/apifreellm";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { useSearchParams } from "next/navigation";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("bookId");
  const sessionIdFromUrl = searchParams.get("sessionId");
  
  const [selectedBookId, setSelectedBookId] = useState<Id<"books"> | null>(null);
  const [additionalBookIds, setAdditionalBookIds] = useState<Id<"books">[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<Id<"chatSessions"> | null>(null);
  // Default to free ApiFreeLLM to avoid Puter usage limits
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_AI_MODEL_ID);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownUntilMs, setCooldownUntilMs] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  const isApiFreeLlm = useMemo(() => isApiFreeLlmModelId(selectedModel), [selectedModel]);
  const isCoolingDown = useMemo(() => {
    if (!isApiFreeLlm) return false;
    if (!cooldownUntilMs) return false;
    return Date.now() < cooldownUntilMs;
  }, [cooldownUntilMs, isApiFreeLlm]);

  useEffect(() => {
    if (!isApiFreeLlm) {
      setCooldownUntilMs(null);
      setCooldownSecondsLeft(0);
      return;
    }

    if (!cooldownUntilMs) {
      setCooldownSecondsLeft(0);
      return;
    }

    const tick = () => {
      const msLeft = cooldownUntilMs - Date.now();
      setCooldownSecondsLeft(Math.max(0, Math.ceil(msLeft / 1000)));
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [cooldownUntilMs, isApiFreeLlm]);

  const books = useQuery(api.books.list);
  
  // Set book from URL parameter on initial load
  useEffect(() => {
    if (bookIdFromUrl && books && !selectedBookId) {
      const bookExists = books.find(b => b._id === bookIdFromUrl);
      if (bookExists) {
        setSelectedBookId(bookIdFromUrl as Id<"books">);
      }
    }
  }, [bookIdFromUrl, books, selectedBookId]);
  const sessions = useQuery(
    api.chatSessions.list,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );

  // Set session from URL parameter once sessions are loaded.
  useEffect(() => {
    if (!sessionIdFromUrl) return;
    if (!sessions) return;
    if (selectedSessionId) return;

    const sessionExists = sessions.some((s) => s._id === sessionIdFromUrl);
    if (sessionExists) {
      setSelectedSessionId(sessionIdFromUrl as Id<"chatSessions">);
    }
  }, [sessionIdFromUrl, sessions, selectedSessionId]);
  const currentSession = useQuery(
    api.chatSessions.get,
    selectedSessionId ? { id: selectedSessionId } : "skip"
  );
  
  // Query all extracted texts once (avoids Rules of Hooks violation)
  const allExtractedTexts = useQuery(api.extractedTexts.list);

  const createSession = useMutation(api.chatSessions.create);
  const addMessage = useMutation(api.chatSessions.addMessage);
  const deleteSession = useMutation(api.chatSessions.remove);

  const selectedBook = books?.find((b) => b._id === selectedBookId);

  // Build combined context from all selected books
  const buildCombinedContext = () => {
    if (!allExtractedTexts) return undefined;
    
    const contexts: string[] = [];
    
    // Add primary book context
    if (selectedBookId) {
      const primaryExtraction = allExtractedTexts.find((e) => e.bookId === selectedBookId);
      if (primaryExtraction?.fullText) {
        const bookTitle = selectedBook?.title || "Primary Document";
        contexts.push(`--- ${bookTitle} ---\n${primaryExtraction.fullText.slice(0, 5000)}`);
      }
    }
    
    // Add additional books context
    additionalBookIds.forEach((bookId) => {
      const extraction = allExtractedTexts.find((e) => e.bookId === bookId);
      if (extraction?.fullText) {
        const book = books?.find((b) => b._id === bookId);
        const bookTitle = book?.title || "Additional Document";
        contexts.push(`--- ${bookTitle} ---\n${extraction.fullText.slice(0, 3000)}`);
      }
    });
    
    return contexts.length > 0 ? contexts.join("\n\n") : undefined;
  };

  const extractedText = buildCombinedContext();

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId as Id<"books">);
    setSelectedSessionId(null);
  };

  const handleNewSession = async () => {
    if (!selectedBookId) {
      toast.error("Please select a book first");
      return;
    }

    try {
      const sessionId = await createSession({
        bookId: selectedBookId,
        title: `Chat - ${new Date().toLocaleString()}`,
        extractedText,
        model: selectedModel,
      });
      setSelectedSessionId(sessionId);
      toast.success("New chat session created");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create session");
    }
  };

  const handleDeleteSession = async (sessionId: Id<"chatSessions">) => {
    try {
      await deleteSession({ id: sessionId });
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
      }
      toast.success("Session deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete session");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedSessionId) return;

    if (isApiFreeLlm && isCoolingDown) {
      toast.error(`Please wait ${cooldownSecondsLeft || 5} seconds before sending another message.`);
      return;
    }

    setIsLoading(true);
    const userMessage = input.trim();
    setInput("");

    try {
      // ApiFreeLLM free API is rate-limited: 1 request / 5 seconds.
      // Start cooldown immediately to prevent rapid consecutive sends.
      if (isApiFreeLlm) {
        setCooldownUntilMs(Date.now() + 5200);
      }

      // Add user message to session
      await addMessage({
        sessionId: selectedSessionId,
        role: "user",
        content: userMessage,
      });

      // Build context-aware prompt
      const contextMessage = extractedText
        ? `Context from the document:\n${extractedText.slice(0, 8000)}\n\nUser question: ${userMessage}`
        : userMessage;

      // Get AI response
      const messages = currentSession?.messages || [];
      const response = await chatWithAI(
        [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: contextMessage },
        ],
        { model: selectedModel }
      );

      const assistantContent = (response.text as string) || "I couldn't generate a response.";

      // Add assistant message to session
      await addMessage({
        sessionId: selectedSessionId,
        role: "assistant",
        content: assistantContent,
      });
    } catch (error: any) {
      const errorMsg = error?.message || "Unknown error";
      console.error("Chat error:", errorMsg, error);
      if (isApiFreeLlm && isApiFreeLlmRateLimitMessage(errorMsg)) {
        const wait = parseApiFreeLlmWaitSeconds(errorMsg);
        toast.error(`Rate limit exceeded. Please wait ${wait ?? 5} seconds and try again.`);
      } else if (isApiFreeLlm && /internal server error/i.test(errorMsg)) {
        toast.error("ApiFreeLLM is temporarily unavailable. Please wait 5 seconds and try again.");
      } else {
        toast.error(`Chat error: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // (rest of component unchanged)

  if (books === undefined) {
    return <LoadingSpinner />;
  }

  if (books.length === 0) {
    return (
      <>
        <Breadcrumbs />
        <EmptyState
          icon={BookOpen}
          title="No books available"
          description="Upload a book first to start chatting with AI"
          action={
            <Button onClick={() => (window.location.href = "/dashboard/library/upload")}>
              Upload Book
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs />

      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Chat</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Have intelligent conversations about your documents
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Book Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Book</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedBookId || ""} onValueChange={handleBookSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books?.map((book) => (
                      <SelectItem key={book._id} value={book._id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Model Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Model</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {getModelById(selectedModel).provider}
                </p>
              </CardContent>
            </Card>

            {/* Additional Books for Multi-Document Context */}
            {selectedBookId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Additional Context
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Add more books for multi-document analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Select
                    value=""
                    onValueChange={(bookId) => {
                      if (
                        bookId !== selectedBookId &&
                        !additionalBookIds.includes(bookId as Id<"books">)
                      ) {
                        setAdditionalBookIds([...additionalBookIds, bookId as Id<"books">]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add another book..." />
                    </SelectTrigger>
                    <SelectContent>
                      {books
                        ?.filter(
                          (b) =>
                            b._id !== selectedBookId &&
                            !additionalBookIds.includes(b._id)
                        )
                        .map((book) => (
                          <SelectItem key={book._id} value={book._id}>
                            {book.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {additionalBookIds.length > 0 && (
                    <div className="space-y-1">
                      {additionalBookIds.map((bookId) => {
                        const book = books?.find((b) => b._id === bookId);
                        return (
                          <div
                            key={bookId}
                            className="flex items-center justify-between p-2 rounded-md bg-muted text-sm"
                          >
                            <span className="truncate flex-1">
                              {book?.title || "Unknown"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                setAdditionalBookIds(
                                  additionalBookIds.filter((id) => id !== bookId)
                                )
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {additionalBookIds.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Analyzing {additionalBookIds.length + 1} documents
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sessions */}
            {selectedBookId && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Chat Sessions</CardTitle>
                    <Button size="sm" variant="ghost" onClick={handleNewSession}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ScrollArea className="h-[300px]">
                    {sessions === undefined ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : sessions.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No sessions yet</div>
                    ) : (
                      sessions.map((session) => (
                        <div
                          key={session._id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
                            selectedSessionId === session._id ? "bg-accent" : ""
                          }`}
                          onClick={() => setSelectedSessionId(session._id)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.messages.length} messages
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session._id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-9">
            <Card className="h-[calc(100vh-16rem)]">
              {!selectedSessionId ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState
                    icon={MessageSquare}
                    title="No chat session selected"
                    description="Select a book and create a new chat session to get started"
                    action={
                      selectedBookId ? (
                        <Button onClick={handleNewSession}>
                          <Plus className="mr-2 h-4 w-4" />
                          New Chat Session
                        </Button>
                      ) : null
                    }
                  />
                </div>
              ) : (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedBook?.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{getModelById(selectedModel).name}</Badge>
                          {extractedText && (
                            <Badge variant="outline">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Context: {extractedText.length} chars
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <ScrollArea className="flex-1 p-4 h-[calc(100%-12rem)]">
                    {currentSession?.messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-center">
                        <div>
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                          <p className="text-sm text-muted-foreground">
                            Ask anything about your document
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentSession?.messages.map((message, index) => (
                          <ChatMessage
                            key={index}
                            message={{ role: message.role, content: message.content }}
                          />
                        ))}
                        {isLoading && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  <CardContent className="border-t p-4">
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
                        placeholder="Ask a question about your document..."
                        className="resize-none"
                        rows={2}
                        disabled={isLoading}
                      />
                      <Button onClick={handleSend} disabled={isLoading || isCoolingDown || !input.trim()}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isCoolingDown ? (
                          <span className="text-xs tabular-nums">{cooldownSecondsLeft || 5}s</span>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatPageContent />
    </Suspense>
  );
}
