"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatInTextCitation } from "@/lib/citation";
import type { CitationReference } from "@/types";

interface InlineCitationProps {
  citationNumber: number;
  page?: number;
  chapter?: number;
  paragraph?: number;
  fullCitation?: string;
}

export function InlineCitation({
  citationNumber,
  page,
  chapter,
  paragraph,
  fullCitation,
}: InlineCitationProps) {
  // Create CitationReference object based on what's provided
  let reference: import("@/types").CitationReference | undefined;
  
  if (page) {
    reference = { citationId: citationNumber, page, type: "page" };
  } else if (chapter) {
    reference = { citationId: citationNumber, chapter, type: "chapter" };
  } else if (paragraph) {
    reference = { citationId: citationNumber, paragraph, type: "paragraph" };
  }
  
  const inTextCitation = formatInTextCitation(citationNumber, reference);

  if (!fullCitation) {
    return (
      <Badge variant="secondary" className="font-mono text-xs">
        {inTextCitation}
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="cursor-help font-mono text-xs hover:bg-secondary/80"
          >
            {inTextCitation}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p className="text-sm">{fullCitation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
