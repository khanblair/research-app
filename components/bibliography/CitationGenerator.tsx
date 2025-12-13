"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useConvexUser } from "@/hooks/use-convex-user";
import type { Id } from "@/convex/_generated/dataModel";

interface CitationData {
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  edition?: string;
  isbn?: string;
  pages?: string;
  doi?: string;
  url?: string;
}

export function CitationGenerator({ bookId }: { bookId: Id<"books"> }) {
  const { user: convexUser } = useConvexUser();

  const [formData, setFormData] = useState<CitationData>({
    authors: "",
    title: "",
    year: "",
    publisher: "",
    edition: "",
    isbn: "",
    pages: "",
    doi: "",
    url: "",
  });

  const createCitation = useMutation(api.bibliography.create);

  const handleChange = (field: keyof CitationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!convexUser) {
      toast.error("Loading your profile… please try again in a moment");
      return;
    }

    if (!formData.authors || !formData.title || !formData.year) {
      toast.error("Please fill in required fields: Authors, Title, and Year");
      return;
    }

    try {
      // Format the citation first  
      const citationMetadata = {
        title: formData.title,
        authors: formData.authors.split(",").map((a) => a.trim()),
        publisher: formData.publisher || undefined,
        year: formData.year || undefined,
        edition: formData.edition || undefined,
        isbn: formData.isbn || undefined,
        pages: formData.pages || undefined,
        doi: formData.doi || undefined,
        url: formData.url || undefined,
      };

      // Create a simple formatted citation
      const formattedCitation = `${citationMetadata.authors.join(", ")}, "${citationMetadata.title}", ${citationMetadata.publisher || "Unknown Publisher"}, ${citationMetadata.year || "n.d."}.`;

      await createCitation({
        userId: convexUser._id,
        bookId,
        formattedCitation,
        metadata: citationMetadata,
      });

      toast.success("Citation added successfully!");
      
      // Reset form
      setFormData({
        authors: "",
        title: "",
        year: "",
        publisher: "",
        pages: "",
        doi: "",
        url: "",
      });
    } catch (error) {
      console.error("Error creating citation:", error);
      toast.error("Failed to add citation");
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Add New Citation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="authors">
              Authors <span className="text-destructive">*</span>
            </Label>
            <Input
              id="authors"
              value={formData.authors}
              onChange={(e) => handleChange("authors", e.target.value)}
              placeholder="Smith, J., Doe, A."
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple authors with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">
              Year <span className="text-destructive">*</span>
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              placeholder="2024"
              min="1900"
              max="2100"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Research Methods in Computer Science"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) => handleChange("publisher", e.target.value)}
              placeholder="Academic Press"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">Pages</Label>
            <Input
              id="pages"
              value={formData.pages}
              onChange={(e) => handleChange("pages", e.target.value)}
              placeholder="45-67"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="doi">DOI</Label>
            <Input
              id="doi"
              value={formData.doi}
              onChange={(e) => handleChange("doi", e.target.value)}
              placeholder="10.1000/xyz123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Citation
        </Button>
      </form>
    </Card>
  );
}
