"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BookOpen, Grid, List, Upload, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const books = useQuery(api.books.list);
  const deleteBook = useMutation(api.books.remove);

  const handleDelete = async (id: Id<"books">) => {
    try {
      await deleteBook({ id });
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };

  return (
    <>
      <Breadcrumbs />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Library</h1>
            <p className="text-muted-foreground mt-2">
              Manage your research books and documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Link href="/dashboard/library/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Book
              </Button>
            </Link>
          </div>
        </div>

        {books === undefined && <LoadingSpinner />}

        {books !== undefined && books.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No books yet"
            description="Upload your first PDF, EPUB, or TXT file to get started"
            action={
              <Link href="/dashboard/library/upload">
                <Button>Upload Book</Button>
              </Link>
            }
          />
        )}

        {books && books.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-3"
            }
          >
            {books.map((book) => (
              <Card key={book._id} className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {book.authors?.join(", ") || "Unknown author"}
                    </CardDescription>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <FileText className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-medium">{book.fileType.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size</span>
                    <span className="font-medium">{(book.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded</span>
                    <span>{new Date(book.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(book._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
