"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CitationCopyButton } from "./CitationCopyButton";
import { formatIEEECitation } from "@/lib/citation";
import type { Citation } from "@/types";

interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  const formattedCitation = formatIEEECitation(citation.metadata);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              [{citation.citationNumber}]
            </Badge>
            <h4 className="font-medium">{citation.metadata.title}</h4>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {citation.metadata.authors.join(", ")}
          </p>
          
          <p className="text-sm leading-relaxed">
            {formattedCitation}
          </p>

          {citation.metadata && (
            <div className="flex flex-wrap gap-2 pt-2">
              {citation.metadata.doi && (
                <a
                  href={`https://doi.org/${citation.metadata.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  DOI: {citation.metadata.doi}
                </a>
              )}
              {citation.metadata.url && (
                <a
                  href={citation.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View Source
                </a>
              )}
            </div>
          )}
        </div>

        <CitationCopyButton citation={formattedCitation} />
      </div>
    </Card>
  );
}
