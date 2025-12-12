export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  citations?: AIMessageCitation[];
  bookId?: string;
  page?: number;
}

export interface AIMessageCitation {
  citationId: number;
  page?: number;
  chapter?: number;
  paragraph?: number;
  highlightedText?: string;
}

export interface ParaphraseRequest {
  text: string;
  style: ParaphraseStyle;
  contextBefore?: string;
  contextAfter?: string;
}

export type ParaphraseStyle = "simpler" | "academic" | "shorter" | "formal";

export interface ParaphraseResult {
  original: string;
  paraphrased: string;
  style: ParaphraseStyle;
  timestamp: number;
}

export interface SummaryRequest {
  text: string;
  detail: "short" | "detailed";
  citationId: number;
  page?: number;
}

export interface SummaryResult {
  summary: string;
  detail: "short" | "detailed";
  citations: AIMessageCitation[];
  timestamp: number;
}

export interface QuestionRequest {
  question: string;
  context: string;
  citationId: number;
  page?: number;
}

export interface AIResponse {
  content: string;
  citations: AIMessageCitation[];
  type: "answer" | "summary" | "paraphrase";
  timestamp: number;
}
