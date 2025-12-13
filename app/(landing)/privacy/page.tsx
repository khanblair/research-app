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
        staggerChildren: 0.1,
      },
    },
  } as const;

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
    <section className="py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-3xl text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
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
              <motion.div key={index} variants={cardVariants} className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
                <Card className="relative border-border hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <CardHeader>
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
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
