import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByBook = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("extractedTexts")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("extractedTexts")
      .order("desc")
      .collect();
  },
});

export const save = mutation({
  args: {
    bookId: v.id("books"),
    fullText: v.string(),
    extractionMethod: v.union(
      v.literal("pdfco"),
      v.literal("pdfjs"),
      v.literal("ocr"),
      v.literal("tesseract")
    ),
    pageCount: v.optional(v.number()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { bookId, fullText, extractionMethod, pageCount, language } = args;

    // Check if extraction already exists for this book
    const existing = await ctx.db
      .query("extractedTexts")
      .withIndex("by_book", (q) => q.eq("bookId", bookId))
      .first();

    const wordCount = fullText.split(/\s+/).filter((w) => w.length > 0).length;
    const characterCount = fullText.length;
    const now = Date.now();

    if (existing) {
      // Update existing extraction
      await ctx.db.patch(existing._id, {
        fullText,
        extractionMethod,
        pageCount,
        wordCount,
        characterCount,
        language,
        extractedAt: now,
      });
      return existing._id;
    } else {
      // Create new extraction
      return await ctx.db.insert("extractedTexts", {
        bookId,
        fullText,
        extractionMethod,
        pageCount,
        wordCount,
        characterCount,
        language,
        extractedAt: now,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("extractedTexts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const removeByBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const extraction = await ctx.db
      .query("extractedTexts")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .first();

    if (extraction) {
      await ctx.db.delete(extraction._id);
    }
  },
});
