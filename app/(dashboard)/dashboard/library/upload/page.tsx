"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/dashboard/Breadcrumbs";
import { BookUploader } from "@/components/book/BookUploader";

export default function UploadPage() {
  return (
    <>
      <Breadcrumbs />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Book</h1>
          <p className="text-muted-foreground mt-2">
            Upload PDF, EPUB, or TXT files to your library
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Files</CardTitle>
            <CardDescription>
              Drag and drop files or click to browse. Supported formats: PDF, EPUB, TXT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookUploader />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
