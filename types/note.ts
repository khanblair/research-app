import { Id } from "../convex/_generated/dataModel";

export interface Note {
  _id: Id<"notes">;
  _creationTime: number;
  bookId: Id<"books">;
  content: string;
  page?: number;
  chapter?: number;
  selectedText?: string;
  tags: string[];
  color?: string;
  isAiGenerated: boolean;
  aiType?: "summary" | "paraphrase" | "answer";
  citations?: InlineCitation[];
  createdAt: number;
  updatedAt: number;
}

export interface InlineCitation {
  citationId: number;
  page?: number;
  chapter?: number;
  paragraph?: number;
  text: string;
}

export type NoteColor = "yellow" | "green" | "blue" | "purple" | "pink" | "orange";
