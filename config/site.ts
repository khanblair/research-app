export const siteConfig = {
  name: "ResearchHub",
  description: "AI-powered research reading tool with smart citations, paraphrasing, and bibliography management",
  url: "https://researchhub.com",
  ogImage: "https://researchhub.com/og.jpg",
  links: {
    twitter: "https://twitter.com/researchhub",
    github: "https://github.com/researchhub",
  },
  features: [
    {
      title: "Smart PDF Reader",
      description: "Read PDFs with advanced navigation, highlighting, and note-taking capabilities",
      icon: "BookOpen",
    },
    {
      title: "AI-Powered Q&A",
      description: "Ask questions about your documents and get instant, context-aware answers",
      icon: "MessageSquare",
    },
    {
      title: "Intelligent Paraphrasing",
      description: "Paraphrase text in multiple styles - academic, simplified, or condensed",
      icon: "RefreshCw",
    },
    {
      title: "IEEE Citations",
      description: "Automatic IEEE-format citations with page, chapter, and paragraph references",
      icon: "Quote",
    },
    {
      title: "Bibliography Management",
      description: "Auto-generated bibliography with metadata extraction and export capabilities",
      icon: "Library",
    },
    {
      title: "Full-Text Search",
      description: "Search across all your books, notes, and highlights instantly",
      icon: "Search",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
