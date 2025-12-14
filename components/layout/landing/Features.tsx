"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  MessageSquare,
  RefreshCw,
  Quote,
  Library,
  Search,
  Sparkles,
  FileText,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: BookOpen,
    title: "Smart PDF Reader",
    description:
      "Read PDFs with advanced navigation, zoom controls, and seamless page management. Supports PDF, EPUB, and TXT files.",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Q&A",
    description:
      "Ask questions about your documents and get instant, context-aware answers powered by Claude Sonnet 4.5.",
  },
  {
    icon: Sparkles,
    title: "Intelligent Summaries",
    description:
      "Generate concise or detailed summaries of any page or chapter with automatic IEEE citation references.",
  },
  {
    icon: RefreshCw,
    title: "Advanced Paraphrasing",
    description:
      "Paraphrase text in multiple styles - academic, simplified, condensed, or formal. Perfect for writing papers.",
  },
  {
    icon: Quote,
    title: "IEEE Citations",
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
    icon: FileText,
    title: "Notes & Highlights",
    description:
      "Create color-coded highlights and notes. All linked to specific pages with full-text search.",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description:
      "Search across all your books, notes, and highlights instantly. Find information when you need it.",
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

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
    <section ref={containerRef} className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          className="mx-auto max-w-3xl text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.div>
          
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Research
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to streamline your academic reading and writing workflow
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index} 
                variants={cardVariants}
                className="perspective-container"
              >
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
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-muted-foreground mb-4">
            And much more features to discover...
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
