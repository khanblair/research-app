"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CitationCard } from "./CitationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BookOpen } from "lucide-react";
import { useConvexUser } from "@/hooks/use-convex-user";

export function BibliographyList() {
  const { user: convexUser } = useConvexUser();
  const citations = useQuery(
    api.bibliography.list,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  if (citations === undefined) {
    return <LoadingSpinner />;
  }

  if (citations.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No citations yet"
        description="Add your first citation to start building your bibliography"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Bibliography ({citations.length} {citations.length === 1 ? 'citation' : 'citations'})
        </h2>
      </div>
      
      {citations.map((citation) => (
        <CitationCard key={citation._id} citation={citation} />
      ))}
    </div>
  );
}
