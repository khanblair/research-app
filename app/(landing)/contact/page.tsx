"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
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
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={cardVariants} className="relative group">
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
            <Card className="relative border-border hover:shadow-lg transition-all duration-300 bg-card">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more..."
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={cardVariants} className="relative group">
              {/* Animated gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
              <Card className="relative border-border hover:shadow-lg transition-all duration-300 bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Mail className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">support@researchhub.com</p>
                      <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="relative group">
              {/* Animated gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
              <Card className="relative border-border hover:shadow-lg transition-all duration-300 bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Twitter className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">Twitter</h3>
                      <p className="text-sm text-muted-foreground">@researchhub</p>
                      <p className="text-sm text-muted-foreground">Follow us for updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="relative group">
              {/* Animated gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500 animate-gradient-rotate"></div>
              <Card className="relative border-border hover:shadow-lg transition-all duration-300 bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Available 9am-5pm EST</p>
                      <p className="text-sm text-muted-foreground">Get instant help</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
