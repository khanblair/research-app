import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    authors: v.array(v.string()),
    fileName: v.string(),
    fileType: v.union(v.literal("pdf"), v.literal("epub"), v.literal("txt")),
    fileUrl: v.string(),
    fileSize: v.number(),
    publisher: v.optional(v.string()),
    year: v.optional(v.string()),
    edition: v.optional(v.string()),
    isbn: v.optional(v.string()),
    pageCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const bookId = await ctx.db.insert("books", {
      ...args,
      uploadedAt: Date.now(),
      readingProgress: 0,
    });
    return bookId;
  },
});

export const createWithStorage = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    authors: v.array(v.string()),
    fileName: v.string(),
    fileType: v.union(v.literal("pdf"), v.literal("epub"), v.literal("txt")),
    storageId: v.id("_storage"),
    fileSize: v.number(),
    publisher: v.optional(v.string()),
    year: v.optional(v.string()),
    edition: v.optional(v.string()),
    isbn: v.optional(v.string()),
    pageCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new Error("Failed to get file URL from storageId");
    }

    const bookId = await ctx.db.insert("books", {
      userId: args.userId,
      title: args.title,
      authors: args.authors,
      publisher: args.publisher,
      year: args.year,
      edition: args.edition,
      isbn: args.isbn,
      fileName: args.fileName,
      fileType: args.fileType,
      storageId: args.storageId,
      fileUrl,
      fileSize: args.fileSize,
      pageCount: args.pageCount,
      uploadedAt: Date.now(),
      readingProgress: 0,
    });

    return bookId;
  },
});

export const updateProgress = mutation({
  args: {
    id: v.id("books"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      readingProgress: args.progress,
      lastOpenedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.id);
    if (book?.storageId) {
      await ctx.storage.delete(book.storageId);
    }
    await ctx.db.delete(args.id);
  },
});
