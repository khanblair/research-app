"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Quote, 
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { chatWithAI } from "@/lib/puter";
import { allCitationFormats, type CitationMetadata } from "@/lib/citation-formats";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { isApiFreeLlmRateLimitMessage, parseApiFreeLlmWaitSeconds } from "@/lib/apifreellm";
import {
  AI_MODELS,
  DEFAULT_AI_MODEL_ID,
  getModelById,
  isApiFreeLlmModelId,
} from "@/lib/ai-models";

function BibliographyPageContent() {
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("bookId");

  const [selectedBookId, setSelectedBookId] = useState<Id<"books"> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const [didApplyUrlSelection, setDidApplyUrlSelection] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_AI_MODEL_ID);
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
  const citations = useQuery(api.bibliography.list);
  const existingCitation = useQuery(
    api.bibliography.getByBook,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );
  const extractedTextData = useQuery(
    api.extractedTexts.getByBook,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );

  const createCitation = useMutation(api.bibliography.create);
  const deleteCitation = useMutation(api.bibliography.remove);

  const selectedBook = books?.find((b) => b._id === selectedBookId);
  const extractedText = extractedTextData?.fullText || null;

  // Apply URL-based selection once data is available.
  useEffect(() => {
    if (didApplyUrlSelection) return;
    if (!books) return;

    if (bookIdFromUrl && !selectedBookId) {
      const bookExists = books.some((b) => b._id === bookIdFromUrl);
      if (bookExists) {
        setSelectedBookId(bookIdFromUrl as Id<"books">);
      }
    }

    setDidApplyUrlSelection(true);
  }, [books, bookIdFromUrl, didApplyUrlSelection, selectedBookId]);

  const handleGenerateCitation = async () => {
    if (!selectedBookId || !selectedBook) {
      toast.error("Please select a book first");
      return;
    }

    if (isApiFreeLlm && isCoolingDown) {
      toast.error(`Please wait ${cooldownSecondsLeft || 5} seconds before generating again.`);
      return;
    }

    if (existingCitation) {
      toast.info("Citation already exists for this book");
      return;
    }

    setIsGenerating(true);
    try {
      if (isApiFreeLlm) setCooldownUntilMs(Date.now() + 5200);
      // Try to extract metadata using AI if we have extracted text
      let metadata: CitationMetadata = {
        title: selectedBook.title,
        authors: selectedBook.authors || ["Unknown"],
        publisher: selectedBook.publisher,
        year: selectedBook.year,
        edition: selectedBook.edition,
        isbn: selectedBook.isbn,
      };

      if (extractedText) {
        toast.loading("Analyzing document with AI to extract metadata...");
        
        const response = await chatWithAI([
          {
            role: "user",
            content: `Analyze this document and extract bibliographic metadata. Return ONLY a JSON object with these fields: title, authors (array), publisher, year, edition, isbn, doi, url. If a field cannot be determined, omit it or set to null.\n\nDocument excerpt:\n${extractedText.slice(0, 3000)}`,
          },
        ], { model: selectedModel });

        const aiText = (response.text as string) || "";
        
        // Try to extract JSON from AI response
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const aiMetadata = JSON.parse(jsonMatch[0]);
            // Merge AI metadata with book metadata (AI takes precedence if more complete)
            metadata = {
              title: aiMetadata.title || metadata.title,
              authors: (aiMetadata.authors && aiMetadata.authors.length > 0) 
                ? aiMetadata.authors 
                : metadata.authors,
              publisher: aiMetadata.publisher || metadata.publisher,
              year: aiMetadata.year || metadata.year,
              edition: aiMetadata.edition || metadata.edition,
              isbn: aiMetadata.isbn || metadata.isbn,
              doi: aiMetadata.doi,
              url: aiMetadata.url,
            };
            toast.success("Metadata extracted via AI");
          } catch (e) {
            console.warn("Failed to parse AI metadata, using book metadata");
          }
        }
      }

      // Generate formatted citation (IEEE by default)
      const formats = allCitationFormats(metadata);
      
      // Filter out null/undefined values from metadata
      const cleanMetadata = Object.fromEntries(
        Object.entries(metadata).filter(([_, v]) => v != null)
      ) as typeof metadata;
      
      await createCitation({
        bookId: selectedBookId,
        formattedCitation: formats.ieee,
        metadata: cleanMetadata,
      });

      toast.success("Citation generated successfully");
    } catch (error: any) {
      const msg = error?.message || "Failed to generate citation";
      if (isApiFreeLlmRateLimitMessage(msg)) {
        const wait = parseApiFreeLlmWaitSeconds(msg);
        toast.error(`Rate limit exceeded. Please wait ${wait ?? 5} seconds and try again.`);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, style: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStyle(style);
    toast.success(`${style} citation copied`);
    setTimeout(() => setCopiedStyle(null), 2000);
  };

  const handleDelete = async (citationId: Id<"citations">) => {
    try {
      await deleteCitation({ id: citationId });
      toast.success("Citation deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete citation");
    }
  };

  if (books === undefined || citations === undefined) {
    return <LoadingSpinner />;
  }

  if (books.length === 0) {
    return (
      <>
        <Breadcrumbs />
        <EmptyState
          icon={BookOpen}
          title="No books available"
          description="Upload books first to generate citations"
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bibliography</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              AI-powered citation generation in multiple formats
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Book Selection */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Book</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedBookId || ""} onValueChange={(v) => setSelectedBookId(v as Id<"books">)}>
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

            {selectedBookId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Citation Generator
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Automatically extract metadata and generate citations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">AI Model</div>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{model.name}</span>
                              <span className="text-xs text-muted-foreground">{model.provider}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{getModelById(selectedModel).description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium truncate ml-2">{selectedBook?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Authors:</span>
                      <span className="font-medium">
                        {selectedBook?.authors?.join(", ") || "Unknown"}
                      </span>
                    </div>
                    {selectedBook?.year && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium">{selectedBook.year}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    className="w-full"
                    onClick={handleGenerateCitation}
                    disabled={isGenerating || isCoolingDown || !!existingCitation}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : isCoolingDown ? (
                      <span className="tabular-nums">Wait {cooldownSecondsLeft || 5}s</span>
                    ) : existingCitation ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Already Generated
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Citation
                      </>
                    )}
                  </Button>

                  {!extractedText && (
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      💡 Extract text first for AI-enhanced metadata extraction
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">All Citations</CardTitle>
                <CardDescription className="text-xs">
                  {citations.length} citations generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {citations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No citations yet</p>
                  ) : (
                    <div className="space-y-2">
                      {citations.map((citation) => {
                        const book = books?.find((b) => b._id === citation.bookId);
                        return (
                          <div
                            key={citation._id}
                            className={`p-2 rounded-md border cursor-pointer hover:bg-accent transition-colors ${
                              selectedBookId === citation.bookId ? "bg-accent" : ""
                            }`}
                            onClick={() => setSelectedBookId(citation.bookId)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {book?.title || "Unknown"}
                                </p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  #{citation.citationNumber}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(citation._id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Citation Formats */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Citation Formats</CardTitle>
                <CardDescription>
                  {existingCitation 
                    ? "Multiple citation styles for your reference" 
                    : "Select a book and generate citation to see formats"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {existingCitation ? (
                  <Tabs defaultValue="ieee" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                      <TabsTrigger value="ieee">IEEE</TabsTrigger>
                      <TabsTrigger value="apa">APA</TabsTrigger>
                      <TabsTrigger value="mla">MLA</TabsTrigger>
                      <TabsTrigger value="chicago">Chicago</TabsTrigger>
                      <TabsTrigger value="harvard">Harvard</TabsTrigger>
                      <TabsTrigger value="vancouver">Vancouver</TabsTrigger>
                    </TabsList>

                    {Object.entries(
                      allCitationFormats(existingCitation.metadata, existingCitation.citationNumber)
                    ).map(([style, citation]) => (
                      <TabsContent key={style} value={style} className="space-y-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base capitalize">{style.toUpperCase()} Style</CardTitle>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(citation, style.toUpperCase())}
                              >
                                {copiedStyle === style.toUpperCase() ? (
                                  <>
                                    <Check className="mr-2 h-4 w-4 text-green-600" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="p-4 bg-muted rounded-md">
                              <p className="text-sm leading-relaxed">{citation}</p>
                            </div>

                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium">Metadata:</p>
                              <div className="grid gap-2 text-sm">
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground min-w-20">Title:</span>
                                  <span>{existingCitation.metadata.title}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground min-w-20">Authors:</span>
                                  <span>{existingCitation.metadata.authors.join(", ")}</span>
                                </div>
                                {existingCitation.metadata.publisher && (
                                  <div className="flex gap-2">
                                    <span className="text-muted-foreground min-w-20">Publisher:</span>
                                    <span>{existingCitation.metadata.publisher}</span>
                                  </div>
                                )}
                                {existingCitation.metadata.year && (
                                  <div className="flex gap-2">
                                    <span className="text-muted-foreground min-w-20">Year:</span>
                                    <span>{existingCitation.metadata.year}</span>
                                  </div>
                                )}
                                {existingCitation.metadata.doi && (
                                  <div className="flex gap-2">
                                    <span className="text-muted-foreground min-w-20">DOI:</span>
                                    <span>{existingCitation.metadata.doi}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <EmptyState
                    icon={Quote}
                    title="No citation selected"
                    description="Select a book and generate a citation to see it formatted in multiple styles"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BibliographyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BibliographyPageContent />
    </Suspense>
  );
}
