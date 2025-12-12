import { readFileAsText } from "./file-utils";
import { extractTextFromPDF } from "./pdf-utils";
import { performOCR } from "./puter";

export const extractTextFromFile = async (
  file: File,
  fileType: "pdf" | "epub" | "txt"
): Promise<string> => {
  try {
    switch (fileType) {
      case "pdf":
        return await extractTextFromPDFFile(file);
      
      case "txt":
        return await readFileAsText(file);
      
      case "epub":
        return await extractTextFromEPUB(file);
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
};

const extractTextFromPDFFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const url = URL.createObjectURL(file);
  
  try {
    const { loadPDF, extractTextFromPDF } = await import("./pdf-utils");
    const pdf = await loadPDF(url);
    const text = await extractTextFromPDF(pdf);
    return text;
  } finally {
    URL.revokeObjectURL(url);
  }
};

const extractTextFromEPUB = async (file: File): Promise<string> => {
  // Simplified EPUB text extraction
  // In production, use epubjs library for proper extraction
  const arrayBuffer = await file.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);
  
  // Basic HTML tag removal
  const withoutTags = text.replace(/<[^>]*>/g, " ");
  const cleaned = withoutTags.replace(/\s+/g, " ").trim();
  
  return cleaned;
};

export const extractTextWithOCR = async (imageUrl: string): Promise<string> => {
  try {
    return await performOCR(imageUrl);
  } catch (error) {
    console.error("OCR extraction failed:", error);
    throw error;
  }
};
