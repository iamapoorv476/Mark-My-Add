"use client"

import { useState, useRef, MouseEvent } from "react"
import { useCustomizerStore, useGalleryStore, useAuthStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Save, ZoomIn, ZoomOut, Palette, RotateCcw, Move } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function PreviewCanvas() {
  const router = useRouter()
  const { selectedProduct, customizations } = useCustomizerStore()
  const { addDesign } = useGalleryStore()
  const { user } = useAuthStore()
  
  // Zoom and Pan state
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const product = MOCK_PRODUCTS.find((p) => p.id === selectedProduct)

  const handleSave = () => {
    if (!product || !user) return

    const design = {
      id: `design-${Date.now()}`,
      userId: user.id,
      productId: product.id,
      customizations,
      previewImage: product.baseImage,
      tags: [product.name.toLowerCase().replace(/\s+/g, "-")],
      created_at: new Date().toISOString(),
    }

    addDesign(design)
    router.push("/gallery")
  }

  const handleDownload = () => {
    alert("High-resolution export feature coming soon!")
  }

  // Pan/Drag handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoom <= 100) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    })
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleReset = () => {
    setZoom(100)
    setPan({ x: 0, y: 0 })
  }

  if (!product) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">Select a sneaker model to see the preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleReset}
            title="Reset View"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={containerRef}
          className={`relative aspect-[4/3] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 ${
            zoom > 100 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            style={{ 
              transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease',
            }}
          >
            <div className="relative w-[400px] h-[300px]">
              {/* Main sneaker image with slight desaturation */}
              <Image 
                src={product.baseImage || "/placeholder.svg"} 
                alt={product.name} 
                fill 
                className="object-contain opacity-90 select-none"
                draggable={false}
              />

              {/* Improved color overlays with radial gradients */}
              {customizations.laces?.color && (
                <div
                  className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                  style={{
                    left: "38%",
                    top: "12%",
                    width: "24%",
                    height: "35%",
                    background: `radial-gradient(ellipse 70% 90% at 50% 50%, ${customizations.laces.color}70 0%, ${customizations.laces.color}30 40%, transparent 70%)`,
                    mixBlendMode: "color",
                    opacity: 0.5,
                  }}
                />
              )}

              {customizations.upper?.color && (
                <div
                  className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                  style={{
                    left: "10%",
                    top: "25%",
                    width: "80%",
                    height: "50%",
                    background: `radial-gradient(ellipse 100% 100% at 40% 50%, ${customizations.upper.color}60 0%, ${customizations.upper.color}25 50%, transparent 80%)`,
                    mixBlendMode: "color",
                    opacity: 0.4,
                  }}
                />
              )}

              {customizations.swoosh?.color && (
                <div
                  className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                  style={{
                    left: "40%",
                    top: "35%",
                    width: "40%",
                    height: "25%",
                    background: `radial-gradient(ellipse 90% 100% at 50% 50%, ${customizations.swoosh.color}80 0%, ${customizations.swoosh.color}40 40%, transparent 70%)`,
                    mixBlendMode: "color",
                    opacity: 0.6,
                  }}
                />
              )}

              {customizations.sole?.color && (
                <div
                  className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                  style={{
                    left: "10%",
                    bottom: "2%",
                    width: "80%",
                    height: "20%",
                    background: `linear-gradient(to top, ${customizations.sole.color}70 0%, ${customizations.sole.color}40 30%, transparent 70%)`,
                    mixBlendMode: "color",
                    opacity: 0.5,
                  }}
                />
              )}

              {/* Enhanced color indicators - floating on top left */}
              {Object.entries(customizations).some(([part, config]) => part !== "text" && config?.color) && (
                <div className="absolute top-3 left-3 backdrop-blur-xl bg-white/80 rounded-xl p-3 shadow-2xl border border-white/50 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="size-3 text-slate-600" />
                    <span className="text-xs font-semibold text-slate-700">Selected Colors</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(customizations).map(([part, config]) => {
                      if (part === "text" || !config?.color) return null
                      return (
                        <div key={part} className="flex items-center gap-1.5">
                          <div
                            className="size-4 rounded-md border-2 border-white shadow-sm ring-1 ring-slate-200"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="text-xs capitalize text-slate-600">{part}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Custom Text Overlay - moved to top right */}
              {customizations.text && (typeof customizations.text === "string" ? customizations.text : customizations.text.value) && (
                <div 
                  className="absolute top-3 right-3 text-lg font-bold px-3 py-1.5 rounded-lg transition-all duration-300 shadow-lg pointer-events-none"
                  style={{
                    color: customizations.upper?.color || "#000",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255,255,255,0.5)",
                  }}
                >
                  {typeof customizations.text === "string" ? customizations.text : customizations.text.value || ""}
                </div>
              )}

              {/* Preview note badge */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 backdrop-blur-md bg-amber-500/90 text-amber-950 px-4 py-1.5 rounded-full text-xs font-medium shadow-lg border border-amber-400/50 pointer-events-none">
                🎨 Preview - Colors applied with AI blend mode
              </div>
            </div>
          </div>

          {/* Pan instruction overlay */}
          {zoom > 100 && !isDragging && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 pointer-events-none animate-pulse">
              <Move className="size-4" />
              Drag to pan
            </div>
          )}
        </div>

        {/* Zoom level indicator */}
        {zoom !== 100 && (
          <div className="text-center">
            <span className="text-xs text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
              Zoom: {zoom}%
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="size-4" />
            Save Design
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex-1 bg-transparent">
            <Download className="size-4" />
            Export
          </Button>
        </div>

        {/* Detailed customization summary */}
        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
          <p className="font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="size-2 bg-blue-500 rounded-full"></span>
            Current Configuration
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(customizations).map(([part, config]) => {
              if (part === "text") {
                const textValue = typeof config === "string" ? config : config?.value || ""
                return textValue ? (
                  <div key={part} className="flex items-start gap-2">
                    <div className="text-xs">
                      <div className="font-medium capitalize text-slate-700">Text</div>
                      <div className="text-slate-500">"{textValue}"</div>
                    </div>
                  </div>
                ) : null
              }
              return config?.color ? (
                <div key={part} className="flex items-start gap-2">
                  <div
                    className="size-6 rounded-md border-2 border-white shadow-sm mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="text-xs">
                    <div className="font-medium capitalize text-slate-700">{part}</div>
                    <div className="text-slate-500">
                      {config.color} • {config.material || "N/A"}
                    </div>
                  </div>
                </div>
              ) : null
            })}
          </div>
        </div>

        {/* Pro tip */}
        <div className="text-xs text-slate-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
          💡 <span className="font-medium text-blue-700">Pro Tip:</span> Zoom in and drag to inspect details. 
          The preview uses advanced color blending to show your customizations.
        </div>
      </CardContent>
    </Card>
  )
}