"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Server,
  Smartphone,
  Palette,
  PenTool,
  Database,
  Cloud,
  Lightbulb,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Building visually compelling, user-centric web experiences that seamlessly blend aesthetics and functionality.",
  },
  {
    icon: Server,
    title: "System Development",
    description:
      "Creating scalable, high-performing web-based systems tailored to meet business requirements.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Developing mobile applications for both iOS and Android platforms with Flutter and React Native.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Designing user-centered interfaces, wireframes, and prototypes ensuring intuitive flows and strong usability.",
  },
  {
    icon: PenTool,
    title: "Graphics Design",
    description:
      "Modern visuals for brands: logos, posters, social media content using Canva and Adobe Creative Suite.",
  },
  {
    icon: Database,
    title: "Backend & API Development",
    description:
      "Building secure, scalable backends and REST APIs with Laravel, Firebase, Supabase, and Convex.",
  },
  {
    icon: Cloud,
    title: "Cloud Hosting & Deployment",
    description:
      "Deploying and optimizing applications on Vercel, Firebase, and GitHub Pages with CI/CD workflows.",
  },
  {
    icon: Lightbulb,
    title: "Technical Consultation & Mentorship",
    description:
      "Providing expert guidance on technology stack selection, architecture design, and peer mentoring for developers.",
  },
];

export function KhanCategories() {
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
    <section ref={containerRef} id="services" className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
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
            Services I Offer
          </motion.div>
          
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Full-stack development and design services to bring your ideas to life
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div 
                key={index} 
                variants={cardVariants}
                className="perspective-container"
              >
                <Card className="border-border hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm overflow-hidden group relative card-hover shine-effect cursor-pointer">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
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
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-sm text-muted-foreground">
                      {service.description}
                    </CardDescription>
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
  );
}
