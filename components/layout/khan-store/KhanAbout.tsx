"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, TrendingUp, Package, Users } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "20+",
    label: "Projects Completed",
  },
  {
    icon: TrendingUp,
    value: "3+",
    label: "Years Experience",
  },
  {
    icon: Star,
    value: "BSc CS",
    label: "Expected May 2026",
  },
  {
    icon: Users,
    value: "Available",
    label: "For Freelance",
  },
];

export function KhanAbout() {
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
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/20 to-blue-500/20 rounded-full blur-3xl -translate-y-1/2"></div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Star className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-foreground">
                Software Developer & Designer
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Khan{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blair
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A highly motivated and skilled Ugandan computer science professional with a strong foundation in software development, 
              mobile app creation, and system design.
            </p>

            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Proficient in building scalable applications using Flutter, Next.js, React, JavaScript, Python, Laravel, Firebase, 
              React Native, Convex, Vercel, and Supabase. Passionate about creating innovative solutions that make a difference.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#projects">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl">
                    View Projects
                  </Button>
                </motion.div>
              </Link>
              <Link href="/research-hub">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline">
                    Research Hub
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right stats */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="perspective-container"
                >
                  <Card className="border-border hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <CardContent className="pt-6 text-center relative z-10">
                      <motion.div
                        className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                      <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                    
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
