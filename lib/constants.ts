export const APP_NAME = "ResearchHub";
export const APP_DESCRIPTION = "AI-Powered Research Reading Tool";

export const FILE_TYPES = {
  PDF: "pdf",
  EPUB: "epub",
  TXT: "txt",
} as const;

export const SUPPORTED_FILE_EXTENSIONS = [".pdf", ".epub", ".txt"];
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const HIGHLIGHT_COLORS = [
  { value: "yellow", label: "Yellow", hex: "#fef08a" },
  { value: "green", label: "Green", hex: "#86efac" },
  { value: "blue", label: "Blue", hex: "#93c5fd" },
  { value: "purple", label: "Purple", hex: "#d8b4fe" },
  { value: "pink", label: "Pink", hex: "#fbcfe8" },
] as const;

export const PARAPHRASE_STYLES = [
  { value: "simpler", label: "Simpler", description: "Easier to understand" },
  { value: "academic", label: "Academic", description: "Formal and sophisticated" },
  { value: "shorter", label: "Shorter", description: "More concise" },
  { value: "formal", label: "Formal", description: "Professional tone" },
] as const;

export const SUMMARY_TYPES = [
  { value: "short", label: "Short Summary", description: "2-3 sentences" },
  { value: "detailed", label: "Detailed Summary", description: "1-2 paragraphs" },
] as const;

export const DEFAULT_PDF_SCALE = 1.5;
export const MIN_PDF_SCALE = 0.5;
export const MAX_PDF_SCALE = 3.0;
export const PDF_SCALE_STEP = 0.25;
