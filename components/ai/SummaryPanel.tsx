"use client";

import { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AILoading } from "./AILoading";
import { chatWithAI } from "@/lib/puter";
import { aiPrompts } from "@/config/ai-prompts";

type SummaryLength = "short" | "detailed";

export function SummaryPanel() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [length, setLength] = useState<SummaryLength>("short");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const prompt = aiPrompts.summarize(input, "[1]", length);

      const response = await chatWithAI([
        { role: "user", content: prompt },
      ]);

      setOutput((response.text as string) || "Failed to summarize text.");
    } catch (error) {
      console.error("Summary error:", error);
      setOutput("Error: Could not summarize text. Please try again.");
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
        <h3 className="mb-2 font-semibold">Text to Summarize</h3>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the text you want to summarize..."
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Summary Length</Label>
        <RadioGroup value={length} onValueChange={(v) => setLength(v as SummaryLength)}>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="short" />
              <Label htmlFor="short" className="cursor-pointer font-normal">
                Short (2-3 sentences)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed" className="cursor-pointer font-normal">
                Detailed (1-2 paragraphs)
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={handleSummarize}
        disabled={!input.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <AILoading />
            <span className="ml-2">Summarizing...</span>
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Generate Summary
          </>
        )}
      </Button>

      {output && (
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Summary</h3>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
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
