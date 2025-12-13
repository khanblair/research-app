"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SSOCallbackPage() {
  const router = useRouter();
  const { isLoaded: authLoaded, userId } = useAuth();
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();

  useEffect(() => {
    if (!authLoaded || !signUpLoaded) return;

    const handleCallback = async () => {
      // If user is already authenticated, redirect to dashboard
      if (userId) {
        router.push("/dashboard");
        return;
      }

      // Check if sign-up exists and its status
      if (signUp) {
        // If sign-up is complete, activate session and redirect
        if (signUp.status === "complete" && signUp.createdSessionId) {
          try {
            await setActive({ session: signUp.createdSessionId });
            router.push("/dashboard");
            return;
          } catch (err) {
            console.error("Session activation error:", err);
          }
        }
        
        // If sign-up requires additional info (like username)
        if (signUp.status === "missing_requirements") {
          router.push("/sign-up/continue");
          return;
        }
      }

      // If nothing is happening after 3 seconds, redirect to sign-in
      setTimeout(() => {
        if (!userId) {
          router.push("/sign-in");
        }
      }, 3000);
    };

    handleCallback();
  }, [authLoaded, signUpLoaded, userId, signUp, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Completing sign in...</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we set up your account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
