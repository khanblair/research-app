"use client";

import { useCallback, useMemo, useState } from "react";
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

interface UploadedFile {
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

  const generateUploadUrl = useMutation(api.books.generateUploadUrl);
  const createBookWithStorage = useMutation(api.books.createWithStorage);
  const createBook = useMutation(api.books.create);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload then persist to Convex storage
    newFiles.forEach((uploadFile, index) => {
      simulateUpload(files.length + index);
    });
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/epub+zip": [".epub"],
      "text/plain": [".txt"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const simulateUpload = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index].status = "uploading";
      return updated;
    });

    const interval = setInterval(() => {
      setFiles((prev) => {
        const updated = [...prev];
        if (updated[index].progress >= 100) {
          updated[index].status = "completed";
          updated[index].progress = 100;
          clearInterval(interval);
          // Persist book record once upload completes
          persistBook(updated[index].file)
            .then(() => {
              toast.success(`${updated[index].file.name} uploaded successfully`);
            })
            .catch((err) => {
              console.error("Failed to save book", err);
              toast.error("Failed to save book");
              updated[index].status = "error";
            });
        } else {
          updated[index].progress += 10;
        }
        return updated;
      });
    }, 200);
  };

  const persistBook = async (file: File) => {
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

    await createBookWithStorage({
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
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
      await createBook({
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

      toast.success("PDF URL added to your library");
      setUrlInput("");
      setUrlTitle("");

      // Jump to analysis (user can extract + chat from there).
      window.location.href = "/dashboard/analysis";
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to add URL");
    } finally {
      setIsUrlSaving(false);
    }
  };

  return (
    <div className="space-y-4">
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
