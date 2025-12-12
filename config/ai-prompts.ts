export const aiPrompts = {
  questionAnswering: (context: string, question: string, citationId: string) => `
You are a research assistant helping analyze academic documents. 
Use the following text excerpt to answer the question.
Always include an IEEE citation reference in your response using the format [${citationId}, p. X] where X is the page number.

Context:
${context}

Question: ${question}

Provide a clear, accurate answer with proper IEEE citations.
`,

  summarize: (text: string, citationId: string, detail: 'short' | 'detailed') => `
Summarize the following text ${detail === 'short' ? 'in 2-3 sentences' : 'in detail (1-2 paragraphs)'}.
Include IEEE citation references using the format [${citationId}, p. X] for key points.

Text:
${text}

Provide a ${detail} summary with proper citations.
`,

  paraphrase: (text: string, style: 'simpler' | 'academic' | 'shorter' | 'formal') => {
    const styleInstructions = {
      simpler: 'Paraphrase this text in simpler, easier-to-understand language while keeping the same meaning.',
      academic: 'Paraphrase this text in formal academic language with sophisticated vocabulary.',
      shorter: 'Paraphrase this text more concisely while preserving all key information.',
      formal: 'Paraphrase this text in formal, professional language suitable for academic writing.',
    };

    return `
${styleInstructions[style]}

Original text:
${text}

Provide only the paraphrased text without any explanations or meta-commentary.
`;
  },

  extractMetadata: (fileName: string, text: string) => `
Extract bibliographic metadata from this document. Look for:
- Title
- Author(s)
- Publisher
- Publication year
- Edition
- ISBN/DOI

File name: ${fileName}

First few pages text:
${text}

Respond in JSON format:
{
  "title": "...",
  "authors": ["..."],
  "publisher": "...",
  "year": "...",
  "edition": "...",
  "isbn": "..."
}
`,
};

export const citationFormats = {
  ieee: {
    book: (authors: string[], title: string, publisher: string, year: string, edition?: string) => {
      const authorStr = authors.length > 0 
        ? authors.slice(0, 3).join(', ') + (authors.length > 3 ? ', et al.' : '')
        : 'Unknown Author';
      const editionStr = edition ? `, ${edition} ed.` : '';
      return `${authorStr}, ${title}${editionStr}. ${publisher}, ${year}.`;
    },
    inText: (citationId: number, page?: number, chapter?: number, paragraph?: number) => {
      if (page) return `[${citationId}, p. ${page}]`;
      if (chapter) return `[${citationId}, Ch. ${chapter}]`;
      if (paragraph) return `[${citationId}, para. ${paragraph}]`;
      return `[${citationId}]`;
    },
  },
};
