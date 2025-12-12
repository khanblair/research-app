"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NoteCard } from "./NoteCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StickyNote } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface NotesListProps {
  bookId?: Id<"books">;
  onNoteClick?: (noteId: Id<"notes">) => void;
}

export function NotesList({ bookId, onNoteClick }: NotesListProps) {
  const notes = useQuery(api.notes.list, bookId ? { bookId } : {});
  const deleteNote = useMutation(api.notes.remove);

  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote({ id: noteId as Id<"notes"> });
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  if (notes === undefined) {
    return <LoadingSpinner />;
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title="No notes yet"
        description="Start taking notes while reading your research materials"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Notes ({notes.length})
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={handleDelete}
            onClick={() => onNoteClick?.(note._id)}
          />
        ))}
      </div>
    </div>
  );
}
