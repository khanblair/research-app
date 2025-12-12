"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AILoadingProps {
  className?: string;
}

export function AILoading({ className }: AILoadingProps) {
  return (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
  );
}
