"use client";

import { useState, ReactElement } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Plus, 
  Sparkles, 
  Trash2, 
  BookOpen,
  Loader2,
  Filter,
  Edit3,
  Clock,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { chatWithAI } from "@/lib/puter";
import { toast } from "sonner";

// Render markdown with proper formatting (same as ChatMessage)
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

export default function NotesPage() {
  const [selectedBookId, setSelectedBookId] = useState<Id<"books"> | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<Id<"notes"> | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "manual" | "ai">("all");

  const books = useQuery(api.books.list);
  const allNotes = useQuery(
    api.notes.list,
    selectedBookId ? { bookId: selectedBookId } : {}
  );
  const extractedTextData = useQuery(
    api.extractedTexts.getByBook,
    selectedBookId ? { bookId: selectedBookId } : "skip"
  );

  const createNote = useMutation(api.notes.create);
  const deleteNote = useMutation(api.notes.remove);

  const selectedBook = books?.find((b) => b._id === selectedBookId);
  const extractedText = extractedTextData?.fullText || null;

  // Filter notes
  const filteredNotes = allNotes?.filter((note) => {
    if (filterType === "manual") return !note.isAiGenerated;
    if (filterType === "ai") return note.isAiGenerated;
    return true;
  });

  const selectedNote = filteredNotes?.find((n) => n._id === selectedNoteId);

  const handleCreateNote = async () => {
    if (!selectedBookId || !noteContent.trim()) {
      toast.error("Please select a book and enter note content");
      return;
    }

    try {
      const tags = noteTags.split(",").map((t) => t.trim()).filter(Boolean);
      await createNote({
        bookId: selectedBookId,
        content: noteContent,
        tags,
        isAiGenerated: false,
      });
      setNoteContent("");
      setNoteTags("");
      toast.success("Note created successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create note");
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedBookId) {
      toast.error("Please select a book first");
      return;
    }

    if (!extractedText) {
      toast.error("Please extract text from this book first (go to Text Extraction)");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await chatWithAI([
        {
          role: "user",
          content: `Analyze this document and create comprehensive, well-structured notes covering the main topics, key points, and important details. Format as bullet points.\n\nDocument:\n${extractedText.slice(0, 10000)}`,
        },
      ]);

      const summary = (response.text as string) || "";
      if (!summary) {
        throw new Error("Failed to generate notes");
      }

      await createNote({
        bookId: selectedBookId,
        content: summary,
        tags: ["AI Generated", "Summary"],
        isAiGenerated: true,
        aiType: "summary",
      });

      toast.success("AI notes generated successfully");
    } catch (error: any) {
      const msg = error?.message || "Failed to generate notes";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateKeyPoints = async () => {
    if (!selectedBookId || !extractedText) {
      toast.error("Please select a book and extract text first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await chatWithAI([
        {
          role: "user",
          content: `Extract the most important key points and takeaways from this document. Present as a numbered list of actionable insights.\n\nDocument:\n${extractedText.slice(0, 10000)}`,
        },
      ]);

      const keyPoints = (response.text as string) || "";
      if (!keyPoints) throw new Error("Failed to generate key points");

      await createNote({
        bookId: selectedBookId,
        content: keyPoints,
        tags: ["AI Generated", "Key Points"],
        isAiGenerated: true,
        aiType: "summary",
      });

      toast.success("Key points generated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate key points");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    try {
      await deleteNote({ id: noteId });
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
      toast.success("Note deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete note");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          description="Upload books first to start taking notes"
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notes</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Capture insights and generate AI-powered notes
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Book Selection & Create Note */}
          <div className="lg:col-span-3 space-y-4">
            {/* Book Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Book</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedBookId || ""} onValueChange={(v) => {
                  setSelectedBookId(v as Id<"books">);
                  setSelectedNoteId(null);
                }}>
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

            {/* AI Generate Options */}
            {selectedBookId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Generate
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Generate notes using AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Summary Notes
                      </>
                    )}
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleGenerateKeyPoints}
                    disabled={isGenerating}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Key Points
                  </Button>
                  {!extractedText && (
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      Extract text first to enable AI generation
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Manual Note Creation */}
            {selectedBookId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="note-content">Content</Label>
                    <Textarea
                      id="note-content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your note..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-tags">Tags (comma-separated)</Label>
                    <Input
                      id="note-tags"
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                      placeholder="research, important, chapter1"
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateNote}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle - Notes List */}
          <div className="lg:col-span-4">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Notes List</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {filteredNotes?.length || 0} notes
                      {selectedBook && ` • ${selectedBook.title}`}
                    </CardDescription>
                  </div>
                  <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                    <SelectTrigger className="w-28 h-8">
                      <Filter className="h-3 w-3 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  {!filteredNotes || filteredNotes.length === 0 ? (
                    <div className="p-6">
                      <EmptyState
                        icon={FileText}
                        title="No notes yet"
                        description={
                          selectedBookId
                            ? "Create your first note or use AI to generate one"
                            : "Select a book to view and create notes"
                        }
                      />
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {filteredNotes.map((note) => (
                        <div
                          key={note._id}
                          onClick={() => setSelectedNoteId(note._id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                            selectedNoteId === note._id
                              ? "bg-accent border-primary shadow-sm"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-2">
                                  {note.isAiGenerated ? (
                                    <span className="flex items-center gap-1">
                                      <Sparkles className="h-3 w-3 text-purple-500" />
                                      AI Generated Note
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Edit3 className="h-3 w-3" />
                                      Manual Note
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {note.content.substring(0, 100)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {note.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {note.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{note.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(note.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right - Note Details */}
          <div className="lg:col-span-5">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Note Details</CardTitle>
                  {selectedNote && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(selectedNote._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  {!selectedNote ? (
                    <div className="p-6">
                      <EmptyState
                        icon={FileText}
                        title="No note selected"
                        description="Select a note from the list to view its details"
                      />
                    </div>
                  ) : (
                    <div className="p-6 space-y-4">
                      {/* Note Metadata */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedNote.isAiGenerated && (
                            <Badge variant="secondary" className="gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI Generated
                            </Badge>
                          )}
                          {selectedNote.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDate(selectedNote.createdAt)}
                        </div>
                      </div>

                      <Separator />

                      {/* Note Content */}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {selectedNote.isAiGenerated ? (
                          renderMarkdown(selectedNote.content)
                        ) : (
                          <div className="whitespace-pre-wrap">{selectedNote.content}</div>
                        )}
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
