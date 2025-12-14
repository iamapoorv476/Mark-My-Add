"use client"

import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { useCustomizerStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

export function ProductSelector() {
  const { selectedProduct, setSelectedProduct } = useCustomizerStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Base Model</CardTitle>
        <CardDescription>Choose a sneaker to start customizing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {MOCK_PRODUCTS.map((product) => (
          <Button
            key={product.id}
            variant={selectedProduct === product.id ? "default" : "outline"}
            className="w-full justify-start h-auto p-4"
            onClick={() => setSelectedProduct(product.id)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative size-16 rounded-md overflow-hidden bg-muted shrink-0">
                <Image src={product.baseImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {product.customizableParts.length} customizable parts
                </div>
              </div>
              {selectedProduct === product.id && <Check className="size-5 shrink-0" />}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
