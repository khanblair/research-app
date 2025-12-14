"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Salary Requisition Management System",
    role: "Flutter, Supabase, Dart",
    image: "SR",
    rating: 5,
    comment: "A comprehensive system for managing salary requisitions with real-time updates, authentication, and secure data handling.",
  },
  {
    name: "CofeeLink – Agro-Marketing App",
    role: "Flutter, Supabase",
    image: "CL",
    rating: 5,
    comment: "Connecting coffee farmers with buyers. Features include product listings, real-time chat, and secure transactions.",
  },
  {
    name: "PrismX Web & Mobile",
    role: "Next.js, React Native, Convex, Clerk",
    image: "PX",
    rating: 5,
    comment: "Full-stack cross-platform application with authentication, real-time database, and modern responsive design.",
  },
  {
    name: "Hamis Thread Stores Web App",
    role: "Next.js, Supabase, Tailwind",
    image: "HT",
    rating: 5,
    comment: "E-commerce platform for fashion retail with inventory management, cart functionality, and payment integration.",
  },
  {
    name: "Right Media News & Blog App",
    role: "Next.js, Supabase",
    image: "RM",
    rating: 5,
    comment: "Modern news platform with article publishing, categorization, search functionality, and user engagement features.",
  },
  {
    name: "Chat Aura - AI Chatbot",
    role: "Flutter, Gemini AI",
    image: "CA",
    rating: 5,
    comment: "Intelligent conversational AI chatbot with natural language processing and context-aware responses.",
  },
];

export function KhanTestimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

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
            Featured Projects
          </motion.div>
          
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Recent{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A showcase of innovative solutions built with modern technologies
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              className="perspective-container"
            >
              <Card className="border-border hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardContent className="pt-6 relative z-10">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-emerald-500/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                  
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
