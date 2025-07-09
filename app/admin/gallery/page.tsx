"use client"

/**
 * Gallery Management Page
 * Admin interface for managing gallery items
 */
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { GalleryForm } from "@/components/admin/gallery-form"
import { AdminLayout } from "@/components/admin/layout"
import { createAuthenticatedFetch } from "@/lib/api-helpers"
import Image from "next/image"

interface GalleryItem {
  _id: string
  url: string
  alt: string
  title?: string
  description?: string
  category: string
  order: number
  isActive: boolean
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; itemId: string | null }>({
    open: false,
    itemId: null,
  })
  const { toast } = useToast()
  const authFetch = createAuthenticatedFetch()

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await authFetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async (itemData: Partial<GalleryItem>) => {
    try {
      const url = editingItem ? `/api/gallery/${editingItem._id}` : "/api/gallery"
      const method = editingItem ? "PUT" : "POST"

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Gallery item ${editingItem ? "updated" : "created"} successfully`,
        })
        fetchGalleryItems()
        setShowForm(false)
        setEditingItem(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save gallery item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async () => {
    if (!deleteDialog.itemId) return

    try {
      const response = await authFetch(`/api/gallery/${deleteDialog.itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Gallery item deleted successfully",
        })
        fetchGalleryItems()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      })
    } finally {
      setDeleteDialog({ open: false, itemId: null })
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = (itemId: string) => {
    setDeleteDialog({ open: true, itemId })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600">Manage photos and images for your website gallery</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={item.url || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {!item.isActive && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <EyeOff className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title || item.alt}</h3>
                {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Order: {item.order}</span>
                    {item.isActive ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {galleryItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No gallery items yet</h3>
              <p className="text-gray-600 mb-4">Add your first photo to get started</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Gallery Form Modal */}
        {showForm && (
          <GalleryForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setShowForm(false)
              setEditingItem(null)
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, itemId: null })}
          title="Delete Gallery Item"
          description="Are you sure you want to delete this gallery item? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteItem}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  )
}
