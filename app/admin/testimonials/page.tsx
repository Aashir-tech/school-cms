"use client"

/**
 * Testimonials Management Page
 * Admin interface for managing testimonials with a premium and aesthetic look
 */
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, Eye, EyeOff, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { TestimonialForm } from "@/components/admin/testimonial-form"
import { AdminLayout } from "@/components/admin/layout"
import { createAuthenticatedFetch } from "@/lib/api-helpers" // Assuming this helper exists
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
  const [authFetch, setAuthFetch] = useState<any | null>(null) // State to hold the authenticated fetch function

  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; testimonialId: string | null }>({
    open: false,
    testimonialId: null,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Initialize authFetch when component mounts
    setAuthFetch(() => createAuthenticatedFetch())
    fetchTestimonials()
  }, []) // Empty dependency array means this runs once on mount

  const fetchTestimonials = async () => {
    setLoading(true); // Set loading true before fetching
    try {
      const response = await fetch("/api/testimonials") // Assuming createAuthenticatedFetch handles token internally
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.data || [])
      } else {
        throw new Error("Failed to fetch testimonials");
      }
    } catch (error: any) {
      console.error("Error fetching testimonials:", error)
      toast({
        title: "Error",
        description: `Failed to fetch testimonials: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTestimonial = async (testimonialData: Partial<Testimonial>) => {
    try {
      if (!authFetch) { // Ensure authFetch is initialized
        toast({ title: "Error", description: "Authentication service not ready.", variant: "destructive" });
        return;
      }
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
        fetchTestimonials() // Re-fetch to update list
        setShowForm(false)
        setEditingTestimonial(null)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save");
      }
    } catch (error: any) {
      console.error("Error saving testimonial:", error)
      toast({
        title: "Error",
        description: `Failed to save testimonial: ${error.message || "Unknown error"}`,
        variant: "destructive"
      })
    }
  }

  const handleDeleteTestimonial = async () => {
    if (!deleteDialog.testimonialId) return

    try {
      if (!authFetch) { // Ensure authFetch is initialized
        toast({ title: "Error", description: "Authentication service not ready.", variant: "destructive" });
        return;
      }
      const response = await authFetch(`/api/testimonials/${deleteDialog.testimonialId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        })
        fetchTestimonials() // Re-fetch to update list
      } else {
        throw new Error("Failed to delete testimonial");
      }
    } catch (error: any) {
      console.error("Error deleting testimonial:", error)
      toast({
        title: "Error",
        description: `Failed to delete testimonial: ${error.message || "Unknown error"}`,
        variant: "destructive"
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
      <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-slate-600"}`} />
    ))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Spinner size="large" className="text-blue-400" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Floating particles background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -inset-10 opacity-50">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Page Header */}
          <div className="relative z-10 bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex justify-between items-center animate-fade-in-down">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Testimonials Management
              </h1>
              <p className="text-slate-300 text-lg mt-1">
                Manage customer testimonials and reviews for your website.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Testimonial
            </Button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-700"></div>
                
                {/* Card */}
                <Card className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-0"> {/* Removed default padding */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {testimonial.image ? (
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={testimonial.image || "https://placehold.co/48x48/334155/E2E8F0?text=No+Img"}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover border border-white/20 shadow-md"
                              onError={(e) => { e.currentTarget.src = 'https://placehold.co/48x48/334155/E2E8F0?text=Error'; }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-400/50">
                            <span className="text-blue-400 font-medium text-lg">{testimonial.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-white text-lg">{testimonial.name}</h3>
                          {testimonial.role && (
                            <p className="text-sm text-slate-400">
                              {testimonial.role}
                              {testimonial.company && ` at ${testimonial.company}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                          className="bg-white/20 backdrop-blur-md text-blue-400 rounded-full p-2 h-auto w-auto hover:bg-white/30 transition-all duration-200 shadow-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(testimonial._id)}
                          className="bg-red-500/70 backdrop-blur-md text-white rounded-full p-2 h-auto w-auto hover:bg-red-600/80 transition-all duration-200 shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(testimonial.rating)}
                      <span className="text-sm text-slate-400 ml-2">({testimonial.rating}/5)</span>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-slate-300 italic mb-4 line-clamp-3">"{testimonial.quote}"</blockquote>

                    {/* Status Badges & Visibility Icon */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex space-x-2">
                        {testimonial.isFeatured && (
                          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">Featured</span>
                        )}
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            testimonial.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {testimonial.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {testimonial.isActive ? (
                        <Eye className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {testimonials.length === 0 && (
            <div className="group relative z-10 animate-fade-in-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-700"></div>
              <Card className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-white/20 transition-all duration-500">
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Testimonials Yet</h3>
                  <p className="text-slate-400 mb-6">Add your first testimonial to showcase positive feedback.</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Testimonial
                  </Button>
                </CardContent>
              </Card>
            </div>
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
      </div>
    </AdminLayout>
  )
}
