"use client";

import { Book, StickyNote, Highlighter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchHighlight } from "@/components/search/SearchHighlight";
import type { SearchResult } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick?: (result: SearchResult) => void;
}

export function SearchResults({
  results,
  query,
  onResultClick,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Book className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No results found</h3>
        <p className="text-sm text-muted-foreground">
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "book":
        return Book;
      case "note":
        return StickyNote;
      case "highlight":
        return Highlighter;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "book":
        return "Book";
      case "note":
        return "Note";
      case "highlight":
        return "Highlight";
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Found {results.length} result{results.length !== 1 ? "s" : ""}
      </div>

      {results.map((result) => {
        const Icon = getIcon(result.type);
        return (
          <Card
            key={result.id}
            className="cursor-pointer p-4 transition-all hover:shadow-md"
            onClick={() => onResultClick?.(result)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(result.type)}
                  </Badge>
                </div>
                {result.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(result.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>

              <h3 className="font-medium">
                <SearchHighlight text={result.title} query={query} />
              </h3>

              {result.snippet && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  <SearchHighlight text={result.snippet} query={query} />
                </p>
              )}

              {result.page && (
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {result.page && <span>Page {result.page}</span>}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
