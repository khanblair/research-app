import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { bookId: v.optional(v.id("books")) },
  handler: async (ctx, args) => {
    if (args.bookId) {
      return await ctx.db
        .query("highlights")
        .filter((q) => q.eq(q.field("bookId"), args.bookId))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("highlights").order("desc").collect();
  },
});

export const getByPage = query({
  args: {
    bookId: v.id("books"),
    page: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("highlights")
      .withIndex("by_book_and_page", (q) =>
        q.eq("bookId", args.bookId).eq("page", args.page)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const highlightId = await ctx.db.insert("highlights", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return highlightId;
  },
});

export const updateNote = mutation({
  args: {
    id: v.id("highlights"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      note: args.note,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("highlights") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
