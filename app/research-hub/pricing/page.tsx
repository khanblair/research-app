import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individual researchers",
    features: [
      "Up to 10 books",
      "Basic AI features (100 queries/month)",
      "Standard PDF viewer",
      "Notes & highlights",
      "Search functionality",
      "Export to Markdown",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    description: "For serious researchers",
    popular: true,
    features: [
      "Unlimited books",
      "Unlimited AI queries",
      "Advanced PDF viewer with OCR",
      "All paraphrasing styles",
      "Priority AI responses",
      "Advanced citation formats",
      "Cloud backup",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$29",
    description: "For research teams",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Shared libraries",
      "Collaborative notes",
      "Team bibliography",
      "Admin controls",
      "API access",
      "Dedicated support",
    ],
  },
];

export default function PricingPage() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Flexible Pricing
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transparent
            </span>
            {" "}Pricing
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the perfect plan for your research needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${
                plan.popular ? "md:scale-105" : ""
              }`}
            >
              {/* Animated gradient border for popular plan */}
              {plan.popular && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition duration-500 animate-gradient-x"></div>
              )}
              
              <Card className={`relative h-full transition-all duration-300 ${
                plan.popular 
                  ? "border-2 border-primary shadow-xl bg-card" 
                  : "border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm card-hover"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      {plan.price}
                    </span>
                    {plan.price !== "$0" && (
                      <span className="text-muted-foreground text-lg">/month</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/dashboard" className="block">
                    <Button
                      className={`w-full ${
                        plan.popular 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
                
                {/* Corner accent */}
                {!plan.popular && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
