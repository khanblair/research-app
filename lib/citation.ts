import { CitationMetadata, CitationReference } from "@/types";

export const formatIEEECitation = (metadata: CitationMetadata): string => {
  const {
    authors = [],
    title = "Untitled",
    publisher = "Unknown Publisher",
    year = "n.d.",
    edition,
  } = metadata;

  // Format authors (IEEE style: First three authors, then et al.)
  let authorStr = "";
  if (authors.length === 0) {
    authorStr = "Unknown Author";
  } else if (authors.length <= 3) {
    authorStr = authors.join(", ");
  } else {
    authorStr = authors.slice(0, 3).join(", ") + ", et al.";
  }

  // Format edition
  const editionStr = edition ? `, ${edition} ed.` : "";

  // Build full citation
  return `${authorStr}, ${title}${editionStr}. ${publisher}, ${year}.`;
};

export const formatInTextCitation = (
  citationNumber: number,
  reference?: CitationReference
): string => {
  if (!reference) {
    return `[${citationNumber}]`;
  }

  if (reference.page) {
    return `[${citationNumber}, p. ${reference.page}]`;
  }

  if (reference.chapter) {
    return `[${citationNumber}, Ch. ${reference.chapter}]`;
  }

  if (reference.paragraph) {
    return `[${citationNumber}, para. ${reference.paragraph}]`;
  }

  return `[${citationNumber}]`;
};

export const extractCitationsFromText = (text: string): CitationReference[] => {
  const citationRegex = /\[(\d+)(?:,\s*(?:p\.\s*(\d+)|Ch\.\s*(\d+)|para\.\s*(\d+)))?\]/g;
  const citations: CitationReference[] = [];
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    const [, citationId, page, chapter, paragraph] = match;
    
    citations.push({
      citationId: parseInt(citationId),
      page: page ? parseInt(page) : undefined,
      chapter: chapter ? parseInt(chapter) : undefined,
      paragraph: paragraph ? parseInt(paragraph) : undefined,
      type: page ? "page" : chapter ? "chapter" : paragraph ? "paragraph" : "general",
    });
  }

  return citations;
};

export const generateCitationNumber = (existingCitations: number[]): number => {
  if (existingCitations.length === 0) return 1;
  return Math.max(...existingCitations) + 1;
};
