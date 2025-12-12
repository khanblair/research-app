"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export type NoteSortBy = "date-desc" | "date-asc" | "page";
export type NoteFilterBy = "all" | "manual" | "ai";

interface NoteFiltersProps {
  sortBy: NoteSortBy;
  filterBy: NoteFilterBy;
  searchQuery: string;
  onSortChange: (sort: NoteSortBy) => void;
  onFilterChange: (filter: NoteFilterBy) => void;
  onSearchChange: (query: string) => void;
}

export function NoteFilters({
  sortBy,
  filterBy,
  searchQuery,
  onSortChange,
  onFilterChange,
  onSearchChange,
}: NoteFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="search-notes" className="sr-only">
          Search notes
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-notes"
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-[140px]">
          <Label htmlFor="filter-type" className="sr-only">
            Filter by type
          </Label>
          <Select value={filterBy} onValueChange={(v) => onFilterChange(v as NoteFilterBy)}>
            <SelectTrigger id="filter-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notes</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="ai">AI Generated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[140px]">
          <Label htmlFor="sort-by" className="sr-only">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as NoteSortBy)}>
            <SelectTrigger id="sort-by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="page">By Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
