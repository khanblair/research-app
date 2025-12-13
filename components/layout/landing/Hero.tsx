"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
} as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-20">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-8 flex justify-center" variants={itemVariants}>
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-foreground/20 transition-all">
              <span className="font-semibold text-foreground">New:</span> AI-Powered
              Paraphrasing & All Citations
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6"
            variants={itemVariants}
          >
            Research Reading
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reimagined with AI
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground mb-8 md:mb-10"
            variants={itemVariants}
          >
            Upload PDFs, ask questions, generate summaries, paraphrase text, and automatically
            create IEEE-formatted citations. Your complete research assistant in one place.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 text-base px-8">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                <BookOpen className="h-5 w-5" />
                Explore Features
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 md:mt-16 rounded-lg relative group"
            variants={itemVariants}
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-rotate"></div>
            <div className="relative border border-border bg-card shadow-2xl p-2 rounded-lg">
              <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <BookOpen className="h-16 w-16 md:h-24 md:w-24 text-muted-foreground/30" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </section>
  );
}
