"use client"

import { useCustomizerStore } from "@/lib/store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomizationPanel() {
  const { selectedProduct, customizations, updateCustomization } = useCustomizerStore()

  const product = MOCK_PRODUCTS.find((p) => p.id === selectedProduct)

  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customization Options</CardTitle>
          <CardDescription>Select a sneaker model to start customizing</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize {product.name}</CardTitle>
        <CardDescription>Choose colors, materials, and add personal touches</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            {product.customizableParts.map((part) => (
              <div key={part} className="space-y-2">
                <Label className="capitalize">{part} Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {product.options.colors.map((color) => (
                    <button
                      key={color}
                      className="size-10 rounded-md border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: customizations[part]?.color === color ? "oklch(var(--primary))" : "transparent",
                      }}
                      onClick={() => updateCustomization(part, { color })}
                      aria-label={`${part} ${color}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            {product.customizableParts.map((part) => (
              <div key={part} className="space-y-2">
                <Label className="capitalize">{part} Material</Label>
                <Select
                  value={customizations[part]?.material || ""}
                  onValueChange={(value) => updateCustomization(part, { material: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.options.materials.map((material) => (
                      <SelectItem key={material} value={material} className="capitalize">
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Material info section */}
            <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-blue-900 mb-1">
                    About Materials
                  </h4>
                  <p className="text-xs text-blue-700 mb-2">
                    Material selections affect final product quality, durability, and comfort. 
                    Preview focuses on color visualization.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/60 backdrop-blur rounded p-2 border border-blue-100">
                      <div className="flex items-center gap-1 font-medium text-slate-700 mb-0.5">
                        <span>🧥</span>
                        <span>Leather</span>
                      </div>
                      <div className="text-slate-600">Premium & durable</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur rounded p-2 border border-blue-100">
                      <div className="flex items-center gap-1 font-medium text-slate-700 mb-0.5">
                        <span>🎨</span>
                        <span>Canvas</span>
                      </div>
                      <div className="text-slate-600">Breathable & casual</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur rounded p-2 border border-blue-100">
                      <div className="flex items-center gap-1 font-medium text-slate-700 mb-0.5">
                        <span>🕸️</span>
                        <span>Mesh</span>
                      </div>
                      <div className="text-slate-600">Ultra breathable</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur rounded p-2 border border-blue-100">
                      <div className="flex items-center gap-1 font-medium text-slate-700 mb-0.5">
                        <span>✨</span>
                        <span>Suede</span>
                      </div>
                      <div className="text-slate-600">Soft & premium</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-text">Custom Text</Label>
              <Input
                id="custom-text"
                placeholder="Add your custom text..."
                maxLength={20}
                // FIX: Cast to any to bypass the type error
                value={(customizations.text as any)?.value || ""}
                onChange={(e) => updateCustomization("text", { value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Maximum 20 characters</p>
            </div>

            
            {(customizations.text as any)?.value && (
              <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 mb-2 font-medium">Preview:</p>
                <div className="flex items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed border-slate-300">
                  <p 
                    className="text-2xl font-bold"
                    style={{ 
                      color: customizations.upper?.color || '#000',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* FIX: Cast to any here as well */}
                    {(customizations.text as any).value}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Text will appear on your sneaker in {customizations.upper?.color ? 'the selected upper color' : 'black'}
                </p>
              </div>
            )}

            {/* Text customization tips */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <div className="flex gap-2">
                <span className="text-lg">💡</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-900 mb-1">Customization Tips</p>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>• Keep it short and memorable</li>
                    <li>• Text color matches your upper color</li>
                    <li>• Avoid special characters for best results</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}