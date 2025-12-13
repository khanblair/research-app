"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  FileText, 
  Quote, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  Clock,
  BarChart3,
  Calendar,
  ChevronRight,
  Upload,
  Library as LibraryIcon,
  Scan,
  ArrowUpRight,
  FileType,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getStats);
  const recentActivity = useQuery(api.dashboard.getRecentActivity);
  const activityTimeline = useQuery(api.dashboard.getActivityTimeline);
  const mostActiveBooks = useQuery(api.dashboard.getMostActiveBooks);

  const isLoading = !stats || !recentActivity || !activityTimeline;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Breadcrumbs />
      
      <div className="space-y-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Welcome back! Here's an overview of your research activity.
            </p>
          </div>
          <Link href="/dashboard/library/upload" className="md:flex-shrink-0">
            <Button size="lg" className="w-full md:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload Book
            </Button>
          </Link>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBooks ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activityTimeline?.thisWeek.books ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {activityTimeline.thisWeek.books} this week
                  </span>
                ) : (
                  "No books uploaded yet"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalChats ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.totalChatMessages ? (
                  <>{stats.totalChatMessages} total messages</>
                ) : (
                  "Start chatting with AI"
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notes & Highlights</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats?.totalNotes ?? 0) + (stats?.totalHighlights ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.aiGeneratedNotes ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {stats.aiGeneratedNotes} AI-generated
                  </span>
                ) : (
                  `${stats?.totalNotes ?? 0} notes, ${stats?.totalHighlights ?? 0} highlights`
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgProgress ?? 0}%</div>
              <Progress value={stats?.avgProgress ?? 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Books added</span>
                <Badge variant="secondary">{activityTimeline?.thisWeek.books ?? 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Notes created</span>
                <Badge variant="secondary">{activityTimeline?.thisWeek.notes ?? 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI sessions</span>
                <Badge variant="secondary">{activityTimeline?.thisWeek.chats ?? 0}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Books added</span>
                <Badge variant="secondary">{activityTimeline?.thisMonth.books ?? 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Notes created</span>
                <Badge variant="secondary">{activityTimeline?.thisMonth.notes ?? 0}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI sessions</span>
                <Badge variant="secondary">{activityTimeline?.thisMonth.chats ?? 0}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileType className="h-4 w-4" />
                File Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats?.fileTypes && Object.keys(stats.fileTypes).length > 0 ? (
                Object.entries(stats.fileTypes).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-muted-foreground uppercase">{type}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No files yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/library/upload" className="block">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New Book
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/analysis" className="block">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    Extract Text from PDF
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/chat" className="block">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Start AI Chat
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/library" className="block">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <LibraryIcon className="h-4 w-4" />
                    Browse Library
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/bibliography" className="block">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <Quote className="h-4 w-4" />
                    Manage Bibliography
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Most Active Books */}
          <Card>
            <CardHeader>
              <CardTitle>Most Active Books</CardTitle>
              <CardDescription>Books with most engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {mostActiveBooks && mostActiveBooks.length > 0 ? (
                  <div className="space-y-3">
                    {mostActiveBooks.map((item) => (
                      <div
                        key={item.book._id}
                        className="flex items-start justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium truncate">{item.book.title}</p>
                          <div className="flex gap-2 flex-wrap">
                            {item.notesCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {item.notesCount} notes
                              </Badge>
                            )}
                            {item.chatsCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {item.chatsCount} chats
                              </Badge>
                            )}
                            {item.highlightsCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {item.highlightsCount} highlights
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress
                          value={item.book.readingProgress ?? 0}
                          className="w-16 ml-3"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No activity yet. Start reading and taking notes!
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {recentActivity?.recentBooks && recentActivity.recentBooks.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.recentBooks.map((book) => (
                      <Link
                        key={book._id}
                        href={`/dashboard/library`}
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(book.uploadedAt)}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No books yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {recentActivity?.recentNotes && recentActivity.recentNotes.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.recentNotes.map((note) => (
                      <Link
                        key={note._id}
                        href={`/dashboard/notes`}
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <p className="text-sm line-clamp-2">{note.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(note.createdAt)}
                          </p>
                          {note.isAiGenerated && (
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="h-2 w-2 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No notes yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent AI Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {recentActivity?.recentChats && recentActivity.recentChats.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.recentChats.map((chat) => (
                      <Link
                        key={chat._id}
                        href={`/dashboard/chat`}
                        className="block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(chat.updatedAt)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {chat.messages.length} msgs
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No chats yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
