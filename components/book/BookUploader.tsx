"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, CheckCircle, AlertCircle, Link2, Wand2 } from "lucide-react";
import { FileIcon } from "@/components/shared/FileIcon";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexUser } from "@/hooks/use-convex-user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

interface UploadedFile {
  key: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export function BookUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [isUrlSaving, setIsUrlSaving] = useState(false);
  const [lastUploadedBookId, setLastUploadedBookId] = useState<Id<"books"> | null>(null);

  const { user: convexUser, isLoading: convexUserLoading } = useConvexUser();
  const router = useRouter();

  // Prevent duplicate uploads if the drop event fires twice in dev (StrictMode)
  // or the user re-selects the same file while an upload is in progress.
  const inFlightKeysRef = useRef<Set<string>>(new Set());
  const uploadPromisesRef = useRef<Map<string, Promise<void>>>(new Map());
  const uploadIntervalsRef = useRef<Map<string, number>>(new Map());
  const filesRef = useRef<UploadedFile[]>([]);

  const generateUploadUrl = useMutation(api.books.generateUploadUrl);
  const createBookWithStorage = useMutation(api.books.createWithStorage);
  const createBook = useMutation(api.books.create);

  const makeFileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const startUpload = useCallback(
    (fileKey: string, file: File) => {
      if (uploadPromisesRef.current.has(fileKey)) return;

      // Mark as uploading immediately.
      setFiles((prev) => {
        const idx = prev.findIndex((f) => f.key === fileKey);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status: "uploading", progress: 0 };
        return updated;
      });

      // UI-only progress indicator up to 90% while the real upload runs.
      const existingInterval = uploadIntervalsRef.current.get(fileKey);
      if (!existingInterval) {
        const intervalId = window.setInterval(() => {
          setFiles((prev) => {
            const idx = prev.findIndex((f) => f.key === fileKey);
            if (idx === -1) return prev;
            const current = prev[idx];
            if (current.status !== "uploading") return prev;
            if (current.progress >= 90) return prev;
            const updated = [...prev];
            updated[idx] = { ...current, progress: Math.min(90, current.progress + 5) };
            return updated;
          });
        }, 200);
        uploadIntervalsRef.current.set(fileKey, intervalId);
      }

      const p = (async () => {
        try {
          const bookId = await persistBook(file);
          setLastUploadedBookId(bookId);
          setFiles((prev) => {
            const idx = prev.findIndex((f) => f.key === fileKey);
            if (idx === -1) return prev;
            const updated = [...prev];
            updated[idx] = { ...updated[idx], status: "completed", progress: 100 };
            return updated;
          });
          toast.success(`${file.name} uploaded successfully`);
        } catch (err: any) {
          console.error("Failed to save book", err);
          setFiles((prev) => {
            const idx = prev.findIndex((f) => f.key === fileKey);
            if (idx === -1) return prev;
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              status: "error",
              error: err?.message || "Failed to save book",
            };
            return updated;
          });
          toast.error(err?.message || "Failed to save book");
        } finally {
          const id = uploadIntervalsRef.current.get(fileKey);
          if (id) window.clearInterval(id);
          uploadIntervalsRef.current.delete(fileKey);
          inFlightKeysRef.current.delete(fileKey);
          uploadPromisesRef.current.delete(fileKey);
        }
      })();

      uploadPromisesRef.current.set(fileKey, p);
    },
    []
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (convexUserLoading || !convexUser) {
      toast.error("Finishing sign-in… please wait a moment and try again");
      return;
    }

    const seen = new Set<string>();
    const toAdd: File[] = [];
    for (const file of acceptedFiles) {
      const key = makeFileKey(file);
      if (seen.has(key)) continue;
      seen.add(key);

      if (inFlightKeysRef.current.has(key)) continue;
      // Also avoid duplicates already in the UI list.
      if (filesRef.current.some((f) => f.key === key)) continue;

      inFlightKeysRef.current.add(key);
      toAdd.push(file);
    }

    if (toAdd.length === 0) {
      toast.info("That file is already uploading");
      return;
    }

    const newFiles = toAdd.map((file) => ({
      key: makeFileKey(file),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Persist immediately (and show progress while it runs).
    newFiles.forEach((f) => startUpload(f.key, f.file));
  }, [convexUser, convexUserLoading, startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: convexUserLoading || !convexUser,
    accept: {
      "application/pdf": [".pdf"],
      "application/epub+zip": [".epub"],
      "text/plain": [".txt"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const persistBook = async (file: File): Promise<Id<"books">> => {
    if (!convexUser) {
      throw new Error("User profile is still loading. Please try again.");
    }

    const ext = getFileExtension(file.name);
    const fileType = (ext === "pdf" || ext === "epub" || ext === "txt") ? ext : "pdf";

    // Upload to Convex file storage
    const uploadUrl = await generateUploadUrl({});
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }

    const { storageId } = (await res.json()) as { storageId: string };

    const bookId = await createBookWithStorage({
      userId: convexUser._id,
      title: file.name.replace(/\.[^/.]+$/, ""),
      authors: ["Unknown"],
      fileName: file.name,
      fileType: fileType as "pdf" | "epub" | "txt",
      storageId: storageId as any,
      fileSize: file.size,
      publisher: undefined,
      year: undefined,
      edition: undefined,
      isbn: undefined,
      pageCount: undefined,
    });

    return bookId as Id<"books">;
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      if (removed) {
        const id = uploadIntervalsRef.current.get(removed.key);
        if (id) window.clearInterval(id);
        uploadIntervalsRef.current.delete(removed.key);
        inFlightKeysRef.current.delete(removed.key);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const inferredNameFromUrl = useMemo(() => {
    try {
      if (!urlInput.trim()) return "";
      const u = new URL(urlInput);
      const last = u.pathname.split("/").filter(Boolean).pop() || "document.pdf";
      return decodeURIComponent(last);
    } catch {
      return "";
    }
  }, [urlInput]);

  const handleAddUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;

    if (!convexUser) {
      toast.error("Loading your profile… please try again in a moment");
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    // Keep it simple: require direct PDF URL.
    if (!/\.pdf($|\?)/i.test(parsed.pathname + parsed.search)) {
      toast.error("Please provide a direct .pdf URL");
      return;
    }

    setIsUrlSaving(true);
    try {
      const fileName = inferredNameFromUrl || "document.pdf";
      const title = (urlTitle || fileName.replace(/\.[^/.]+$/, "")).trim() || "Untitled";

      // Many sites block Content-Length via CORS; store 0.
      const bookId = await createBook({
        userId: convexUser._id,
        title,
        authors: ["Unknown"],
        fileName,
        fileType: "pdf",
        fileUrl: parsed.toString(),
        fileSize: 0,
        publisher: undefined,
        year: undefined,
        edition: undefined,
        isbn: undefined,
        pageCount: undefined,
      });

      setLastUploadedBookId(bookId as Id<"books">);

      toast.success("PDF URL added to your library");
      setUrlInput("");
      setUrlTitle("");

      // Stay on the upload page so the user can choose next action.
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to add URL");
    } finally {
      setIsUrlSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link href="/dashboard/library">View in Library</Link>
        </Button>
        <Button
          onClick={() => {
            if (!lastUploadedBookId) return;
            router.push(`/dashboard/analysis?bookId=${lastUploadedBookId}`);
          }}
          disabled={!lastUploadedBookId}
        >
          Proceed to Extraction
        </Button>
      </div>

      <Tabs defaultValue="file">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <Link2 className="h-4 w-4" />
            Add by URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="secondary" type="button">
                  Select Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, EPUB, TXT (max 100MB)
                </p>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                placeholder="https://example.com/paper.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use a direct link to a PDF file (.pdf). Some sites may block downloads.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdfTitle">Title (optional)</Label>
              <Input
                id="pdfTitle"
                placeholder={
                  inferredNameFromUrl ? inferredNameFromUrl.replace(/\.[^/.]+$/, "") : ""
                }
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddUrl} disabled={isUrlSaving} className="gap-2">
                <Wand2 className="h-4 w-4" />
                {isUrlSaving ? "Adding..." : "Add PDF URL"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Files ({files.length})</h3>
          {files.map((uploadFile, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                <FileIcon type={getFileExtension(uploadFile.file.name)} className="h-8 w-8 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadFile.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {uploadFile.status === "uploading" && (
                    <Progress value={uploadFile.progress} className="mt-2" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {uploadFile.status === "completed" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {uploadFile.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
