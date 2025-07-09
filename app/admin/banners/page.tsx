"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { BannerForm } from "@/components/admin/banner-form"
import { AdminLayout } from "@/components/admin/layout"
import Image from "next/image"

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

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
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
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch banners",
      })
    } finally {
      setLoading(false)
    }
  }

  

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

      if (response.ok) {
        toast({
          title: "Success",
          description: `Banner ${editingBanner ? "updated" : "created"} successfully`,
        })
        fetchBanners()
        setShowForm(false)
        setEditingBanner(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banner",
      })
    }
  }

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

      if (response.ok) {
        toast({
          title: "Success",
          description: "Banner deleted successfully",
        })
        fetchBanners()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
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
            <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
            <p className="text-gray-600">Manage hero banners and sliders for your website</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <Card key={banner._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={banner.image || "/placeholder.svg"} alt={banner.heading} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(banner)}
                    className="cursor-pointer hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(banner._id)}
                    className="cursor-pointer bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Inactive</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{banner.heading}</h3>
                <p className="text-gray-600 text-sm mb-3">{banner.subheading}</p>
                {banner.buttonLabel && (
                  <div className="flex items-center text-sm text-blue-600">
                    <span>Button: {banner.buttonLabel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-gray-500">Order: {banner.order}</span>
                  <div className="flex items-center space-x-1">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        banner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {banners.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No banners yet</h3>
              <p className="text-gray-600 mb-4">Create your first banner to get started</p>
              <Button onClick={() => setShowForm(true)} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Banner Form Modal */}
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

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, bannerId: null })}
          title="Delete Banner"
          description="Are you sure you want to delete this banner? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteBanner}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  )
}
