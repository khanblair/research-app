"use client";

import { useMemo, useState, useEffect, ReactElement } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Copy, 
  Check,
  Loader2, 
  BookOpen,
  Sparkles,
  RefreshCw,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { chatWithAI } from "@/lib/puter";
import {
  AI_MODELS,
  DEFAULT_AI_MODEL_ID,
  getModelById,
  isFreeModelId,
  isApiFreeLlmModelId,
} from "@/lib/ai-models";
import { toast } from "sonner";
import {
  isApiFreeLlmRateLimitMessage,
  parseApiFreeLlmWaitSeconds,
} from "@/lib/apifreellm";
import { useConvexUser } from "@/hooks/use-convex-user";

// Render markdown with proper formatting (same as in notes page)
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

  lines.forEach((line) => {
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
  return elements.length > 0 ? <>{elements}</> : <p>{text}</p>;
};

// Format inline markdown (bold, italic, code)
const formatInlineMarkdown = (text: string) => {
  const parts: (string | ReactElement)[] = [];
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

const sanitizeParaphraseOutput = (text: string) => {
  // Remove common model-inserted meta notes like:
  // [Note: The original text appears to cut off mid-sentence]
  return (text || "")
    .replace(/^\[Note:\s*The original text appears to cut off mid-sentence\]\s*$/gim, "")
    .replace(/^\[Note:.*\]\s*$/gim, "")
    .replace(/^You have reached your AI usage limit for this account\.?\s*$/gim, "")
    .trim();
};

const isUsageLimitMessage = (text: string) => {
  return /you have reached your ai usage limit for this account\.?/i.test(text || "");
};

const splitTextIntoChunks = (text: string, maxChars: number) => {
  const cleaned = (text || "").trim();
  if (!cleaned) return [] as string[];

  const paragraphs = cleaned.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = "";

  for (const p of paragraphs) {
    const para = p.trim();
    if (!para) continue;

    if (!current) {
      current = para;
      continue;
    }

    // If adding this paragraph would overflow, flush current chunk.
    if (current.length + 2 + para.length > maxChars) {
      chunks.push(current);
      current = para;
      continue;
    }

    current += `\n\n${para}`;
  }

  if (current) chunks.push(current);

  // Fallback: if a single paragraph is longer than maxChars, hard-split.
  const hardSplit: string[] = [];
  for (const c of chunks) {
    if (c.length <= maxChars) {
      hardSplit.push(c);
      continue;
    }
    for (let i = 0; i < c.length; i += maxChars) {
      hardSplit.push(c.slice(i, i + maxChars));
    }
  }

  return hardSplit;
};

export default function ParaphrasePage() {
  const [selectedBookId, setSelectedBookId] = useState<Id<"books"> | null>(null);
  // Default to free DeepSeek R1 model to avoid usage limits
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_AI_MODEL_ID);
  const [inputText, setInputText] = useState("");
  const [paraphrasedText, setParaphrasedText] = useState("");
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [savedParaphraseId, setSavedParaphraseId] = useState<Id<"paraphrasedTexts"> | null>(null);
  const [lastApiCallAtMs, setLastApiCallAtMs] = useState(0);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  const isApiFreeLlm = useMemo(() => isApiFreeLlmModelId(selectedModel), [selectedModel]);
  const cooldownUntilMs = useMemo(() => {
    if (!isApiFreeLlm) return null;
    if (!lastApiCallAtMs) return null;
    return lastApiCallAtMs + 5200;
  }, [isApiFreeLlm, lastApiCallAtMs]);

  const isCoolingDown = useMemo(() => {
    if (!isApiFreeLlm) return false;
    if (!cooldownUntilMs) return false;
    return Date.now() < cooldownUntilMs;
  }, [cooldownUntilMs, isApiFreeLlm]);

  useEffect(() => {
    if (!isApiFreeLlm) {
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

  const { user: convexUser } = useConvexUser();

  const books = useQuery(
    api.books.list,
    convexUser ? { userId: convexUser._id } : "skip"
  );
  const selectedBook = books?.find((b) => b._id === selectedBookId);
  const extractedTextData = useQuery(
    api.extractedTexts.getByBook,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );
  const extractedText = extractedTextData?.fullText;
  const existingParaphrase = useQuery(
    api.paraphrasedTexts.getByBook,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );

  const saveParaphrase = useMutation(api.paraphrasedTexts.save);

  // Auto-load extracted text when book is selected
  useEffect(() => {
    if (selectedBookId && extractedText) {
      // Load the full extracted text so nothing is cut off in the UI.
      setInputText(extractedText);
      setParaphrasedText("");
      setHasCopied(false);
      setSavedParaphraseId(null);
      
      // Load existing paraphrase if available
      if (existingParaphrase) {
        setParaphrasedText(sanitizeParaphraseOutput(existingParaphrase.paraphrasedText));
        setSavedParaphraseId(existingParaphrase._id);
        // Keep the app on free models by default (avoid Puter usage-limit errors).
        setSelectedModel(
          isFreeModelId(existingParaphrase.model)
            ? existingParaphrase.model
            : DEFAULT_AI_MODEL_ID
        );
      }
    }
  }, [selectedBookId, extractedText, existingParaphrase]);

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId as Id<"books">);
    setHasCopied(false);
  };

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to paraphrase");
      return;
    }

    if (!selectedBookId) {
      toast.error("Please select a document first");
      return;
    }

    if (!convexUser) {
      toast.error("Loading your profile… please try again in a moment");
      return;
    }

    if (isApiFreeLlm && isCoolingDown) {
      toast.error(`Please wait ${cooldownSecondsLeft || 5} seconds before paraphrasing again.`);
      return;
    }

    setIsParaphrasing(true);
    setHasCopied(false);

    try {
      // Fewer calls helps with rate/usage limits.
      const MAX_CHARS_PER_CHUNK = 8000;
      const chunks = splitTextIntoChunks(inputText, MAX_CHARS_PER_CHUNK);
      if (chunks.length === 0) throw new Error("No text to paraphrase");

      let modelToUse = selectedModel;
      const parts: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        const toastId = toast.loading(`Paraphrasing part ${i + 1}/${chunks.length}...`);
        try {
          const prompt = `Paraphrase the following text into clear, natural, conversational English. Make it easy to understand while preserving all the important information and meaning. Remove any AI-generated formality or complexity and make it sound more human and accessible.

IMPORTANT: Do not add any notes, comments, disclaimers, or bracketed meta text (like [Note: ...]). Just output the paraphrased content.

Text to paraphrase (part ${i + 1} of ${chunks.length}):
${chunks[i]}

Paraphrased version:`;

          const runChunk = async (allowFallback: boolean): Promise<string> => {
            if (modelToUse === "apifreellm-free") {
              setLastApiCallAtMs(Date.now());
            }
            const response = await chatWithAI(
              [{ role: "user", content: prompt }],
              { model: modelToUse, max_tokens: 1200 }
            );

            const raw = (response.text as string) || "";
            if (isUsageLimitMessage(raw)) {
              // Auto-fallback from Puter to the free default model.
              if (allowFallback && !isFreeModelId(modelToUse)) {
                modelToUse = DEFAULT_AI_MODEL_ID;
                setSelectedModel(DEFAULT_AI_MODEL_ID);
                return await runChunk(false);
              }
              throw new Error("AI usage limit reached");
            }

            // ApiFreeLLM free API rate limit (1 req / 5 seconds) can be returned as text.
            if (isApiFreeLlmRateLimitMessage(raw)) {
              const wait = parseApiFreeLlmWaitSeconds(raw) ?? 5;
              throw new Error(`Rate limit exceeded. Please wait ${wait} seconds.`);
            }

            return sanitizeParaphraseOutput(raw);
          };

          const part = await runChunk(true);
          if (!part) throw new Error("Empty paraphrase returned");
          parts.push(part);

          // Respect ApiFreeLLM free API rate limit: 1 request per 5 seconds.
          if (modelToUse === "apifreellm-free" && i < chunks.length - 1) {
            await new Promise((r) => setTimeout(r, 5200));
          }
        } finally {
          toast.dismiss(toastId);
        }
      }

      const paraphrased = sanitizeParaphraseOutput(parts.join("\n\n"));
      setParaphrasedText(paraphrased);

      // Save to database
      const id = await saveParaphrase({
        id: savedParaphraseId || undefined,
        userId: convexUser._id,
        bookId: selectedBookId,
        originalText: inputText,
        paraphrasedText: paraphrased,
        model: modelToUse,
      });
      
      setSavedParaphraseId(id);
      toast.success("Text paraphrased and saved successfully");
    } catch (error: any) {
      const msg = String(error?.message || "Failed to paraphrase text");
      if (/usage limit/i.test(msg)) {
        toast.error("AI usage limit hit. Switched to the free model; please try again.");
      } else if (/rate limit/i.test(msg)) {
        toast.error(msg);
      } else {
        toast.error(msg);
        console.error("Paraphrase error:", error);
      }
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleRegenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to paraphrase");
      return;
    }

    if (!selectedBookId) {
      toast.error("Please select a document first");
      return;
    }

    if (!convexUser) {
      toast.error("Loading your profile… please try again in a moment");
      return;
    }

    if (isApiFreeLlm && isCoolingDown) {
      toast.error(`Please wait ${cooldownSecondsLeft || 5} seconds before regenerating again.`);
      return;
    }

    setIsParaphrasing(true);
    setHasCopied(false);

    try {
      const MAX_CHARS_PER_CHUNK = 8000;
      const chunks = splitTextIntoChunks(inputText, MAX_CHARS_PER_CHUNK);
      if (chunks.length === 0) throw new Error("No text to paraphrase");

      let modelToUse = selectedModel;
      const parts: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        const toastId = toast.loading(`Regenerating part ${i + 1}/${chunks.length}...`);
        try {
          const prompt = `Paraphrase the following text into clear, natural, conversational English. Use a different approach than before - make it sound fresh and use alternative word choices while keeping the same meaning. Make it easy to understand and sound more human.

IMPORTANT: Do not add any notes, comments, disclaimers, or bracketed meta text (like [Note: ...]). Just output the paraphrased content.

Text to paraphrase (part ${i + 1} of ${chunks.length}):
${chunks[i]}

New paraphrased version:`;

          const runChunk = async (allowFallback: boolean): Promise<string> => {
            if (modelToUse === "apifreellm-free") {
              setLastApiCallAtMs(Date.now());
            }
            const response = await chatWithAI(
              [{ role: "user", content: prompt }],
              { model: modelToUse, max_tokens: 1200 }
            );

            const raw = (response.text as string) || "";
            if (isUsageLimitMessage(raw)) {
              if (allowFallback && !isFreeModelId(modelToUse)) {
                modelToUse = DEFAULT_AI_MODEL_ID;
                setSelectedModel(DEFAULT_AI_MODEL_ID);
                return await runChunk(false);
              }
              throw new Error("AI usage limit reached");
            }

            if (isApiFreeLlmRateLimitMessage(raw)) {
              const wait = parseApiFreeLlmWaitSeconds(raw) ?? 5;
              throw new Error(`Rate limit exceeded. Please wait ${wait} seconds.`);
            }

            return sanitizeParaphraseOutput(raw);
          };

          const part = await runChunk(true);
          if (!part) throw new Error("Empty paraphrase returned");
          parts.push(part);

          if (modelToUse === "apifreellm-free" && i < chunks.length - 1) {
            await new Promise((r) => setTimeout(r, 5200));
          }
        } finally {
          toast.dismiss(toastId);
        }
      }

      const paraphrased = sanitizeParaphraseOutput(parts.join("\n\n"));
      setParaphrasedText(paraphrased);

      // Update database
      const id = await saveParaphrase({
        id: savedParaphraseId || undefined,
        userId: convexUser._id,
        bookId: selectedBookId,
        originalText: inputText,
        paraphrasedText: paraphrased,
        model: modelToUse,
      });
      
      setSavedParaphraseId(id);
      toast.success("Text regenerated and updated successfully");
    } catch (error: any) {
      const msg = String(error?.message || "Failed to regenerate text");
      if (/usage limit/i.test(msg)) {
        toast.error("AI usage limit hit. Switched to the free model; please try again.");
      } else if (/rate limit/i.test(msg)) {
        toast.error(msg);
      } else {
        toast.error(msg);
        console.error("Regenerate error:", error);
      }
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleCopy = async () => {
    if (!paraphrasedText) {
      toast.error("No paraphrased text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(paraphrasedText);
      setHasCopied(true);
      toast.success("Copied to clipboard");
      
      // Reset copy status after 2 seconds
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleClear = () => {
    setInputText("");
    setParaphrasedText("");
    setHasCopied(false);
    setSavedParaphraseId(null);
  };

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
          description="Upload books first to start paraphrasing"
          action={
            <Link href="/dashboard/library/upload">
              <Button>Upload Book</Button>
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs />
      
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Paraphrase</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Transform AI-generated or complex text into clear, natural English
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Settings */}
          <div className="lg:col-span-3 space-y-4">
            {/* Book Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Document</CardTitle>
                <CardDescription className="text-xs">
                  Choose a document to paraphrase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedBookId || ""} onValueChange={handleBookSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {books?.map((book) => (
                      <SelectItem key={book._id} value={book._id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedBookId && extractedText && (
                  <Badge variant="outline" className="w-full justify-center text-xs">
                    Text auto-loaded ({extractedText.length} chars available)
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* AI Model Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Model</CardTitle>
                <CardDescription className="text-xs">
                  Select the AI model for paraphrasing
                </CardDescription>
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

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClear}
                  disabled={!inputText && !paraphrasedText}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
                {paraphrasedText && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCopy}
                    >
                      {hasCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Output
                        </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={handleRegenerate}
                      disabled={isParaphrasing || isCoolingDown}
                    >
                      {isParaphrasing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : isCoolingDown ? (
                        <span className="tabular-nums">Wait {cooldownSecondsLeft || 5}s</span>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li>• Text auto-loads when you select a document</li>
                  <li>• AI converts complex language to simple English</li>
                  <li>• Try different models for varied results</li>
                  <li>• Regenerate for alternative phrasings</li>
                  <li>• All outputs are automatically saved</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Middle - Input Text */}
          <div className="lg:col-span-4">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Input Text</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {selectedBook ? selectedBook.title : "Select a document to begin"}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {inputText.length} chars
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[calc(100vh-20rem)]">
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="h-full p-4">
                      <Textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Text will auto-load when you select a document... You can also paste your own text here."
                        className="h-full min-h-0 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                      />
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <Button 
                      className="w-full" 
                      onClick={handleParaphrase}
                      disabled={isParaphrasing || isCoolingDown || !inputText.trim()}
                    >
                      {isParaphrasing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Paraphrasing...
                        </>
                      ) : isCoolingDown ? (
                        <span className="tabular-nums">Wait {cooldownSecondsLeft || 5}s</span>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Paraphrase Text
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Output Text */}
          <div className="lg:col-span-5">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Paraphrased Output</CardTitle>
                    <CardDescription className="text-xs mt-1 flex items-center gap-2">
                      {paraphrasedText ? (
                        <>
                          <Badge variant="secondary" className="text-xs">
                            {getModelById(selectedModel).name}
                          </Badge>
                          <span>Clear, natural English</span>
                        </>
                      ) : (
                        "Your paraphrased text will appear here"
                      )}
                    </CardDescription>
                  </div>
                  {paraphrasedText && (
                    <Badge variant="outline" className="text-xs">
                      {paraphrasedText.length} chars
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  <div className="p-4 max-w-full">
                  {!paraphrasedText ? (
                    <div className="h-full flex items-center justify-center">
                      <EmptyState
                        icon={Sparkles}
                        title="No output yet"
                        description="Click 'Paraphrase Text' to transform your input into clear, natural English"
                      />
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                        {renderMarkdown(paraphrasedText)}
                      </div>
                    </div>
                  )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
