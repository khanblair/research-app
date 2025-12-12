"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Copy, Check, Loader2, MessageSquare } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { SummaryPanel } from "@/components/ai/SummaryPanel";
import { ParaphrasePanel } from "@/components/ai/ParaphrasePanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatIEEECitation } from "@/lib/citation";
import { loadPDF, extractTextFromPDF } from "@/lib/pdf-utils";
import { toast } from "sonner";
import { performOCR } from "@/lib/ocr";

export default function AnalysisPage() {
  const [selectedBookId, setSelectedBookId] = useState<Id<"books"> | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [needsOCR, setNeedsOCR] = useState(false);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const books = useQuery(api.books.list);
  const selectedBook = books?.find((b) => b._id === selectedBookId);
  const existingExtraction = useQuery(
    api.extractedTexts.getByBook,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );
  const saveExtractedText = useMutation(api.extractedTexts.save);

  // Load existing extraction when it changes
  if (existingExtraction && extractedText !== existingExtraction.fullText) {
    setExtractedText(existingExtraction.fullText);
  }

  const toProxiedPdfUrl = (sourceUrl: string) =>
    `/api/pdf?url=${encodeURIComponent(sourceUrl)}`;

  const MIN_REASONABLE_EXTRACT_LEN = 200;
  const looksLikeMostlyLinkFooter = (text: string) => {
    const t = (text || "").trim();
    if (!t) return false;
    const lines = t.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const urls = t.match(/https?:\/\/\S+/g) || [];

    // Very common certificate footer shape: one short line + one URL.
    if (lines.length <= 2 && urls.length >= 1 && t.length < 160) return true;

    // If almost everything is a URL or "verify" boilerplate, treat as footer.
    const nonUrl = t.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
    if (urls.length >= 1 && nonUrl.length < 40 && t.length < 220) return true;

    return false;
  };

  const isConvexHostedUrl = (sourceUrl: string) => {
    try {
      const u = new URL(sourceUrl);
      return u.hostname.toLowerCase().endsWith(".convex.cloud");
    } catch {
      return false;
    }
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId as Id<"books">);
    setExtractedText("");
    setNeedsOCR(false);
    // Extracted text will be loaded from existingExtraction query
  };

  const runOcrForPdf = async (pdf: any) => {
    // OCR is expensive; keep it bounded for UX.
    const OCR_MAX_PAGES = 3;
    const pages = Math.min(pdf.numPages || 1, OCR_MAX_PAGES);
    const parts: string[] = [];

    for (let i = 1; i <= pages; i++) {
      toast.loading(`Running OCR (page ${i}/${pages})...`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas rendering not available");

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/png");
      // Prefer Puter Vision (if available) with a Tesseract fallback for better accuracy.
      const text = await performOCR(dataUrl, true);
      parts.push(text);
    }

    return parts.join("\n\n");
  };

  const handleExtractText = async () => {
    if (!selectedBook) return;

    setIsExtracting(true);
    try {
      // Check if it's a PDF file
      if (selectedBook.fileType.toLowerCase() !== 'pdf') {
        toast.error("Currently only PDF files are supported for text extraction");
        return;
      }

      const source = selectedBook.fileUrl;

      // Prefer server-side PDF.co extraction (OCR + layout) to handle scanned PDFs.
      toast.loading("Extracting text with OCR (PDF.co)...");

      if (/^blob:/i.test(source)) {
        throw new Error("This book was uploaded using a temporary blob URL. Please delete it and re-upload so it is stored in Convex.");
      }

      if (!/^https?:\/\//i.test(source)) {
        throw new Error("This book file isn't stored as a fetchable URL yet. Please re-upload (Convex storage). ");
      }

      // Attempt PDF.co first.
      try {
        const resp = await fetch("/api/pdfco/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: source, lang: "eng" }),
        });

        if (!resp.ok) {
          const j = await resp.json().catch(() => null);
          const errMsg = (j?.error || `PDF.co extraction failed (${resp.status})`).toString();
          throw new Error(errMsg);
        }

        const j = (await resp.json()) as { text?: string };
        const extracted = (j?.text || "").trim();
        if (!extracted) {
          throw new Error("PDF.co returned no text");
        }

        // If PDF.co returned only a short footer/link (common on certificates),
        // fall through to page-image OCR for a better result.
        if (
          extracted.length >= MIN_REASONABLE_EXTRACT_LEN &&
          !looksLikeMostlyLinkFooter(extracted)
        ) {
          setExtractedText(extracted);
          setNeedsOCR(false);
          // Save to Convex for shared access across all pages
          if (selectedBookId) {
            await saveExtractedText({
              bookId: selectedBookId,
              fullText: extracted,
              extractionMethod: "pdfco",
              language: "eng",
            });
          }
          toast.success(`Extracted ${extracted.length} characters (PDF.co)`);
          return;
        }

        console.warn(
          "PDF.co extraction looks incomplete; falling back to page OCR:",
          extracted
        );
      } catch (pdfCoErr: any) {
        // Fall back to in-browser extraction.
        console.warn("PDF.co extraction failed; falling back to PDF.js:", pdfCoErr);
      }

      // Fallback: Load via same-origin proxy to avoid CORS issues with remote PDF URLs.
      toast.loading("Loading PDF (fallback)...");
      const pdf = await loadPDF(toProxiedPdfUrl(source));

      toast.loading(`Extracting embedded text from ${pdf.numPages} pages (fallback)...`);
      const fullText = await extractTextFromPDF(pdf);
      
      const trimmed = (fullText || "").trim();
      // If there's almost no selectable text, it's likely a scanned/image PDF.
      if (trimmed.length < MIN_REASONABLE_EXTRACT_LEN || looksLikeMostlyLinkFooter(trimmed)) {
        toast.loading("No embedded text found — running OCR (fallback)...");
        const ocrText = await runOcrForPdf(pdf);
        const ocrTrimmed = (ocrText || "").trim();
        if (!ocrTrimmed) {
          setNeedsOCR(true);
          setExtractedText(trimmed || "(No embedded text found in this PDF.)");
          toast.error("No embedded text found, and OCR produced no text.");
          return;
        }

        setExtractedText(ocrTrimmed);
        setNeedsOCR(false);
        // Save to Convex for shared access across all pages
        if (selectedBookId) {
          await saveExtractedText({
            bookId: selectedBookId,
            fullText: ocrTrimmed,
            extractionMethod: "ocr",
            pageCount: pdf.numPages,
          });
        }
        toast.success("OCR extraction complete");
        return;
      }
      
      setExtractedText(fullText);
      setNeedsOCR(false);
      // Save to Convex for shared access across all pages
      if (selectedBookId) {
        await saveExtractedText({
          bookId: selectedBookId,
          fullText: fullText,
          extractionMethod: "pdfjs",
          pageCount: pdf.numPages,
        });
      }
      toast.success(`Successfully extracted ${fullText.length} characters from ${pdf.numPages} pages`);
    } catch (error: any) {
      console.error("Text extraction failed:", error);
      const msg = (error?.message || "Unknown error").toString();

      // PDF.js throws ResponseException for non-2xx responses.
      // In our app, a common cause is the PDF proxy returning 400 when the target host
      // isn't allowlisted (to avoid becoming an open proxy).
      if (
        (error?.name === "ResponseException" || /ResponseException/i.test(msg)) &&
        (error?.status === 400 || /\(400\)/.test(msg))
      ) {
        toast.error(
          "The PDF URL might be blocked (e.g., localhost/private IP) or inaccessible. If it's a public URL, check that it's reachable."
        );
        return;
      }

      // Common cause: remote PDFs blocked by CORS/network (PDF.js uses fetch under the hood).
      toast.error(`Failed to extract text: ${msg}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRunOCR = async () => {
    if (!selectedBook) return;
    setIsOcrRunning(true);
    try {
      const source = selectedBook.fileUrl;
      if (!/^https?:\/\//i.test(source)) {
        toast.error("OCR currently requires a fetchable PDF URL (Convex storage or direct link). ");
        return;
      }
      const pdf = await loadPDF(toProxiedPdfUrl(source));
      const ocrText = await runOcrForPdf(pdf);
      const trimmed = (ocrText || "").trim();
      if (!trimmed) {
        toast.error("OCR produced no text");
        return;
      }
      setExtractedText(trimmed);
      setNeedsOCR(false);
      toast.success("OCR extraction complete");
    } catch (error: any) {
      console.error(error);
      const msg = (error?.message || "OCR failed").toString();
      if (
        (error?.name === "ResponseException" || /ResponseException/i.test(msg)) &&
        (error?.status === 400 || /\(400\)/.test(msg))
      ) {
        toast.error(
          "OCR couldn't load this PDF. The URL might be blocked (localhost/private IP) or inaccessible."
        );
        return;
      }
      toast.error(msg);
    } finally {
      setIsOcrRunning(false);
    }
  };

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`${format} citation copied`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyExtractedText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopiedFormat("Extracted Text");
    toast.success("Extracted text copied");
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Generate citations in multiple formats
  const getIEEECitation = () => {
    if (!selectedBook) return "";
    return formatIEEECitation({
      title: selectedBook.title,
      authors: selectedBook.authors || ["Unknown"],
      publisher: selectedBook.publisher,
      year: selectedBook.year,
    });
  };

  const getAPACitation = () => {
    if (!selectedBook) return "";
    const authors = selectedBook.authors?.[0] || "Unknown";
    const year = selectedBook.year || "n.d.";
    return `${authors}. (${year}). ${selectedBook.title}. ${selectedBook.publisher || "Self-published"}.`;
  };

  const getMLACitation = () => {
    if (!selectedBook) return "";
    const authors = selectedBook.authors?.[0] || "Unknown";
    const publisher = selectedBook.publisher || "Self-published";
    const year = selectedBook.year || "n.d.";
    return `${authors}. ${selectedBook.title}. ${publisher}, ${year}.`;
  };

  const getChicagoCitation = () => {
    if (!selectedBook) return "";
    const authors = selectedBook.authors?.[0] || "Unknown";
    const year = selectedBook.year || "n.d.";
    return `${authors}. ${selectedBook.title}. ${selectedBook.publisher || "Self-published"}, ${year}.`;
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
          description="Upload a book first to use AI analysis"
          action={
            <Button onClick={() => window.location.href = "/dashboard/library/upload"}>
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Analysis</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Analyze documents with AI-powered tools
          </p>
        </div>

        {/* Document Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Document</CardTitle>
            <CardDescription>
              Choose a document from your library to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedBookId || ""} onValueChange={handleBookSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a document..." />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book._id} value={book._id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{book.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {book.fileType.toUpperCase()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedBook && (
          <>
            {/* Document Info & Citations */}
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>
                  Reference formats and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{selectedBook.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Authors:</span>
                    <span className="font-medium">{selectedBook.authors?.join(", ") || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{selectedBook.fileType.toUpperCase()}</span>
                  </div>
                </div>

                <Separator />

                {/* Citation Formats */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Citation Formats</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2 rounded-md border p-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1">IEEE</p>
                        <p className="text-sm">{getIEEECitation()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(getIEEECitation(), "IEEE")}
                      >
                        {copiedFormat === "IEEE" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-md border p-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1">APA</p>
                        <p className="text-sm">{getAPACitation()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(getAPACitation(), "APA")}
                      >
                        {copiedFormat === "APA" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-md border p-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1">MLA</p>
                        <p className="text-sm">{getMLACitation()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(getMLACitation(), "MLA")}
                      >
                        {copiedFormat === "MLA" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-md border p-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1">Chicago</p>
                        <p className="text-sm">{getChicagoCitation()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(getChicagoCitation(), "Chicago")}
                      >
                        {copiedFormat === "Chicago" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Extraction */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Document Text</CardTitle>
                    <CardDescription>
                      Extract text from the document for AI analysis
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {extractedText && (
                      <>
                        <Button
                          variant="default"
                          onClick={() => window.location.href = "/dashboard/chat"}
                          disabled={isExtracting || isOcrRunning}
                          title="Chat with AI about this document"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat with AI
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleCopyExtractedText}
                          disabled={isExtracting || isOcrRunning}
                          title="Copy extracted text"
                        >
                          {copiedFormat === "Extracted Text" ? (
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
                      </>
                    )}
                    {needsOCR && (
                      <Button
                        variant="secondary"
                        onClick={handleRunOCR}
                        disabled={isOcrRunning || isExtracting}
                      >
                        {isOcrRunning ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            OCR...
                          </>
                        ) : (
                          <>Run OCR</>
                        )}
                      </Button>
                    )}
                    <Button onClick={handleExtractText} disabled={isExtracting || isOcrRunning}>
                      {isExtracting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Extract Text
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {extractedText && (
                <CardContent>
                  <div className="rounded-md bg-muted p-4 max-h-[300px] overflow-y-auto">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{extractedText}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {extractedText.length} characters extracted. This text will be used as context for AI queries.
                  </p>
                </CardContent>
              )}
            </Card>

            {/* AI Tools */}
            <Card>
              <CardHeader>
                <CardTitle>AI Tools</CardTitle>
                <CardDescription>
                  Analyze and interact with your document using AI
                  {!extractedText && (
                    <span className="block mt-1 text-amber-600 dark:text-amber-500">
                      Extract text first for better context-aware responses
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chat">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">Q&A</TabsTrigger>
                    <TabsTrigger value="summarize">Summarize</TabsTrigger>
                    <TabsTrigger value="paraphrase">Paraphrase</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="mt-4">
                    <div className="h-[600px] border rounded-lg">
                      <ChatInterface 
                        bookId={selectedBookId ?? undefined}
                        context={extractedText}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="summarize" className="mt-4">
                    <SummaryPanel />
                  </TabsContent>

                  <TabsContent value="paraphrase" className="mt-4">
                    <ParaphrasePanel />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
