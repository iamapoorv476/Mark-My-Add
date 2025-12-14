"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCustomizerStore } from "@/lib/store"
import { Sparkles, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AISuggestions() {
  const { selectedProduct, updateCustomization } = useCustomizerStore()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<any>(null)
  const [showDialog, setShowDialog] = useState(false)

  const handleGetSuggestions = async () => {
    if (!prompt.trim() || !selectedProduct) return

    setLoading(true)
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, productId: selectedProduct }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get suggestions")
      }

      const data = await response.json()
      setSuggestion(data)
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Failed to get AI suggestions:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate suggestions. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    if (!suggestion) return

    // Apply all suggested customizations
    Object.entries(suggestion).forEach(([part, config]) => {
      if (part !== "explanation" && part !== "text") {
        updateCustomization(part, config)
      }
    })

    // Apply text if present
    if (suggestion.text) {
      updateCustomization("text", suggestion.text)
    }

    setShowDialog(false)
    setPrompt("")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-accent" />
            AI Design Assistant
          </CardTitle>
          <CardDescription>Get AI-powered customization suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Describe your vision</Label>
            <Textarea
              id="ai-prompt"
              placeholder="e.g., 'Suggest a summer vibe with blue accents' or 'Make it sporty and energetic'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              disabled={!selectedProduct}
            />
          </div>
          <Button
            onClick={handleGetSuggestions}
            disabled={!prompt.trim() || loading || !selectedProduct}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Get Ideas
              </>
            )}
          </Button>
          {!selectedProduct && (
            <p className="text-xs text-muted-foreground text-center">Select a sneaker model first</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              AI Design Suggestion
            </DialogTitle>
            <DialogDescription>Review and apply the AI-generated customizations</DialogDescription>
          </DialogHeader>

          {suggestion && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">{suggestion.explanation}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Suggested Customizations:</h4>
                <div className="space-y-2">
                  {Object.entries(suggestion).map(([part, config]: [string, any]) => {
                    if (part === "explanation") return null

                    return (
                      <div key={part} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                        <span className="capitalize font-medium">{part}:</span>
                        <div className="flex items-center gap-2">
                          {part !== "text" && config.color && (
                            <div
                              className="size-5 rounded border-2 border-border"
                              style={{ backgroundColor: config.color }}
                            />
                          )}
                          <span className="text-muted-foreground">
                            {part === "text" ? `"${config}"` : `${config.material} (${config.color})`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplySuggestion}>Apply Suggestion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
