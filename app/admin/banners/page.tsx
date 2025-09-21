"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, GripVertical, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { BannerForm } from "@/components/admin/banner-form"
import { AdminLayout } from "@/components/admin/layout"
import Image from "next/image"

// Define the Banner interface for type safety
interface Banner {
  _id: string
  image: string
  heading: string
  subheading: string
  buttonLabel?: string
  buttonLink?: string
  order: number
  isActive: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; bannerId: string | null }>({
    open: false,
    bannerId: null,
  })
  const { toast } = useToast()

  // Fetch banners when the component mounts
  useEffect(() => {
    fetchBanners()
  }, [])

  // Function to fetch banners from the API
  const fetchBanners = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/banners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBanners(data.data || [])
      } else {
        throw new Error("Failed to fetch banners")
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast({
        title: "Error",
        description: "Could not fetch banners. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to save (create or update) a banner
  const handleSaveBanner = async (bannerData: Partial<Banner>) => {
    try {
      const token = localStorage.getItem("auth-token")
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : "/api/banners"
      const method = editingBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bannerData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save banner")
      }

      toast({
        title: "Success!",
        description: `Banner ${editingBanner ? "updated" : "created"} successfully.`,
      })
      fetchBanners() // Refresh the list
      setShowForm(false)
      setEditingBanner(null)
    } catch (error: any) {
      console.error("Error saving banner:", error)
      toast({
        title: "Error",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  // Function to delete a banner
  const handleDeleteBanner = async () => {
    if (!deleteDialog.bannerId) return

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/banners/${deleteDialog.bannerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete banner")
      }
      
      toast({
        title: "Success!",
        description: "Banner deleted successfully.",
      })
      fetchBanners() // Refresh the list
    } catch (error: any) {
      console.error("Error deleting banner:", error)
      toast({
        title: "Error",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialog({ open: false, bannerId: null })
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setShowForm(true)
  }

  const handleDelete = (bannerId: string) => {
    setDeleteDialog({ open: true, bannerId })
  }

  // Loading state
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
        {/* Page Header */}
        <div className="relative z-10 bg-card/80 backdrop-blur-xl border-b border-border p-8 shadow-sm flex justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Banner Management</h1>
            <p className="text-muted-foreground text-lg mt-1">
              Manage hero banners and sliders for your website.
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Banner
          </Button>
        </div>

        {/* Banners Grid or Empty State */}
        <div className="p-6">
          {banners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
              {banners.map((banner, index) => (
                <div
                  key={banner._id}
                  className="group relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="relative bg-card border-border rounded-2xl shadow-lg p-0 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl">
                    <div className="relative h-48 rounded-t-2xl overflow-hidden">
                      <Image
                        src={banner.image || "https://placehold.co/600x400/000000/FFFFFF?text=No+Image"}
                        alt={banner.heading}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/000000/FFFFFF?text=Error'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 flex space-x-2 z-10">
                        <Button size="icon" variant="secondary" onClick={() => handleEdit(banner)} className="rounded-full h-9 w-9">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(banner._id)} className="rounded-full h-9 w-9">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {!banner.isActive && (
                        <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                          <span className="text-foreground font-semibold text-lg px-4 py-2 bg-secondary rounded-lg border border-border">Inactive</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-bold text-xl text-foreground">{banner.heading}</h3>
                      <p className="text-muted-foreground text-base">{banner.subheading}</p>
                      {banner.buttonLabel && (
                        <div className="flex items-center text-sm text-primary">
                          <span>Button: {banner.buttonLabel}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">Order: {banner.order}</span>
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${banner.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {banner.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 animate-fade-in-up">
              <Card className="relative bg-card border-border rounded-2xl shadow-lg">
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <ImageIcon className="h-16 w-16 mx-auto text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No Banners Yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first dazzling banner to showcase your school.</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Banner
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {showForm && (
          <BannerForm
            banner={editingBanner}
            onSave={handleSaveBanner}
            onCancel={() => {
              setShowForm(false)
              setEditingBanner(null)
            }}
          />
        )}

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Banner"
          description="Are you sure you want to delete this banner? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteBanner}
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
