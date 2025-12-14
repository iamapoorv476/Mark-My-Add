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
  const { user } = useAuthStore()
   const [mounted, setMounted] = useState(false)
   useEffect(() => {
    setMounted(true)
  }, [])


   useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication
  useEffect(() => {
    if (mounted && !user) {
      router.push("/login")
    }
  }, [mounted, user, router])

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

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
