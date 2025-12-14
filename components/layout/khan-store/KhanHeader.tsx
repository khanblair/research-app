"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, Search } from "lucide-react";
import { useState } from "react";

export function KhanHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        <Link href="/" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-emerald-600" />
          <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Khan Blair
          </span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            href="#services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Services
          </Link>
          <Link
            href="#skills"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Skills
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="#projects"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Projects
          </Link>
          <Link
            href="/research-hub"
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
          >
            Research Hub
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-4">
          <Link href="#contact">
            <Button variant="ghost">Hire Me</Button>
          </Link>
          <Link href="/research-hub">
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
              Research Hub
            </Button>
          </Link>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="#services"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#skills"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Skills
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#projects"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/research-hub"
                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Research Hub
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">Hire Me</Button>
              </Link>
              <Link href="/research-hub" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600">Research Hub</Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
