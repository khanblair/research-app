import { Id } from "../convex/_generated/dataModel";

export interface Highlight {
  _id: Id<"highlights">;
  _creationTime: number;
  bookId: Id<"books">;
  page: number;
  selectedText: string;
  color: HighlightColor;
  position: HighlightPosition;
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface HighlightPosition {
  pageIndex: number;
  rects: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  textDivs?: number[]; // Indices of text divs
}

export type HighlightColor = "yellow" | "green" | "blue" | "purple" | "pink";

export interface TextSelection {
  text: string;
  page: number;
  position: HighlightPosition;
}
