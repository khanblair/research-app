import { Id } from "../convex/_generated/dataModel";

export interface SearchResult {
  id: string;
  type: "book" | "note" | "highlight";
  bookId: Id<"books">;
  bookTitle: string;
  title: string;
  snippet: string;
  page?: number;
  relevance: number;
  createdAt: number;
}

export interface SearchFilters {
  type?: ("book" | "note" | "highlight")[];
  bookIds?: Id<"books">[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}
