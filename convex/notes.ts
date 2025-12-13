import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { 
    userId: v.id("users"),
    bookId: v.optional(v.id("books")) 
  },
  handler: async (ctx, args) => {
    if (args.bookId) {
      return await ctx.db
        .query("notes")
        .withIndex("by_book", (q) => q.eq("bookId", args.bookId!))
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const noteId = await ctx.db.insert("notes", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return noteId;
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
