"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Trash2, Bot } from "lucide-react";
import type { Note } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function NoteCard({ note, onDelete, onClick }: NoteCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && note._id) {
      onDelete(note._id);
    }
  };

  return (
    <Card
      className="group cursor-pointer p-4 transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {note.page && (
              <Badge variant="outline" className="text-xs">
                Page {note.page}
              </Badge>
            )}
            {note.chapter && (
              <Badge variant="outline" className="text-xs">
                Ch. {note.chapter}
              </Badge>
            )}
            {note.isAiGenerated && (
              <Badge variant="secondary" className="text-xs">
                <Bot className="mr-1 h-3 w-3" />
                AI {note.aiType}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        {note.selectedText && (
          <div className="rounded-md bg-muted/50 p-2 text-sm italic text-muted-foreground">
            &quot;{note.selectedText}&quot;
          </div>
        )}

        <p className="line-clamp-3 text-sm leading-relaxed">
          {note.content}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
