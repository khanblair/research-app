"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenu() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-8 w-8",
          userButtonPopoverCard: "shadow-lg",
          userButtonPopoverActionButton: "hover:bg-accent",
        },
      }}
      afterSignOutUrl="/"
    />
  );
}
