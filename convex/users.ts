import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Sync or create user from Clerk
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        updatedAt: now,
      });
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        createdAt: now,
        updatedAt: now,
      });
      return userId;
    }
  },
});

// Get user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by username
export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    id: v.id("users"),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete user and all associated data
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return;

    // Delete all user's books
    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();

    for (const book of books) {
      // Delete book's storage file if exists
      if (book.storageId) {
        await ctx.storage.delete(book.storageId);
      }
      await ctx.db.delete(book._id);
    }

    // Delete all user's notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // Delete all user's chat sessions
    const chatSessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();
    for (const session of chatSessions) {
      await ctx.db.delete(session._id);
    }

    // Delete all user's highlights
    const highlights = await ctx.db
      .query("highlights")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();
    for (const highlight of highlights) {
      await ctx.db.delete(highlight._id);
    }

    // Delete all user's citations
    const citations = await ctx.db
      .query("citations")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();
    for (const citation of citations) {
      await ctx.db.delete(citation._id);
    }

    // Delete all user's paraphrased texts
    const paraphrasedTexts = await ctx.db
      .query("paraphrasedTexts")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();
    for (const text of paraphrasedTexts) {
      await ctx.db.delete(text._id);
    }

    // Finally, delete the user
    await ctx.db.delete(args.id);
  },
});
