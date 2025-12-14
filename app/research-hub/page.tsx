"use client";

import { Hero } from "@/components/layout/landing/Hero";
import { Features } from "@/components/layout/landing/Features";
import { Showcase } from "@/components/layout/landing/Showcase";
import { CTA } from "@/components/layout/landing/CTA";

export default function ResearchHubPage() {
  return (
    <>
      <Hero />
      <Features />
      <Showcase />
      <CTA />
    </>
  );
}
