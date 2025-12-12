"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import { NoteTags } from "./NoteTags";

interface NoteEditorProps {
  bookId: Id<"books">;
  noteId?: Id<"notes">;
  initialContent?: string;
  initialTags?: string[];
  page?: number;
  chapter?: number;
  selectedText?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export function NoteEditor({
  bookId,
  noteId,
  initialContent = "",
  initialTags = [],
  page,
  chapter,
  selectedText,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [isSaving, setIsSaving] = useState(false);

  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      if (noteId) {
        await updateNote({
          id: noteId,
          content,
          tags,
        });
        toast.success("Note updated successfully");
      } else {
        await createNote({
          bookId,
          content,
          tags,
          page,
          chapter,
          selectedText,
          isAiGenerated: false,
        });
        toast.success("Note created successfully");
      }

      onSave?.();
      
      // Clear form if creating new note
      if (!noteId) {
        setContent("");
        setTags([]);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {selectedText && (
          <div className="rounded-md bg-muted p-3">
            <Label className="text-xs text-muted-foreground">
              Selected Text:
            </Label>
            <p className="mt-1 text-sm italic">&quot;{selectedText}&quot;</p>
          </div>
        )}

        {(page || chapter) && (
          <div className="flex gap-2 text-xs text-muted-foreground">
            {page && <span>Page {page}</span>}
            {chapter && <span>Chapter {chapter}</span>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="note-content">Note</Label>
          <Textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <NoteTags tags={tags} onChange={setTags} />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : noteId ? "Update Note" : "Save Note"}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
