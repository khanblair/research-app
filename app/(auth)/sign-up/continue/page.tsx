"use client";

import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SignUpContinuePage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // Check sign-up status on mount
  useEffect(() => {
    if (!isLoaded) return;

    // If no sign-up in progress, redirect to sign-in
    if (!signUp) {
      router.push("/sign-in");
      return;
    }

    // If sign-up is already complete, redirect to dashboard
    if (signUp.status === "complete" && signUp.createdSessionId) {
      setActive({ session: signUp.createdSessionId })
        .then(() => {
          router.push("/dashboard");
          toast.success("Welcome to ResearchHub!");
        })
        .catch((err) => {
          console.error("Session activation error:", err);
          router.push("/sign-in");
        });
    }
  }, [isLoaded, signUp, setActive, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check if sign-up is already complete (OAuth flow)
      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.push("/dashboard");
        toast.success("Welcome to ResearchHub!");
        return;
      }

      // If sign-up is not complete, try to update with username
      if (signUp.status === "missing_requirements") {
        try {
          const updatedSignUp = await signUp.update({
            username: username.toLowerCase().trim(),
          });

          // After update, check status again
          if (updatedSignUp.status === "complete" && updatedSignUp.createdSessionId) {
            await setActive({ session: updatedSignUp.createdSessionId });
            router.push("/dashboard");
            toast.success("Welcome to ResearchHub!");
          } else {
            // If still not complete, redirect to dashboard anyway
            // The username will be updated through Clerk's UI if needed
            router.push("/dashboard");
          }
        } catch (updateErr: any) {
          console.error("Update error:", updateErr);
          // If update fails, try to complete anyway
          // This handles cases where OAuth sign-up is already done
          if (signUp.createdSessionId) {
            await setActive({ session: signUp.createdSessionId });
            router.push("/dashboard");
            toast.success("Welcome to ResearchHub!");
          } else {
            throw updateErr;
          }
        }
      } else {
        // Unknown status, redirect to sign-in
        console.log("Unknown sign-up status:", signUp.status);
        router.push("/sign-in");
        toast.error("Session expired. Please sign in again.");
      }
    } catch (err: any) {
      console.error("Continue error:", err);
      const errorMessage = err.errors?.[0]?.message || err.message || "Failed to complete sign-up";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign up
        </Link>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500 animate-gradient-rotate"></div>
          
          <Card className="relative">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Almost there!</CardTitle>
              <CardDescription>
                Please choose a username to complete your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="your_username"
                      className="pl-9"
                      required
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Only lowercase letters, numbers, and underscores. At least 3 characters.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Sign Up
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
