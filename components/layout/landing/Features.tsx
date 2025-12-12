import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  MessageSquare,
  RefreshCw,
  Quote,
  Library,
  Search,
  Sparkles,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Smart PDF Reader",
    description:
      "Read PDFs with advanced navigation, zoom controls, and seamless page management. Supports PDF, EPUB, and TXT files.",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Q&A",
    description:
      "Ask questions about your documents and get instant, context-aware answers powered by Claude Sonnet 4.5.",
  },
  {
    icon: Sparkles,
    title: "Intelligent Summaries",
    description:
      "Generate concise or detailed summaries of any page or chapter with automatic IEEE citation references.",
  },
  {
    icon: RefreshCw,
    title: "Advanced Paraphrasing",
    description:
      "Paraphrase text in multiple styles - academic, simplified, condensed, or formal. Perfect for writing papers.",
  },
  {
    icon: Quote,
    title: "IEEE Citations",
    description:
      "Automatic IEEE-format citations with page, chapter, and paragraph references embedded in AI responses.",
  },
  {
    icon: Library,
    title: "Bibliography Management",
    description:
      "Auto-generated bibliography with metadata extraction. Export citations in multiple formats.",
  },
  {
    icon: FileText,
    title: "Notes & Highlights",
    description:
      "Create color-coded highlights and notes. All linked to specific pages with full-text search.",
  },
  {
    icon: Search,
    title: "Full-Text Search",
    description:
      "Search across all your books, notes, and highlights instantly. Find information when you need it.",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
            Everything You Need for Research
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to streamline your academic reading and writing workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
