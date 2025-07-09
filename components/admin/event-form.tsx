/**
 * Event Form Component
 * Form for creating and editing events
 */
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
import { RichTextEditor } from "./rich-text-editor"

interface Event {
  _id?: string
  title: string
  description: string
  content?: string
  date: string
  endDate?: string
  location?: string
  image?: string
  isActive: boolean
  isFeatured: boolean
}

interface EventFormProps {
  event?: Event | null
  onSave: (data: Partial<Event>) => void
  onCancel: () => void
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [image, setImage] = useState(event?.image || "")
  const [content, setContent] = useState(event?.content || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Event>({
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
      endDate: event?.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
      location: event?.location || "",
      isActive: event?.isActive ?? true,
      isFeatured: event?.isFeatured ?? false,
    },
  })

  const isActive = watch("isActive")
  const isFeatured = watch("isFeatured")

  // Update form values when image or content changes
  useEffect(() => {
    setValue("image", image)
    setValue("content", content)
  }, [image, content, setValue])

  // Handle form submission
  const onSubmit = (data: Event) => {
    onSave({
      ...data,
      image,
      content,
    })
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{event ? "Edit Event" : "Add New Event"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    className={errors.description ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input id="endDate" type="date" {...register("endDate")} />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input id="location" {...register("location")} placeholder="e.g., School Auditorium" />
                </div>

                {/* Switches */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setValue("isFeatured", checked)}
                    />
                    <Label htmlFor="isFeatured">Featured Event</Label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label>Event Image (Optional)</Label>
                  <FileUpload onUpload={setImage} currentImage={image} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Full Width Content Editor */}
            <div>
              <Label>Detailed Content (Optional)</Label>
              <div className="mt-2">
                <RichTextEditor value={content} onChange={setContent} placeholder="Add detailed event information..." />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
