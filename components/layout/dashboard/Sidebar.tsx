"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNav } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div
      className={cn(
        "relative border-r bg-background transition-all duration-300 h-screen flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">ResearchHub</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <span className="text-xl font-bold">R</span>
          </Link>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-2">
          {dashboardNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Profile Section */}
      <div className="p-4 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ redirectUrl: "/" })}
          className={cn(
            "w-full text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </div>

      <Separator />

      <div className="border-t p-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("w-full", collapsed && "px-2")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
