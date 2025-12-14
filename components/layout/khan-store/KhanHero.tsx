"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, FileDown, Code, Briefcase } from "lucide-react";
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

export function KhanHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-emerald-950/10 dark:to-emerald-950/20 min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-20">
      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-8 flex justify-center" variants={itemVariants}>
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-all cursor-pointer group">
              <span className="font-semibold text-foreground">👋</span>{" "}
              <span className="group-hover:text-primary transition-colors">
                Available for Freelance Projects
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6"
            variants={itemVariants}
          >
            Hi, I'm
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Khan Blair
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground mb-8 md:mb-10 leading-relaxed"
            variants={itemVariants}
          >
            Software Developer & Graphics Designer building innovative solutions with code. 
            I create scalable apps and systems across web and mobile platforms using modern technologies.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="#services">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="gap-2 text-base px-8 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all">
                  View Services
                  <Code className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <a href="https://khanblair.github.io/portfolio/CV/resume.pdf" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 border-2 hover:bg-primary/5">
                  <FileDown className="h-5 w-5" />
                  Download CV
                </Button>
              </motion.div>
            </a>
            <Link href="/research-hub">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 border-2 hover:bg-primary/5">
                  <Briefcase className="h-5 w-5" />
                  Research Hub
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 md:mt-16 rounded-xl relative group perspective-container"
            variants={itemVariants}
          >
            {/* Animated gradient border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition duration-500 animate-gradient-x"></div>
            
            <div className="relative border-2 border-border bg-card shadow-2xl p-3 rounded-xl overflow-hidden">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
              
              <div className="aspect-video rounded-lg bg-gradient-to-br from-muted via-muted to-muted/80 flex items-center justify-center overflow-hidden relative">
                {/* Animated grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <motion.div
                  className="relative z-10"
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
                  <Code className="h-16 w-16 md:h-24 md:w-24 text-primary/50" />
                </motion.div>
                
                {/* Floating particles effect */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500/30 rounded-full"
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-blue-500/30 rounded-full"
                  animate={{
                    y: [0, 20, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>20+ Projects Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Full-Stack Developer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>BSc Computer Science</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
