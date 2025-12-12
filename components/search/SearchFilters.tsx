"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SearchType = "all" | "books" | "notes" | "highlights";
export type SearchSortBy = "relevance" | "date-desc" | "date-asc";

interface SearchFiltersProps {
  type: SearchType;
  sortBy: SearchSortBy;
  onTypeChange: (type: SearchType) => void;
  onSortChange: (sort: SearchSortBy) => void;
}

export function SearchFilters({
  type,
  sortBy,
  onTypeChange,
  onSortChange,
}: SearchFiltersProps) {
  const types: { value: SearchType; label: string }[] = [
    { value: "all", label: "All Results" },
    { value: "books", label: "Books Only" },
    { value: "notes", label: "Notes Only" },
    { value: "highlights", label: "Highlights Only" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Filter by Type</Label>
        <div className="flex flex-wrap gap-4">
          {types.map((t) => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox
                id={t.value}
                checked={type === t.value}
                onCheckedChange={() => onTypeChange(t.value)}
              />
              <Label
                htmlFor={t.value}
                className="cursor-pointer text-sm font-normal"
              >
                {t.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full sm:w-[180px]">
        <Label htmlFor="sort-by" className="text-sm font-medium">
          Sort By
        </Label>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SearchSortBy)}>
          <SelectTrigger id="sort-by" className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
