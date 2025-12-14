"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Get page name from pathname
  const getPageName = () => {
    if (pathname === "/research-hub") return siteConfig.name;
    if (pathname.startsWith("/research-hub/")) {
      const pagePath = pathname.replace("/research-hub/", "");
      return `${siteConfig.name} - ${pagePath.charAt(0).toUpperCase() + pagePath.slice(1)}`;
    }
    return siteConfig.name;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center gap-4 px-4 md:px-6">
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/research-hub" className="flex items-center space-x-2">
          <span className="font-bold text-xl">{getPageName()}</span>
        </Link>

        <nav className="hidden md:flex gap-6">
            <Link
              href="/research-hub/features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/research-hub/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
            >
              Khan Space
            </Link>
            <Link
              href="/research-hub/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/research-hub/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/research-hub/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 py-4">
            <nav className="flex flex-col gap-4">
            <Link
              href="/research-hub/features"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/research-hub/pricing"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Khan Space
            </Link>
            <Link
              href="/research-hub/about"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/research-hub/contact"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/research-hub/privacy"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Privacy
            </Link>
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full">Sign In</Button>
            </Link>
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </nav>
          </div>
        </div>
      )}
    </header>
  );
}
