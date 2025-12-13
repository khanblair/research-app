import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create or update paraphrased text
export const save = mutation({
  args: {
    id: v.optional(v.id("paraphrasedTexts")),
    bookId: v.id("books"),
    originalText: v.string(),
    paraphrasedText: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    if (args.id) {
      // Update existing
      await ctx.db.patch(args.id, {
        paraphrasedText: args.paraphrasedText,
        model: args.model,
        updatedAt: now,
      });
      return args.id;
    } else {
      // Create new
      const id = await ctx.db.insert("paraphrasedTexts", {
        bookId: args.bookId,
        originalText: args.originalText,
        paraphrasedText: args.paraphrasedText,
        model: args.model,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    }
  },
});

// Get latest paraphrased text for a book
export const getByBook = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const paraphrased = await ctx.db
      .query("paraphrasedTexts")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .order("desc")
      .first();
    
    return paraphrased;
  },
});

// Get all paraphrased texts for a book
export const listByBook = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const paraphrased = await ctx.db
      .query("paraphrasedTexts")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .order("desc")
      .collect();
    
    return paraphrased;
  },
});

// Delete a paraphrased text
export const remove = mutation({
  args: { id: v.id("paraphrasedTexts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
