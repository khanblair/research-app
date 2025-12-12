import { query } from "./_generated/server";

// Get dashboard statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    const notes = await ctx.db.query("notes").collect();
    const citations = await ctx.db.query("citations").collect();
    const chatSessions = await ctx.db.query("chatSessions").collect();
    const highlights = await ctx.db.query("highlights").collect();

    const totalBooks = books.length;
    const totalNotes = notes.length;
    const totalCitations = citations.length;
    const totalChats = chatSessions.length;
    const totalHighlights = highlights.length;

    const avgProgress = books.length > 0
      ? Math.round(books.reduce((acc, b) => acc + (b.readingProgress ?? 0), 0) / books.length)
      : 0;

    const aiGeneratedNotes = notes.filter((n) => n.isAiGenerated).length;
    const totalChatMessages = chatSessions.reduce((acc, s) => acc + s.messages.length, 0);

    // File type distribution
    const fileTypes = books.reduce((acc, book) => {
      acc[book.fileType] = (acc[book.fileType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBooks,
      totalNotes,
      totalCitations,
      totalChats,
      totalHighlights,
      avgProgress,
      aiGeneratedNotes,
      totalChatMessages,
      fileTypes,
    };
  },
});

// Get recent activity
export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const recentBooks = await ctx.db
      .query("books")
      .withIndex("by_upload_time")
      .order("desc")
      .take(5);

    const recentNotes = await ctx.db
      .query("notes")
      .withIndex("by_created_at")
      .order("desc")
      .take(5);

    const recentChats = await ctx.db
      .query("chatSessions")
      .withIndex("by_updated_at")
      .order("desc")
      .take(5);

    return {
      recentBooks,
      recentNotes,
      recentChats,
    };
  },
});

// Get reading streak and activity over time
export const getActivityTimeline = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * oneDayMs;
    const oneMonthAgo = now - 30 * oneDayMs;

    const allBooks = await ctx.db.query("books").collect();
    const allNotes = await ctx.db.query("notes").collect();
    const allChats = await ctx.db.query("chatSessions").collect();

    const booksThisWeek = allBooks.filter((b) => b.uploadedAt > oneWeekAgo).length;
    const booksThisMonth = allBooks.filter((b) => b.uploadedAt > oneMonthAgo).length;

    const notesThisWeek = allNotes.filter((n) => n.createdAt > oneWeekAgo).length;
    const notesThisMonth = allNotes.filter((n) => n.createdAt > oneMonthAgo).length;

    const chatsThisWeek = allChats.filter((c) => c.updatedAt > oneWeekAgo).length;
    const chatsThisMonth = allChats.filter((c) => c.updatedAt > oneMonthAgo).length;

    return {
      thisWeek: {
        books: booksThisWeek,
        notes: notesThisWeek,
        chats: chatsThisWeek,
      },
      thisMonth: {
        books: booksThisMonth,
        notes: notesThisMonth,
        chats: chatsThisMonth,
      },
    };
  },
});

// Get most active books (by notes, highlights, chats)
export const getMostActiveBooks = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    const notes = await ctx.db.query("notes").collect();
    const highlights = await ctx.db.query("highlights").collect();
    const chats = await ctx.db.query("chatSessions").collect();

    const bookActivity = books.map((book) => {
      const bookNotes = notes.filter((n) => n.bookId === book._id).length;
      const bookHighlights = highlights.filter((h) => h.bookId === book._id).length;
      const bookChats = chats.filter((c) => c.bookId === book._id).length;
      const totalActivity = bookNotes + bookHighlights + bookChats;

      return {
        book,
        notesCount: bookNotes,
        highlightsCount: bookHighlights,
        chatsCount: bookChats,
        totalActivity,
      };
    });

    return bookActivity
      .filter((ba) => ba.totalActivity > 0)
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 5);
  },
});
