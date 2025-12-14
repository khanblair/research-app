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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      },
    },
  } as const;

  return (
    <>
      <section className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Complete Feature Set
            </motion.div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              Everything You Need
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                For Research Excellence
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
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
                <motion.div key={index} variants={cardVariants} className="perspective-container">
                  <Card className="border-border hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover shine-effect">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <CardHeader className="relative z-10">
                      <motion.div
                        className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>

                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
