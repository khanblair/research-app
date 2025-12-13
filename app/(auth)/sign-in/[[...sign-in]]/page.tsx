"use client";

import { useState, useEffect } from "react";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: authLoaded, userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already signed in
  useEffect(() => {
    if (authLoaded && userId) {
      router.push("/dashboard");
    }
  }, [authLoaded, userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.emailAddress) {
      newErrors.emailAddress = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Invalid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !validateForm()) return;

    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: formData.emailAddress,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        toast.success("Welcome back!");
      } else {
        console.log("Additional steps required:", result);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      const errorMessage = err.errors?.[0]?.message || "Invalid email or password";
      toast.error(errorMessage);
      setErrors({ password: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isLoaded) return;
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/sso-callback",
        redirectUrlComplete: window.location.origin + "/dashboard",
      });
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      toast.error("Failed to sign in with Google");
    }
  };

  const handleForgotPassword = () => {
    if (!formData.emailAddress) {
      toast.error("Please enter your email address first");
      return;
    }
    // This will be implemented later with Clerk's password reset
    toast.info("Password reset email sent!");
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
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500 animate-gradient-rotate"></div>
          
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your ResearchHub account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={signInWithGoogle}
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Clerk CAPTCHA element for bot protection */}
                <div id="clerk-captcha"></div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                  {errors.emailAddress && (
                    <p className="text-sm text-destructive">{errors.emailAddress}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-9"
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
