import { Id } from "../convex/_generated/dataModel";

export interface Citation {
  _id: Id<"citations">;
  _creationTime: number;
  bookId: Id<"books">;
  citationNumber: number; // [1], [2], etc.
  formattedCitation: string; // IEEE formatted string
  metadata: CitationMetadata;
  usageCount: number; // How many times cited
  createdAt: number;
  updatedAt: number;
}

export interface CitationMetadata {
  title: string;
  authors: string[];
  publisher?: string;
  year?: string;
  edition?: string;
  isbn?: string;
  doi?: string;
  url?: string;
  accessDate?: string;
}

export interface BibliographyEntry {
  id: number;
  citation: string;
  bookId: Id<"books">;
  bookTitle: string;
  usageCount: number;
}

export type CitationStyle = "ieee" | "apa" | "mla" | "chicago";

export interface CitationReference {
  citationId: number;
  page?: number;
  chapter?: number;
  paragraph?: number;
  type: "page" | "chapter" | "paragraph" | "general";
}
