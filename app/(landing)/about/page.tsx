"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
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
              About ResearchHub
            </h1>
            <p className="text-lg text-muted-foreground">
              We're building the future of academic reading and research
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground text-center">
                ResearchHub was born from a simple observation: researchers spend countless hours
                reading papers, taking notes, and managing citations. We believed there had to be a
                better way.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.div variants={cardVariants} className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
                <Card className="relative border-border hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <CardContent className="pt-6 text-center">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Target className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2">Our Mission</h3>
                    <p className="text-sm text-muted-foreground">
                      Empower researchers with AI tools that enhance comprehension and accelerate discovery
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
                <Card className="relative border-border hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <CardContent className="pt-6 text-center">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Zap className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2">Our Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      A world where every researcher has access to intelligent reading assistance
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
                <Card className="relative border-border hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <CardContent className="pt-6 text-center">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Users className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2">Our Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Researchers, engineers, and designers passionate about academic excellence
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button size="lg">Start Your Research Journey</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
