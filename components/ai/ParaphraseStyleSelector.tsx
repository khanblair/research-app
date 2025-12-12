"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ParaphraseStyle = "simpler" | "academic" | "shorter" | "formal";

interface ParaphraseStyleSelectorProps {
  value: ParaphraseStyle;
  onChange: (style: ParaphraseStyle) => void;
}

const styles = [
  {
    value: "simpler" as ParaphraseStyle,
    label: "Simpler",
    description: "Use easier words and shorter sentences",
  },
  {
    value: "academic" as ParaphraseStyle,
    label: "Academic",
    description: "More scholarly and technical language",
  },
  {
    value: "shorter" as ParaphraseStyle,
    label: "Shorter",
    description: "Condense while keeping key points",
  },
  {
    value: "formal" as ParaphraseStyle,
    label: "Formal",
    description: "Professional and polished tone",
  },
];

export function ParaphraseStyleSelector({
  value,
  onChange,
}: ParaphraseStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Paraphrase Style</Label>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as ParaphraseStyle)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {styles.map((style) => (
            <div key={style.value} className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value={style.value} id={style.value} />
              <Label
                htmlFor={style.value}
                className="flex-1 cursor-pointer space-y-1 font-normal"
              >
                <div className="font-medium">{style.label}</div>
                <div className="text-xs text-muted-foreground">
                  {style.description}
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
