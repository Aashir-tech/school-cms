"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "./file-upload"

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
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{banner ? "Edit Banner" : "Add New Banner"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="cursor-pointer hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Banner Image *</Label>
              <FileUpload onUpload={setImage} currentImage={image} className="mt-2" />
              {!image && <p className="text-red-500 text-sm mt-1">Image is required</p>}
            </div>

            {/* Heading */}
            <div>
              <Label htmlFor="heading">Heading *</Label>
              <Input
                id="heading"
                {...register("heading", { required: "Heading is required" })}
                className={errors.heading ? "border-red-500" : ""}
              />
              {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading.message}</p>}
            </div>

            {/* Subheading */}
            <div>
              <Label htmlFor="subheading">Subheading *</Label>
              <Textarea
                id="subheading"
                {...register("subheading", { required: "Subheading is required" })}
                className={errors.subheading ? "border-red-500" : ""}
                rows={3}
              />
              {errors.subheading && <p className="text-red-500 text-sm mt-1">{errors.subheading.message}</p>}
            </div>

            {/* Button Label */}
            <div>
              <Label htmlFor="buttonLabel">Button Label (Optional)</Label>
              <Input id="buttonLabel" {...register("buttonLabel")} placeholder="e.g., Learn More" />
            </div>

            {/* Button Link */}
            <div>
              <Label htmlFor="buttonLink">Button Link (Optional)</Label>
              <Input id="buttonLink" {...register("buttonLink")} placeholder="e.g., /about" />
            </div>

            {/* Order */}
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
                className={errors.order ? "border-red-500" : ""}
              />
              {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
              <Label htmlFor="isActive">Active</Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="cursor-pointer hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!image}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {banner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
