"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook to get the current user from Convex
 * Returns the Convex user object based on the current Clerk user
 */
export function useConvexUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkLoaded && clerkUser ? { clerkId: clerkUser.id } : "skip"
  );

  return {
    user: convexUser,
    isLoading: !clerkLoaded || (clerkLoaded && clerkUser && convexUser === undefined),
    clerkUser,
  };
}
