"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  availableTags: string[]
}

export function GalleryFilters({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
}: GalleryFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Designs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Filter by Tags</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && <X className="ml-1 size-3" />}
              </Badge>
            ))}
          </div>
        </div>

        {(searchTerm || selectedTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("")
              selectedTags.forEach(onTagToggle)
            }}
            className="w-full"
          >
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
