import { Book, Note, Highlight, Citation } from "@/types";

interface ExportData {
  books: Book[];
  notes: Note[];
  highlights: Highlight[];
  citations: Citation[];
}

export const exportToMarkdown = (data: ExportData): string => {
  let markdown = "# Research Notes Export\n\n";
  markdown += `*Exported on ${new Date().toLocaleDateString()}*\n\n`;
  markdown += "---\n\n";

  // Bibliography section
  if (data.citations.length > 0) {
    markdown += "## Bibliography\n\n";
    data.citations
      .sort((a, b) => a.citationNumber - b.citationNumber)
      .forEach((citation) => {
        markdown += `[${citation.citationNumber}] ${citation.formattedCitation}\n\n`;
      });
    markdown += "---\n\n";
  }

  // Books and their notes
  data.books.forEach((book) => {
    markdown += `## ${book.title}\n\n`;
    markdown += `**Authors:** ${book.authors.join(", ")}\n`;
    if (book.publisher) markdown += `**Publisher:** ${book.publisher}\n`;
    if (book.year) markdown += `**Year:** ${book.year}\n`;
    markdown += "\n";

    // Notes for this book
    const bookNotes = data.notes.filter((note) => note.bookId === book._id);
    if (bookNotes.length > 0) {
      markdown += "### Notes\n\n";
      bookNotes.forEach((note) => {
        const pageRef = note.page ? ` (Page ${note.page})` : "";
        markdown += `#### Note${pageRef}\n\n`;
        if (note.selectedText) {
          markdown += `> ${note.selectedText}\n\n`;
        }
        markdown += `${note.content}\n\n`;
        if (note.tags.length > 0) {
          markdown += `*Tags: ${note.tags.join(", ")}*\n\n`;
        }
      });
    }

    // Highlights for this book
    const bookHighlights = data.highlights.filter((h) => h.bookId === book._id);
    if (bookHighlights.length > 0) {
      markdown += "### Highlights\n\n";
      bookHighlights.forEach((highlight) => {
        markdown += `- **Page ${highlight.page}:** ${highlight.selectedText}\n`;
        if (highlight.note) {
          markdown += `  *Note: ${highlight.note}*\n`;
        }
      });
      markdown += "\n";
    }

    markdown += "---\n\n";
  });

  return markdown;
};

export const exportToPlainText = (data: ExportData): string => {
  let text = "RESEARCH NOTES EXPORT\n";
  text += `Exported on ${new Date().toLocaleDateString()}\n`;
  text += "=".repeat(60) + "\n\n";

  // Bibliography
  if (data.citations.length > 0) {
    text += "BIBLIOGRAPHY\n";
    text += "-".repeat(60) + "\n\n";
    data.citations
      .sort((a, b) => a.citationNumber - b.citationNumber)
      .forEach((citation) => {
        text += `[${citation.citationNumber}] ${citation.formattedCitation}\n\n`;
      });
    text += "\n";
  }

  // Books and notes
  data.books.forEach((book) => {
    text += `${book.title.toUpperCase()}\n`;
    text += `Authors: ${book.authors.join(", ")}\n`;
    if (book.publisher) text += `Publisher: ${book.publisher}\n`;
    if (book.year) text += `Year: ${book.year}\n`;
    text += "-".repeat(60) + "\n\n";

    const bookNotes = data.notes.filter((note) => note.bookId === book._id);
    bookNotes.forEach((note, index) => {
      const pageRef = note.page ? ` (Page ${note.page})` : "";
      text += `Note ${index + 1}${pageRef}\n`;
      if (note.selectedText) {
        text += `Quote: "${note.selectedText}"\n`;
      }
      text += `${note.content}\n`;
      if (note.tags.length > 0) {
        text += `Tags: ${note.tags.join(", ")}\n`;
      }
      text += "\n";
    });

    text += "\n";
  });

  return text;
};

export const downloadAsFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
