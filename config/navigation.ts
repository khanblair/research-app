import { 
  BookOpen, 
  Library, 
  BookMarked, 
  Quote, 
  Search, 
  Settings,
  Home,
  Upload,
  Sparkles,
  MessageSquare,
  Scan,
  Wand2,
} from "lucide-react";

export const dashboardNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Library",
    href: "/dashboard/library",
    icon: Library,
  },
  {
    title: "Upload",
    href: "/dashboard/library/upload",
    icon: Upload,
  },
  {
    title: "Text Extraction",
    href: "/dashboard/analysis",
    icon: Scan,
  },
  {
    title: "AI Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Paraphrase",
    href: "/dashboard/paraphrase",
    icon: Wand2,
  },
  {
    title: "Notes",
    href: "/dashboard/notes",
    icon: BookMarked,
  },
  {
    title: "Bibliography",
    href: "/dashboard/bibliography",
    icon: Quote,
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const landingNav = [
  {
    title: "Features",
    href: "/features",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];
