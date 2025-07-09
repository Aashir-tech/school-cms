"use client"

/**
 * Testimonials Management Page
 * Admin interface for managing testimonials
 */
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, Eye, EyeOff, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { TestimonialForm } from "@/components/admin/testimonial-form"
import { AdminLayout } from "@/components/admin/layout"
import { createAuthenticatedFetch } from "@/lib/api-helpers"
import Image from "next/image"

interface Testimonial {
  _id: string
  name: string
  role?: string
  company?: string
  quote: string
  rating: number
  image?: string
  isActive: boolean
  isFeatured: boolean
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; testimonialId: string | null }>({
    open: false,
    testimonialId: null,
  })
  const { toast } = useToast()
  const authFetch = createAuthenticatedFetch()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await authFetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTestimonial = async (testimonialData: Partial<Testimonial>) => {
    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial._id}` : "/api/testimonials"
      const method = editingTestimonial ? "PUT" : "POST"

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(testimonialData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Testimonial ${editingTestimonial ? "updated" : "created"} successfully`,
        })
        fetchTestimonials()
        setShowForm(false)
        setEditingTestimonial(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save testimonial"
      })
    }
  }

  const handleDeleteTestimonial = async () => {
    if (!deleteDialog.testimonialId) return

    try {
      const response = await authFetch(`/api/testimonials/${deleteDialog.testimonialId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial"
      })
    } finally {
      setDeleteDialog({ open: false, testimonialId: null })
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setShowForm(true)
  }

  const handleDelete = (testimonialId: string) => {
    setDeleteDialog({ open: true, testimonialId })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
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
            <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
            <p className="text-gray-600">Manage customer testimonials and reviews</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{testimonial.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      {testimonial.role && (
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(testimonial)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-gray-600 ml-2">({testimonial.rating}/5)</span>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 italic mb-4 line-clamp-3">"{testimonial.quote}"</blockquote>

                {/* Status Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {testimonial.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        testimonial.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {testimonial.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {testimonial.isActive ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials yet</h3>
              <p className="text-gray-600 mb-4">Add your first testimonial to get started</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Testimonial Form Modal */}
        {showForm && (
          <TestimonialForm
            testimonial={editingTestimonial}
            onSave={handleSaveTestimonial}
            onCancel={() => {
              setShowForm(false)
              setEditingTestimonial(null)
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, testimonialId: null })}
          title="Delete Testimonial"
          description="Are you sure you want to delete this testimonial? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteTestimonial}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  )
}
