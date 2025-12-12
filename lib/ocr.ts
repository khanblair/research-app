import { performOCR as puterOCR } from "./puter";
import Tesseract from "tesseract.js";

export const performOCR = async (
  imageUrl: string,
  usePuterVision: boolean = true
): Promise<string> => {
  if (usePuterVision) {
    try {
      return await puterOCR(imageUrl);
    } catch (error: any) {
      const msg = error?.message || String(error);
      console.warn("Puter Vision OCR failed, falling back to Tesseract:", msg);
      // Don't propagate the error - fall back to Tesseract instead
      return await performTesseractOCR(imageUrl);
    }
  }
  
  return await performTesseractOCR(imageUrl);
};

const performTesseractOCR = async (imageUrl: string): Promise<string> => {
  try {
    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (info) => console.log(info),
    });
    
    return result.data.text;
  } catch (error) {
    console.error("Tesseract OCR error:", error);
    throw new Error("OCR processing failed");
  }
};
