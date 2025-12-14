"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useGalleryStore } from "@/lib/store"
import { StudioHeader } from "@/components/studio-header"
import { DesignCard } from "@/components/design-card"
import { GalleryFilters } from "@/components/gallery-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function GalleryPage() {
  const router = useRouter()
  const { user, token,hasHydrated } = useAuthStore()

  const designs = useGalleryStore((state) => state.designs)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Fix hydration - only render after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication after mount
 useEffect(() => {
  if (!hasHydrated) return
  if (!token || !user) {
    router.push("/")
  }
}, [hasHydrated, token, user])

  // Don't render until mounted (prevents hydration mismatch)
 if (!hasHydrated) return null


  // Show loading while checking auth
  if (!token || !user) {

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    )
  }

  // Filter designs for current user
  const userDesigns = designs.filter((d) => d.userId === user.id)

  // Get all unique tags
  const allTags = Array.from(new Set(userDesigns.flatMap((d) => d.tags)))

  // Filter designs based on search and tags
  const filteredDesigns = userDesigns.filter((design) => {
    const matchesSearch =
      searchTerm === "" ||
      design.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      design.productId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => design.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="min-h-screen bg-background">
      <StudioHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">My Designs</h1>
            <p className="text-muted-foreground">
              {filteredDesigns.length} {filteredDesigns.length === 1 ? "design" : "designs"}
            </p>
          </div>
          <Button onClick={() => router.push("/studio")}>
            <Plus className="size-4" />
            New Design
          </Button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div>
            <GalleryFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={allTags}
            />
          </div>

          <div>
            {filteredDesigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👟</div>
                <h2 className="text-2xl font-semibold mb-2">No designs yet</h2>
                <p className="text-muted-foreground mb-6">Start creating your custom sneakers in the studio</p>
                <Button onClick={() => router.push("/studio")}>
                  <Plus className="size-4" />
                  Create Your First Design
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDesigns.map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}