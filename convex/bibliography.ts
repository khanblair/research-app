import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("citations")
      .order("asc")
      .collect();
  },
});

export const getByBook = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("citations")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .first();
  },
});

export const create = mutation({
  args: {
    bookId: v.id("books"),
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
  },
  handler: async (ctx, args) => {
    // Get the next citation number
    const allCitations = await ctx.db.query("citations").collect();
    const citationNumber =
      allCitations.length > 0
        ? Math.max(...allCitations.map((c) => c.citationNumber)) + 1
        : 1;

    const now = Date.now();
    const citationId = await ctx.db.insert("citations", {
      ...args,
      citationNumber,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return citationId;
  },
});

export const incrementUsage = mutation({
  args: { id: v.id("citations") },
  handler: async (ctx, args) => {
    const citation = await ctx.db.get(args.id);
    if (citation) {
      await ctx.db.patch(args.id, {
        usageCount: citation.usageCount + 1,
        updatedAt: Date.now(),
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("citations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
