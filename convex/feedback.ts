import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    rating: v.number(),
    category: v.union(
      v.literal("feature"),
      v.literal("bug"),
      v.literal("improvement"),
      v.literal("other")
    ),
    message: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const feedbackId = await ctx.db.insert("feedback", {
      userId: args.userId,
      rating: args.rating,
      category: args.category,
      message: args.message,
      email: args.email,
      status: "new",
      createdAt: Date.now(),
    });

    return feedbackId;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(v.literal("new"), v.literal("reviewed"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("feedback"),
    status: v.union(v.literal("new"), v.literal("reviewed"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});
