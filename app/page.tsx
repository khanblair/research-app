"use client";

import { Header } from "@/components/layout/landing/Header";
import { Footer } from "@/components/layout/landing/Footer";
import { Hero } from "@/components/layout/landing/Hero";
import { Features } from "@/components/layout/landing/Features";
import { CTA } from "@/components/layout/landing/CTA";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <CTA />
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
