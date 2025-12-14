"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCustomizerStore } from "@/lib/store"
import { Sparkles, Loader2, Lightbulb } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)

  const handleGetSuggestions = async () => {
    if (!prompt.trim() || !selectedProduct) return

    setLoading(true)
    setError(null)
    
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
      console.error("Failed to get AI suggestions:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate suggestions. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    if (!suggestion) return

    // Apply all suggested customizations
    Object.entries(suggestion).forEach(([part, config]) => {
      if (part === "explanation" || part === "text") {
        return // Skip explanation and handle text separately
      }

      // Apply part customization (sole, upper, laces, swoosh)
      if (typeof config === "object" && config !== null && "color" in config) {
        updateCustomization(part, config)
      }
    })

    // Apply text if present (handle both string and object formats)
    if (suggestion.text) {
      if (typeof suggestion.text === "string") {
        updateCustomization("text", { value: suggestion.text })
      } else {
        updateCustomization("text", suggestion.text)
      }
    }

    setShowDialog(false)
    setSuggestion(null)
    setPrompt("")
    setError(null)
  }

  const examplePrompts = [
    "Summer vibes with blue accents",
    "Sporty and energetic red theme",
    "Professional minimal black and white",
    "Vibrant rainbow colors"
  ]

  const handleExampleClick = (example: string) => {
    setPrompt(example)
    setError(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-purple-500" />
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
              onChange={(e) => {
                setPrompt(e.target.value)
                setError(null)
              }}
              rows={3}
              disabled={!selectedProduct || loading}
            />
          </div>

          {/* Example prompts */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick examples:</Label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  disabled={!selectedProduct || loading}
                  className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
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
                Get AI Ideas
              </>
            )}
          </Button>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Help text */}
          {!selectedProduct && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Lightbulb className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                Select a sneaker model first to get AI suggestions
              </p>
            </div>
          )}

          {/* Pro tip */}
          <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium text-blue-900 mb-1">💡 Tips for better suggestions:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Describe the mood or vibe you want</li>
              <li>• Mention specific colors or themes</li>
              <li>• Reference seasons, sports, or styles</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-purple-500" />
              AI Design Suggestion
            </DialogTitle>
            <DialogDescription>Review and apply the AI-generated customizations</DialogDescription>
          </DialogHeader>

          {suggestion && (
            <div className="space-y-4">
              {/* Explanation */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="text-sm leading-relaxed text-gray-700">{suggestion.explanation}</p>
              </div>

              {/* Customizations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Suggested Customizations:</h4>
                <div className="space-y-2">
                  {Object.entries(suggestion).map(([part, config]: [string, any]) => {
                    if (part === "explanation") return null

                    // Handle text separately
                    if (part === "text") {
                      const textValue = typeof config === "string" ? config : config?.value || ""
                      if (!textValue) return null
                      
                      return (
                        <div key={part} className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg border">
                          <span className="capitalize font-medium">Custom Text:</span>
                          <span className="text-muted-foreground font-mono">"{textValue}"</span>
                        </div>
                      )
                    }

                    // Handle part customizations
                    if (typeof config === "object" && config !== null) {
                      return (
                        <div key={part} className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg border">
                          <span className="capitalize font-medium">{part}:</span>
                          <div className="flex items-center gap-3">
                            {config.color && (
                              <div
                                className="size-6 rounded-md border-2 border-white shadow-sm ring-1 ring-gray-200"
                                style={{ backgroundColor: config.color }}
                                title={config.color}
                              />
                            )}
                            <div className="text-right">
                              <div className="text-muted-foreground text-xs">{config.color}</div>
                              <div className="text-muted-foreground/70 text-xs capitalize">{config.material}</div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDialog(false)
              setSuggestion(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleApplySuggestion} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="size-4" />
              Apply Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}