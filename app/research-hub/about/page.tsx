"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
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
              Our Story
            </motion.div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                ResearchHub
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're building the future of academic reading and research
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              {/* Decorative card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 blur-xl"></div>
              <div className="relative bg-card/80 backdrop-blur-sm border-2 border-border rounded-2xl p-8">
                <div className="prose prose-lg dark:prose-invert mx-auto">
                  <p className="text-muted-foreground text-center text-lg leading-relaxed">
                    ResearchHub was born from a simple observation: researchers spend countless hours
                    reading papers, taking notes, and managing citations. We believed there had to be a
                    better way.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.div variants={cardVariants} className="perspective-container">
                <Card className="border-border hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover shine-effect">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="pt-6 text-center relative z-10">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Target className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2 text-lg">Our Mission</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Empower researchers with AI tools that enhance comprehension and accelerate discovery
                    </p>
                  </CardContent>
                  
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} className="perspective-container">
                <Card className="border-border hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover shine-effect">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="pt-6 text-center relative z-10">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Zap className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2 text-lg">Our Vision</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A world where every researcher has access to intelligent reading assistance
                    </p>
                  </CardContent>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} className="perspective-container">
                <Card className="border-border hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover shine-effect">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="pt-6 text-center relative z-10">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Users className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold mb-2 text-lg">Our Team</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Researchers, engineers, and designers passionate about academic excellence
                    </p>
                  </CardContent>
                  
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl">
                  Start Your Research Journey
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
