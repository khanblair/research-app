"use client";

import { Features } from "@/components/layout/landing/Features";
import { CTA } from "@/components/layout/landing/CTA";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  RefreshCw,
  Quote,
  Library,
  Search,
  Sparkles,
  FileText,
  Highlighter,
  Download,
  Zap,
  Shield,
} from "lucide-react";

const allFeatures = [
  {
    icon: BookOpen,
    title: "Multi-Format Support",
    description:
      "Read PDF, EPUB, and TXT files seamlessly. Advanced PDF viewer with zoom, navigation, and page management.",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Q&A",
    description:
      "Ask questions about your documents and get instant, context-aware answers powered by Claude Sonnet 4.5.",
  },
  {
    icon: Sparkles,
    title: "Smart Summaries",
    description:
      "Generate concise or detailed summaries of any page, chapter, or section with automatic IEEE citations.",
  },
  {
    icon: RefreshCw,
    title: "Advanced Paraphrasing",
    description:
      "Paraphrase text in multiple styles - academic, simplified, condensed, or formal. Perfect for academic writing.",
  },
  {
    icon: Quote,
    title: "IEEE Citation Generator",
    description:
      "Automatic IEEE-format citations with page, chapter, and paragraph references embedded in AI responses.",
  },
  {
    icon: Library,
    title: "Bibliography Management",
    description:
      "Auto-generated bibliography with metadata extraction. Export citations in multiple formats.",
  },
  {
    icon: Highlighter,
    title: "Smart Highlighting",
    description:
      "Create color-coded highlights with notes. All highlights are searchable and linked to specific pages.",
  },
  {
    icon: FileText,
    title: "Rich Note-Taking",
    description:
      "Take notes with full context. Link notes to specific pages, tag them, and search across all your notes.",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description:
      "Search across all your books, notes, and highlights instantly. Find information when you need it.",
  },
  {
    icon: Download,
    title: "Export Everything",
    description:
      "Export your notes, highlights, and bibliography as Markdown or plain text with full citations.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with Next.js and Convex for instant page loads and real-time data synchronization.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your documents and notes are stored securely with Puter.js cloud storage and Convex database.",
  },
];

export default function FeaturesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  } as const;

  return (
    <>
      <section className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              Everything You Need
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                For Research Excellence
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to streamline your academic reading and writing workflow
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {allFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={cardVariants} className="relative group">
                  {/* Animated gradient border */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
                  <Card className="relative border-border hover:shadow-lg transition-all duration-300 h-full bg-card">
                    <CardHeader>
                      <motion.div
                        className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      <CTA />
    </>
  );
}
