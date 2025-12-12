"use client";

import { useState } from "react";
import { Wand2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ParaphraseStyleSelector } from "./ParaphraseStyleSelector";
import { AILoading } from "./AILoading";
import { chatWithAI } from "@/lib/puter";
import { aiPrompts } from "@/config/ai-prompts";

type ParaphraseStyle = "simpler" | "academic" | "shorter" | "formal";

export function ParaphrasePanel() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [style, setStyle] = useState<ParaphraseStyle>("simpler");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleParaphrase = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const prompt = aiPrompts.paraphrase(input, style);
      
      const response = await chatWithAI([
        { role: "user", content: prompt },
      ]);

      setOutput((response.text as string) || "Failed to paraphrase text.");
    } catch (error) {
      console.error("Paraphrase error:", error);
      setOutput("Error: Could not paraphrase text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-semibold">Original Text</h3>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the text you want to paraphrase..."
          className="min-h-[120px]"
        />
      </div>

      <ParaphraseStyleSelector value={style} onChange={setStyle} />

      <Button
        onClick={handleParaphrase}
        disabled={!input.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <AILoading />
            <span className="ml-2">Paraphrasing...</span>
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Paraphrase Text
          </>
        )}
      </Button>

      {output && (
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Paraphrased Text</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {output}
          </p>
        </Card>
      )}
    </div>
  );
}
