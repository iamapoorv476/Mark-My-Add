"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { StudioHeader } from "@/components/studio-header"
import { ProductSelector } from "@/components/product-selector"
import { CustomizationPanel } from "@/components/customization-panel"
import { PreviewCanvas } from "@/components/preview-canvas"
import { AISuggestions } from "@/components/ai-suggestions"

export default function StudioPage() {
  const router = useRouter()
  const { user, token,hasHydrated } = useAuthStore()

   


   useEffect(() => {
    if (!hasHydrated) return
    if (!token || !user) router.replace("/")
  }, [hasHydrated, token, user, router])


  // Don't render until mounted (prevents hydration mismatch)
  if (!hasHydrated) return null


  return (
    <div className="min-h-screen bg-background">
      <StudioHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px_1fr_400px] gap-6">
          <div className="space-y-6">
            <ProductSelector />
            <AISuggestions />
          </div>
          <div className="space-y-6">
            <PreviewCanvas />
          </div>
          <div className="space-y-6">
            <CustomizationPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
