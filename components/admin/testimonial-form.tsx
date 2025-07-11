"use client"

/**
 * Testimonial Form Component
 * Form for creating and editing testimonials
 */
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "./file-upload"

interface Testimonial {
  _id?: string
  name: string
  role?: string
  company?: string
  quote: string
  rating: number
  image?: string
  isActive: boolean
  isFeatured: boolean
}

interface TestimonialFormProps {
  testimonial?: Testimonial | null
  onSave: (data: Partial<Testimonial>) => void
  onCancel: () => void
}

export function TestimonialForm({ testimonial, onSave, onCancel }: TestimonialFormProps) {
  const [image, setImage] = useState(testimonial?.image || "")
  const [rating, setRating] = useState(testimonial?.rating || 5)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Testimonial>({
    defaultValues: {
      name: testimonial?.name || "",
      role: testimonial?.role || "",
      company: testimonial?.company || "",
      quote: testimonial?.quote || "",
      rating: testimonial?.rating || 5,
      isActive: testimonial?.isActive ?? true,
      isFeatured: testimonial?.isFeatured ?? false,
    },
  })

  const isActive = watch("isActive")
  const isFeatured = watch("isFeatured")

  useEffect(() => {
    setValue("image", image)
    setValue("rating", rating)
  }, [image, rating, setValue])

  const onSubmit = (data: Testimonial) => {
    onSave({
      ...data,
      image,
      rating,
    })
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Role */}
                <div>
                  <Label htmlFor="role">Role/Position (Optional)</Label>
                  <Input id="role" {...register("role")} placeholder="e.g., Parent, Student, Teacher" />
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company">Company/Organization (Optional)</Label>
                  <Input id="company" {...register("company")} placeholder="e.g., ABC Company" />
                </div>

                {/* Rating */}
                <div>
                  <Label>Rating *</Label>
                  <div className="flex items-center space-x-1 mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleStarClick(i + 1)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Active (visible on website)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setValue("isFeatured", checked)}
                    />
                    <Label htmlFor="isFeatured">Featured testimonial</Label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label>Profile Photo (Optional)</Label>
                  <FileUpload onUpload={setImage} currentImage={image} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Quote - Full Width */}
            <div>
              <Label htmlFor="quote">Testimonial Quote *</Label>
              <Textarea
                id="quote"
                {...register("quote", { required: "Quote is required" })}
                className={errors.quote ? "border-red-500" : ""}
                rows={4}
                placeholder="Enter the testimonial quote..."
              />
              {errors.quote && <p className="text-red-500 text-sm mt-1">{errors.quote.message}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {testimonial ? "Update Testimonial" : "Create Testimonial"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
