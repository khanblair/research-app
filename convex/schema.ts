import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    title: v.string(),
    authors: v.array(v.string()),
    publisher: v.optional(v.string()),
    year: v.optional(v.string()),
    edition: v.optional(v.string()),
    isbn: v.optional(v.string()),
    fileName: v.string(),
    fileType: v.union(v.literal("pdf"), v.literal("epub"), v.literal("txt")),
    storageId: v.optional(v.id("_storage")),
    fileUrl: v.string(),
    fileSize: v.number(),
    coverImage: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    uploadedAt: v.number(),
    lastOpenedAt: v.optional(v.number()),
    readingProgress: v.number(), // 0-100
    metadata: v.optional(v.any()),
  })
    .index("by_upload_time", ["uploadedAt"])
    .index("by_last_opened", ["lastOpenedAt"])
    .searchIndex("search_books", {
      searchField: "title",
      filterFields: ["fileType"],
    }),

  notes: defineTable({
    bookId: v.id("books"),
    content: v.string(),
    page: v.optional(v.number()),
    chapter: v.optional(v.number()),
    selectedText: v.optional(v.string()),
    tags: v.array(v.string()),
    color: v.optional(v.string()),
    isAiGenerated: v.boolean(),
    aiType: v.optional(v.union(
      v.literal("summary"),
      v.literal("paraphrase"),
      v.literal("answer")
    )),
    citations: v.optional(v.array(v.object({
      citationId: v.number(),
      page: v.optional(v.number()),
      chapter: v.optional(v.number()),
      paragraph: v.optional(v.number()),
      text: v.string(),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_notes", {
      searchField: "content",
      filterFields: ["bookId", "isAiGenerated"],
    }),

  chatSessions: defineTable({
    bookId: v.id("books"),
    title: v.string(),
    extractedText: v.optional(v.string()), // Reference to extracted text context
    model: v.string(), // AI model used (e.g., "claude-sonnet-4.5", "gpt-4", etc.)
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_created_at", ["createdAt"])
    .index("by_updated_at", ["updatedAt"]),

  highlights: defineTable({
    bookId: v.id("books"),
    page: v.number(),
    selectedText: v.string(),
    color: v.string(),
    position: v.object({
      pageIndex: v.number(),
      rects: v.array(v.object({
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
      })),
      textDivs: v.optional(v.array(v.number())),
    }),
    note: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_book_and_page", ["bookId", "page"]),

  citations: defineTable({
    bookId: v.id("books"),
    citationNumber: v.number(),
    formattedCitation: v.string(),
    metadata: v.object({
      title: v.string(),
      authors: v.array(v.string()),
      publisher: v.optional(v.string()),
      year: v.optional(v.string()),
      edition: v.optional(v.string()),
      isbn: v.optional(v.string()),
      doi: v.optional(v.string()),
      url: v.optional(v.string()),
      accessDate: v.optional(v.string()),
      pages: v.optional(v.string()),
      volume: v.optional(v.string()),
      issue: v.optional(v.string()),
    }),
    usageCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_citation_number", ["citationNumber"]),

  extractedTexts: defineTable({
    bookId: v.id("books"),
    fullText: v.string(),
    extractionMethod: v.union(
      v.literal("pdfco"),
      v.literal("pdfjs"),
      v.literal("ocr"),
      v.literal("tesseract")
    ),
    pageCount: v.optional(v.number()),
    wordCount: v.number(),
    characterCount: v.number(),
    language: v.optional(v.string()),
    extractedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_extracted_at", ["extractedAt"]),
});
