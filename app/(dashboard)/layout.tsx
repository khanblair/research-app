"use client";

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { TopNav } from "@/components/layout/dashboard/TopNav";
import { useSyncUser } from "@/hooks/use-sync-user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync Clerk user with Convex
  useSyncUser();

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
