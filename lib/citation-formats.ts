// Citation formatting utilities

export interface CitationMetadata {
  title: string;
  authors: string[];
  publisher?: string;
  year?: string;
  edition?: string;
  isbn?: string;
  doi?: string;
  url?: string;
  accessDate?: string;
  pages?: string;
  volume?: string;
  issue?: string;
}

export const formatIEEE = (metadata: CitationMetadata): string => {
  const { title, authors, publisher, year } = metadata;
  const authorStr = authors.length > 0 ? authors.join(", ") : "Unknown";
  const publisherStr = publisher || "Self-published";
  const yearStr = year || "n.d.";

  return `${authorStr}, "${title}," ${publisherStr}, ${yearStr}.`;
};

export const formatAPA = (metadata: CitationMetadata): string => {
  const { title, authors, publisher, year } = metadata;
  
  // Format authors (Last, F. M.)
  const formatAuthor = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const initials = parts
      .slice(0, -1)
      .map((p) => p.charAt(0).toUpperCase() + ".")
      .join(" ");
    return `${lastName}, ${initials}`;
  };

  const authorStr = authors.length > 0 
    ? authors.map(formatAuthor).join(", ") 
    : "Unknown";
  const yearStr = year || "n.d.";
  const publisherStr = publisher || "Self-published";

  return `${authorStr} (${yearStr}). ${title}. ${publisherStr}.`;
};

export const formatMLA = (metadata: CitationMetadata): string => {
  const { title, authors, publisher, year } = metadata;
  
  // Format authors (Last, First)
  const formatAuthor = (name: string, isFirst: boolean) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(" ");
    return isFirst ? `${lastName}, ${firstName}` : `${firstName} ${lastName}`;
  };

  let authorStr = "Unknown";
  if (authors.length > 0) {
    if (authors.length === 1) {
      authorStr = formatAuthor(authors[0], true);
    } else if (authors.length === 2) {
      authorStr = `${formatAuthor(authors[0], true)}, and ${formatAuthor(authors[1], false)}`;
    } else {
      authorStr = `${formatAuthor(authors[0], true)}, et al.`;
    }
  }

  const publisherStr = publisher || "Self-published";
  const yearStr = year || "n.d.";

  return `${authorStr}. ${title}. ${publisherStr}, ${yearStr}.`;
};

export const formatChicago = (metadata: CitationMetadata): string => {
  const { title, authors, publisher, year } = metadata;
  
  // Format authors (Last, First)
  const formatAuthor = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(" ");
    return `${lastName}, ${firstName}`;
  };

  const authorStr = authors.length > 0 
    ? authors.map(formatAuthor).join(", ") 
    : "Unknown";
  const yearStr = year || "n.d.";
  const publisherStr = publisher || "Self-published";

  return `${authorStr}. ${title}. ${publisherStr}, ${yearStr}.`;
};

export const formatHarvard = (metadata: CitationMetadata): string => {
  const { title, authors, publisher, year } = metadata;
  
  const authorStr = authors.length > 0 ? authors.join(", ") : "Unknown";
  const yearStr = year || "n.d.";
  const publisherStr = publisher || "Self-published";

  return `${authorStr} (${yearStr}) ${title}. ${publisherStr}.`;
};

export const formatVancouver = (metadata: CitationMetadata, citationNumber: number): string => {
  const { title, authors, publisher, year } = metadata;
  
  // Format authors (Last FM)
  const formatAuthor = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const initials = parts
      .slice(0, -1)
      .map((p) => p.charAt(0).toUpperCase())
      .join("");
    return `${lastName} ${initials}`;
  };

  const authorStr = authors.length > 0 
    ? authors.map(formatAuthor).join(", ") 
    : "Unknown";
  const yearStr = year || "n.d.";
  const publisherStr = publisher || "Self-published";

  return `${citationNumber}. ${authorStr}. ${title}. ${publisherStr}; ${yearStr}.`;
};

export const allCitationFormats = (metadata: CitationMetadata, citationNumber: number = 1) => ({
  ieee: formatIEEE(metadata),
  apa: formatAPA(metadata),
  mla: formatMLA(metadata),
  chicago: formatChicago(metadata),
  harvard: formatHarvard(metadata),
  vancouver: formatVancouver(metadata, citationNumber),
});
