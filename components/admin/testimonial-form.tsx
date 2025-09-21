/**
 * Testimonial Form Component
 * Form for creating and editing testimonials with cinematic design
 */
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Star, Save } from "lucide-react" // Added Save icon
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10
        bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-white/10">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-slate-300">Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className={`mt-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Role */}
                <div>
                  <Label htmlFor="role" className="text-slate-300">Role/Position (Optional)</Label>
                  <Input
                    id="role"
                    {...register("role")}
                    placeholder="e.g., Parent, Student, Teacher"
                    className="mt-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-slate-300">Company/Organization (Optional)</Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="e.g., ABC Company"
                    className="mt-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-slate-300">Rating *</Label>
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
                            i < rating ? "text-yellow-400 fill-current" : "text-slate-600" // Adjusted for dark theme
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-400">({rating}/5)</span>
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-600"
                    />
                    <Label htmlFor="isActive" className="text-slate-300">Active (visible on website)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setValue("isFeatured", checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-600"
                    />
                    <Label htmlFor="isFeatured" className="text-slate-300">Featured testimonial</Label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="profile-photo" className="text-slate-300">Profile Photo (Optional)</Label>
                  <FileUpload onUpload={setImage} currentImage={image} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Quote - Full Width */}
            <div>
              <Label htmlFor="quote" className="text-slate-300">Testimonial Quote *</Label>
              <Textarea
                id="quote"
                {...register("quote", { required: "Quote is required" })}
                className={`mt-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.quote ? "border-red-500" : ""}`}
                rows={4}
                placeholder="Enter the testimonial quote..."
              />
              {errors.quote && <p className="text-red-400 text-sm mt-1">{errors.quote.message}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl shadow-lg hover:bg-slate-600 border border-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Save className="h-5 w-5 mr-2" />
                {testimonial ? "Update Testimonial" : "Create Testimonial"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Animations for modal */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
