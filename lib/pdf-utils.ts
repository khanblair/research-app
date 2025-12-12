"use client";

// NOTE: Even with "use client", modules imported by Client Components can still be
// evaluated in non-browser contexts during dev/HMR. pdfjs-dist touches DOM globals
// (e.g. DOMMatrix) at module evaluation time, so we must lazy-load it in the browser.

type PdfJs = any;

let pdfjsPromise: Promise<PdfJs> | null = null;

const loadPdfjsFromPublic = async (): Promise<PdfJs> => {
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only be used in the browser");
  }

  // Already loaded by a previous call.
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-pdfjs-wrapper="1"]') as
      | HTMLScriptElement
      | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load PDF.js wrapper")));
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "/pdfjs/pdfjs-wrapper.mjs";
    script.async = true;
    script.dataset.pdfjsWrapper = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PDF.js wrapper"));
    document.head.appendChild(script);
  });

  if (!(window as any).pdfjsLib) {
    throw new Error("PDF.js wrapper loaded but pdfjsLib was not initialized");
  }

  return (window as any).pdfjsLib;
};

const getPdfjs = async (): Promise<PdfJs> => {
  if (!pdfjsPromise) {
    pdfjsPromise = loadPdfjsFromPublic();
  }
  return await pdfjsPromise;
};

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

export interface PDFPageProxy {
  pageNumber: number;
  getViewport: (params: { scale: number }) => PDFViewport;
  render: (params: RenderParameters) => PDFRenderTask;
  getTextContent: () => Promise<TextContent>;
}

export interface PDFViewport {
  width: number;
  height: number;
  scale: number;
}

export interface RenderParameters {
  canvasContext: CanvasRenderingContext2D;
  viewport: PDFViewport;
}

export interface PDFRenderTask {
  promise: Promise<void>;
  cancel: () => void;
}

export interface TextContent {
  items: Array<{
    str: string;
    transform: number[];
    width: number;
    height: number;
  }>;
}

export const loadPDF = async (url: string): Promise<PDFDocumentProxy> => {
  try {
    const pdfjs = await getPdfjs();
    const loadingTask = (pdfjs as any).getDocument(url);
    const pdf = await loadingTask.promise;
    return pdf as unknown as PDFDocumentProxy;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw error;
  }
};

export const loadPDFData = async (
  data: ArrayBuffer | Uint8Array
): Promise<PDFDocumentProxy> => {
  try {
    const pdfjs = await getPdfjs();
    const loadingTask = (pdfjs as any).getDocument({ data });
    const pdf = await loadingTask.promise;
    return pdf as unknown as PDFDocumentProxy;
  } catch (error) {
    console.error('Error loading PDF from data:', error);
    throw error;
  }
};

export const renderPage = async (
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<void> => {
  const viewport = page.getViewport({ scale });
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not get canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
};

export const extractTextFromPage = async (page: PDFPageProxy): Promise<string> => {
  try {
    // pdf.js provides positional info. We use it to reconstruct lines so text isn't "missing"
    // due to aggressive joining.
    const textContent = await (page as any).getTextContent({ disableCombineTextItems: false });
    const items = (textContent?.items || []) as any[];

    let lastY: number | null = null;
    let line = "";
    const lines: string[] = [];

    for (const item of items) {
      const str = (item?.str ?? "").toString();
      if (!str) continue;

      const transform = item?.transform as number[] | undefined;
      const y = Array.isArray(transform) ? transform[5] : null;

      // New line when Y changes significantly.
      if (typeof y === "number") {
        if (lastY !== null && Math.abs(y - lastY) > 2.5) {
          if (line.trim()) lines.push(line.trimEnd());
          line = "";
        }
        lastY = y;
      }

      // Add a space between adjacent tokens when needed.
      if (line && !line.endsWith(" ") && !/^[,.;:!?)]/.test(str)) {
        line += " ";
      }
      line += str;
    }

    if (line.trim()) lines.push(line.trimEnd());

    return lines.join("\n");
  } catch (error) {
    console.error('Error extracting text from page:', error);
    throw error;
  }
};

export const extractTextFromPDF = async (
  pdf: PDFDocumentProxy,
  startPage: number = 1,
  endPage?: number
): Promise<string> => {
  const numPages = endPage || pdf.numPages;
  const texts: string[] = [];

  for (let i = startPage; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await extractTextFromPage(page);
    texts.push(text);
  }

  return texts.join('\n\n');
};
