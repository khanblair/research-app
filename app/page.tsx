"use client";

import { KhanHeader } from "@/components/layout/khan-store/KhanHeader";
import { KhanFooter } from "@/components/layout/khan-store/KhanFooter";
import { KhanHero } from "@/components/layout/khan-store/KhanHero";
import { KhanCategories } from "@/components/layout/khan-store/KhanCategories";
import { KhanFeatures } from "@/components/layout/khan-store/KhanFeatures";
import { KhanAbout } from "@/components/layout/khan-store/KhanAbout";
import { KhanTestimonials } from "@/components/layout/khan-store/KhanTestimonials";
import { KhanContact } from "@/components/layout/khan-store/KhanContact";
import { KhanCTA } from "@/components/layout/khan-store/KhanCTA";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <KhanHeader />
      <main className="flex-1">
        <KhanHero />
        <KhanCategories />
        <KhanFeatures />
        <KhanAbout />
        <KhanTestimonials />
        <KhanContact />
        <KhanCTA />
      </main>
      <ScrollToTopButton />
      <KhanFooter />
    </div>
  );
}
