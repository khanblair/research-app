import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { bookId: v.optional(v.id("books")) },
  handler: async (ctx, args) => {
    if (args.bookId) {
      return await ctx.db
        .query("chatSessions")
        .withIndex("by_book", (q) => q.eq("bookId", args.bookId!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("chatSessions")
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("chatSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    bookId: v.id("books"),
    title: v.string(),
    extractedText: v.optional(v.string()),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sessionId = await ctx.db.insert("chatSessions", {
      bookId: args.bookId,
      title: args.title,
      extractedText: args.extractedText,
      model: args.model,
      messages: [],
      createdAt: now,
      updatedAt: now,
    });
    return sessionId;
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const newMessage = {
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.sessionId, {
      messages: [...session.messages, newMessage],
      updatedAt: Date.now(),
    });
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("chatSessions"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("chatSessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
