"use client";

import { highlightSearchTerms } from "@/lib/search";

interface SearchHighlightProps {
  text: string;
  query: string;
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const highlightedText = highlightSearchTerms(text, query);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: highlightedText }}
      className="[&_mark]:bg-yellow-200 [&_mark]:font-medium [&_mark]:dark:bg-yellow-900"
    />
  );
}
