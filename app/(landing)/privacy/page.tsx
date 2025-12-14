"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const privacySections = [
  {
    icon: Shield,
    title: "Information We Collect",
    content: [
      "Account information (name, email address)",
      "Documents and files you upload",
      "Notes, highlights, and annotations you create",
      "Usage data and analytics",
      "Device and browser information",
    ],
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content: [
      "Provide and improve our services",
      "Process your documents using AI",
      "Generate summaries and citations",
      "Sync your data across devices",
      "Communicate with you about updates and features",
    ],
  },
  {
    icon: Database,
    title: "Data Storage & Security",
    content: [
      "Your documents are stored securely with Puter.js cloud storage",
      "Database hosted on Convex with enterprise-grade security",
      "All data transmissions are encrypted using SSL/TLS",
      "Regular security audits and updates",
      "Access controls and authentication protocols",
    ],
  },
  {
    icon: Eye,
    title: "Data Sharing",
    content: [
      "We do not sell your personal information",
      "AI processing is done through secure API calls",
      "Third-party services (Groq, ApiFreeLLM) process text only",
      "No document content is stored by AI providers",
      "Analytics data is anonymized",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "Access your personal data at any time",
      "Request deletion of your account and data",
      "Export your documents and notes",
      "Opt-out of analytics and marketing communications",
      "Update or correct your information",
    ],
  },
  {
    icon: AlertCircle,
    title: "Cookies & Tracking",
    content: [
      "Essential cookies for authentication",
      "Analytics cookies to improve our service",
      "No third-party advertising cookies",
      "You can manage cookie preferences in your browser",
    ],
  },
];

export default function PrivacyPage() {
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
            Your Data is Safe
          </motion.div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
              Privacy
            </span>
            {" "}Policy
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your privacy is important to us. Here's how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 14, 2025
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {privacySections.map((section, index) => {
            const Icon = section.icon;
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
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start leading-relaxed">
                          <span className="mr-2 text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
              <CardDescription>
                If you have any questions about our privacy policy or how we handle your data,
                please don't hesitate to reach out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Email us at:{" "}
                <a href="mailto:privacy@researchhub.com" className="text-primary hover:underline">
                  privacy@researchhub.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                We will respond to all privacy-related inquiries within 48 hours.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
