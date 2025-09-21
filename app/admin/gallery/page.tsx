"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { GalleryForm } from "@/components/admin/gallery-form"
import { AdminLayout } from "@/components/admin/layout"
import { createAuthenticatedFetch } from "@/lib/api-helpers"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

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
  const [authFetch, setAuthFetch] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; itemId: string | null }>({
    open: false,
    itemId: null,
  })
  const { toast } = useToast()

  useEffect(() => {
    setAuthFetch(() => createAuthenticatedFetch())
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gallery")
      if (!response.ok) throw new Error("Failed to fetch gallery items");
      const data = await response.json()
      setGalleryItems(data.data || [])
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch gallery items", variant: "destructive" })
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
      if (!response.ok) throw new Error("Failed to save gallery item");
      toast({ title: "Success", description: `Gallery item ${editingItem ? "updated" : "created"} successfully` })
      fetchGalleryItems()
      setShowForm(false)
      setEditingItem(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save gallery item", variant: "destructive" })
    }
  }

  const handleDeleteItem = async () => {
    if (!deleteDialog.itemId) return
    try {
      const response = await authFetch(`/api/gallery/${deleteDialog.itemId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete gallery item");
      toast({ title: "Success", description: "Gallery item deleted successfully" })
      fetchGalleryItems()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete gallery item", variant: "destructive" })
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
        <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-background">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="bg-background">
        <div className="relative z-10 bg-card/80 backdrop-blur-xl border-b border-border p-8 shadow-sm flex justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Gallery Management</h1>
            <p className="text-muted-foreground text-lg mt-1">Manage photos and images for your website gallery</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        </div>

        <div className="p-6">
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryItems.map((item, index) => (
                <Card key={item._id} className="overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="relative h-48">
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" onClick={() => handleEdit(item)} className="h-8 w-8 rounded-full">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(item._id)} className="h-8 w-8 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {!item.isActive && (
                      <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                        <EyeOff className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-foreground truncate">{item.title || item.alt}</h3>
                    {item.description && <p className="text-muted-foreground text-sm mb-2 truncate">{item.description}</p>}
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                      <Badge variant="outline">{item.category}</Badge>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>Order: {item.order}</span>
                        {item.isActive ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="animate-fade-in-up">
                <CardContent className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Gallery Items Yet</h3>
                  <p className="text-muted-foreground mb-6">Add your first photo to get started.</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Photo
                  </Button>
                </CardContent>
              </Card>
          )}
        </div>

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

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Gallery Item"
          description="Are you sure you want to delete this gallery item? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteItem}
          variant="destructive"
        />
      </div>
       <style jsx global>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
      `}</style>
    </AdminLayout>
  )
}
