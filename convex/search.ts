import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchBooks = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    
    const results = await ctx.db
      .query("books")
      .withSearchIndex("search_books", (q) => q.search("title", args.query))
      .take(10);
    
    return results;
  },
});

export const searchNotes = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    
    const results = await ctx.db
      .query("notes")
      .withSearchIndex("search_notes", (q) => q.search("content", args.query))
      .take(20);
    
    return results;
  },
});

export const searchAll = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return { books: [], notes: [], highlights: [] };
    
    const books = await ctx.db
      .query("books")
      .withSearchIndex("search_books", (q) => q.search("title", args.query))
      .take(5);
    
    const notes = await ctx.db
      .query("notes")
      .withSearchIndex("search_notes", (q) => q.search("content", args.query))
      .take(10);
    
    // For highlights, we'll do a manual search since they don't have search index
    const allHighlights = await ctx.db.query("highlights").collect();
    const highlights = allHighlights
      .filter((h) => h.selectedText.toLowerCase().includes(args.query.toLowerCase()))
      .slice(0, 10);
    
    return { books, notes, highlights };
  },
});
