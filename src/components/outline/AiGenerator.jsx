import React, { useState } from "react";
import { InvokeLLM } from "@/api/integrations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2 } from "lucide-react";

export default function AiGenerator({ onGenerate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [articleText, setArticleText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!articleText.trim()) return;
    setIsLoading(true);
    
    const prompt = `
      Based on the following article, create a presentation outline.
      The output must be a JSON object containing a "sections" key. This key should hold an array of objects.
      Each object in the array represents a section of the presentation and must have:
      1. A "title" (string): A concise and engaging title for the section.
      2. A "content" (string): A few key bullet points summarizing the main ideas of that section. Start each bullet point with a hyphen and a space (- ).

      Here is the article:
      ---
      ${articleText}
      ---
    `;

    const responseSchema = {
      type: "object",
      properties: {
        sections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" }
            },
            required: ["title", "content"]
          }
        }
      },
      required: ["sections"]
    };

    try {
      const result = await InvokeLLM({
        prompt: prompt,
        response_json_schema: responseSchema
      });
      
      if (result && result.sections) {
        const formattedSections = result.sections.map(section => ({
          ...section,
          duration: 5,
          completed: false
        }));
        onGenerate(formattedSections);
        setIsOpen(false);
        setArticleText("");
      }
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
          <Wand2 className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Outline from Text</DialogTitle>
          <DialogDescription>
            Paste your article or notes below. The AI will summarize it and create structured outline sections for you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Paste your article content here..."
            className="h-64 resize-y"
            value={articleText}
            onChange={(e) => setArticleText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !articleText.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Outline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}