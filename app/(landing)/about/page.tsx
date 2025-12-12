import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <section className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              About ResearchHub
            </h1>
            <p className="text-lg text-muted-foreground">
              We're building the future of academic reading and research
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground text-center">
                ResearchHub was born from a simple observation: researchers spend countless hours
                reading papers, taking notes, and managing citations. We believed there had to be a
                better way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    Empower researchers with AI tools that enhance comprehension and accelerate discovery
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    A world where every researcher has access to intelligent reading assistance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Our Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Researchers, engineers, and designers passionate about academic excellence
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg">Start Your Research Journey</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
