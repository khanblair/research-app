"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, FileText, Quote, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

type SearchResult = {
  id: string;
  type: "book" | "note" | "citation" | "chat";
  title: string;
  content: string;
  bookTitle?: string;
  tags?: string[];
  createdAt?: number;
  href: string;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Set initial query from URL parameter
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const books = useQuery(api.books.list);
  const notes = useQuery(api.notes.list, {});
  const citations = useQuery(api.bibliography.list);
  const chatSessions = useQuery(api.chatSessions.list, {});

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search books
    books?.forEach((book) => {
      if (
        book.title.toLowerCase().includes(query) ||
        book.authors.some((a) => a.toLowerCase().includes(query)) ||
        book.publisher?.toLowerCase().includes(query)
      ) {
        results.push({
          id: book._id,
          type: "book",
          title: book.title,
          content: `${book.authors.join(", ")} • ${book.year || "N/A"}`,
          createdAt: book.uploadedAt,
          href: `/dashboard/library`,
        });
      }
    });

    // Search notes
    notes?.forEach((note) => {
      if (
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
      ) {
        const book = books?.find((b) => b._id === note.bookId);
        results.push({
          id: note._id,
          type: "note",
          title: note.content.substring(0, 60) + (note.content.length > 60 ? "..." : ""),
          content: note.content.substring(0, 150) + (note.content.length > 150 ? "..." : ""),
          bookTitle: book?.title,
          tags: note.tags,
          createdAt: note.createdAt,
          href: `/dashboard/notes`,
        });
      }
    });

    // Search citations
    citations?.forEach((citation) => {
      if (
        citation.formattedCitation.toLowerCase().includes(query) ||
        citation.metadata.title.toLowerCase().includes(query) ||
        citation.metadata.authors.some((a) => a.toLowerCase().includes(query))
      ) {
        const book = books?.find((b) => b._id === citation.bookId);
        results.push({
          id: citation._id,
          type: "citation",
          title: citation.metadata.title,
          content: citation.formattedCitation.substring(0, 150) + "...",
          bookTitle: book?.title,
          createdAt: citation.createdAt,
          href: `/dashboard/bibliography`,
        });
      }
    });

    // Search chat sessions
    chatSessions?.forEach((session) => {
      const hasMatch =
        session.title.toLowerCase().includes(query) ||
        session.messages.some((msg) => msg.content.toLowerCase().includes(query));

      if (hasMatch) {
        const book = books?.find((b) => b._id === session.bookId);
        const preview = session.messages[0]?.content.substring(0, 100) || "Chat session";
        results.push({
          id: session._id,
          type: "chat",
          title: session.title,
          content: preview + (preview.length === 100 ? "..." : ""),
          bookTitle: book?.title,
          createdAt: session.createdAt,
          href: `/dashboard/chat`,
        });
      }
    });

    // Sort by relevance (title match first, then by date)
    return results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query);
      const bTitle = b.title.toLowerCase().includes(query);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [searchQuery, books, notes, citations, chatSessions]);

  const filteredResults = useMemo(() => {
    if (activeTab === "all") return searchResults;
    return searchResults.filter((r) => r.type === activeTab);
  }, [searchResults, activeTab]);

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return BookOpen;
      case "note":
        return FileText;
      case "citation":
        return Quote;
      case "chat":
        return MessageSquare;
      default:
        return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "book":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "note":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "citation":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "chat":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
      default:
        return "";
    }
  };

  if (books === undefined || notes === undefined || citations === undefined || chatSessions === undefined) {
    return <LoadingSpinner />;
  }

  const resultCounts = {
    all: searchResults.length,
    book: searchResults.filter((r) => r.type === "book").length,
    note: searchResults.filter((r) => r.type === "note").length,
    citation: searchResults.filter((r) => r.type === "citation").length,
    chat: searchResults.filter((r) => r.type === "chat").length,
  };

  return (
    <>
      <Breadcrumbs />

      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Search</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Search across books, notes, citations, and chats
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Query</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for anything..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </CardContent>
        </Card>

        {searchQuery.trim() && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({resultCounts.all})</TabsTrigger>
              <TabsTrigger value="book">Books ({resultCounts.book})</TabsTrigger>
              <TabsTrigger value="note">Notes ({resultCounts.note})</TabsTrigger>
              <TabsTrigger value="citation">Citations ({resultCounts.citation})</TabsTrigger>
              <TabsTrigger value="chat">Chats ({resultCounts.chat})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredResults.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No results found"
                  description={`No ${activeTab === "all" ? "results" : activeTab + "s"} match your search query`}
                />
              ) : (
                <ScrollArea className="h-[calc(100vh-24rem)]">
                  <div className="space-y-3">
                    {filteredResults.map((result) => {
                      const Icon = getIcon(result.type);
                      return (
                        <Link key={result.id} href={result.href}>
                          <Card className="hover:bg-accent transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getTypeColor(
                                    result.type
                                  )}`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="capitalize">
                                      {result.type}
                                    </Badge>
                                    {result.bookTitle && (
                                      <span className="text-xs text-muted-foreground truncate">
                                        from {result.bookTitle}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                                    {result.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {result.content}
                                  </p>
                                  {result.tags && result.tags.length > 0 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                      {result.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!searchQuery.trim() && (
          <EmptyState
            icon={Search}
            title="Start searching"
            description="Enter a search query to find books, notes, citations, and chat sessions"
          />
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
