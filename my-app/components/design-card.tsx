"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar } from "lucide-react"
import type { Design } from "@/lib/types"
import { useGalleryStore, useCustomizerStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DesignCardProps {
  design: Design
}

export function DesignCard({ design }: DesignCardProps) {
  const router = useRouter()

  const { deleteDesign, startEditing } = useGalleryStore()
  const { setSelectedProduct, updateCustomization} = useCustomizerStore()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

 

const handleEdit = () => {
  startEditing(design.id)
  setSelectedProduct(design.productId)

  Object.entries(design.customizations).forEach(([part, config]) => {
    updateCustomization(part, config)
  })

  router.push("/studio")
}

  const handleDelete = () => {
    deleteDesign(design.id)
    setShowDeleteDialog(false)
  }

  const formattedDate = new Date(design.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            <Image
              src={design.previewImage || "/placeholder.svg"}
              alt="Design preview"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                <Edit className="size-4" />
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-3 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
            <Calendar className="size-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {design.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            {Object.keys(design.customizations).length} customizations
          </div>
        </CardFooter>
      </Card>

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Design</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this design? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
