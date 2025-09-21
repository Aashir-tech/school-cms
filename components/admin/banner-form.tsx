"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "./file-upload" // Make sure this component is also theme-aware

interface Banner {
  _id?: string
  image: string
  heading: string
  subheading: string
  buttonLabel?: string
  buttonLink?: string
  order: number
  isActive: boolean
}

interface BannerFormProps {
  banner?: Banner | null
  onSave: (data: Partial<Banner>) => void
  onCancel: () => void
}

export function BannerForm({ banner, onSave, onCancel }: BannerFormProps) {
  const [image, setImage] = useState(banner?.image || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Banner>({
    defaultValues: {
      heading: banner?.heading || "",
      subheading: banner?.subheading || "",
      buttonLabel: banner?.buttonLabel || "",
      buttonLink: banner?.buttonLink || "",
      order: banner?.order || 1,
      isActive: banner?.isActive ?? true,
    },
  })

  const isActive = watch("isActive")

  useEffect(() => {
    setValue("image", image)
  }, [image, setValue])

  const onSubmit = (data: Banner) => {
    onSave({
      ...data,
      image,
    })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 bg-card border-border rounded-2xl shadow-2xl animate-scale-in custom-scrollbar">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-2xl font-bold text-foreground">
            {banner ? "Edit Banner" : "Add New Banner"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="banner-image" className="text-muted-foreground mb-2 block">
                Banner Image *
              </Label>
              <FileUpload onUpload={setImage} currentImage={image} className="mt-2" />
              {!image && (
                <p className="text-sm font-medium text-destructive mt-2">
                  Image is required
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="heading">Heading *</Label>
              <Input
                id="heading"
                {...register("heading", { required: "Heading is required" })}
                className={`mt-1 ${errors.heading ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.heading && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {errors.heading.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subheading">Subheading *</Label>
              <Textarea
                id="subheading"
                {...register("subheading", { required: "Subheading is required" })}
                className={`mt-1 ${errors.subheading ? "border-destructive focus-visible:ring-destructive" : ""}`}
                rows={3}
              />
              {errors.subheading && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {errors.subheading.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="buttonLabel">Button Label (Optional)</Label>
              <Input
                id="buttonLabel"
                {...register("buttonLabel")}
                placeholder="e.g., Learn More"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="buttonLink">Button Link (Optional)</Label>
              <Input
                id="buttonLink"
                {...register("buttonLink")}
                placeholder="e.g., /about"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="order">Display Order *</Label>
              <Input
                id="order"
                type="number"
                min="1"
                {...register("order", {
                  required: "Order is required",
                  min: { value: 1, message: "Order must be at least 1" },
                })}
                className={`mt-1 ${errors.order ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.order && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {errors.order.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!image}>
                <Save className="h-5 w-5 mr-2" />
                {banner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
