"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook to sync the current Clerk user with Convex
 * Should be used in the root layout or a provider component
 */
export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Sync user with Convex
    syncUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      username: user.username || undefined,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      imageUrl: user.imageUrl || undefined,
    }).catch((error) => {
      console.error("Failed to sync user with Convex:", error);
    });
  }, [isLoaded, user, syncUser]);
}
