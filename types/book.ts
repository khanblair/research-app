import { Id } from "../convex/_generated/dataModel";

export interface Book {
  _id: Id<"books">;
  _creationTime: number;
  title: string;
  authors: string[];
  publisher?: string;
  year?: string;
  edition?: string;
  isbn?: string;
  fileName: string;
  fileType: "pdf" | "epub" | "txt";
  fileUrl: string;
  fileSize: number;
  coverImage?: string;
  pageCount?: number;
  uploadedAt: number;
  lastOpenedAt?: number;
  readingProgress: number; // 0-100
  metadata?: Record<string, any>;
}

export interface BookMetadata {
  title: string;
  authors: string[];
  publisher?: string;
  year?: string;
  edition?: string;
  isbn?: string;
  pageCount?: number;
  language?: string;
}

export type FileType = "pdf" | "epub" | "txt";

export interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  error?: string;
}
