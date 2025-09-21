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

  useEffect(() => {
    setValue("image", image)
    setValue("content", content)
  }, [image, content, setValue])

  const onSubmit = (data: Event) => {
    onSave({
      ...data,
      image,
      content,
    })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 bg-card border-border rounded-2xl shadow-2xl animate-scale-in custom-scrollbar">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-2xl font-bold text-foreground">
            {event ? "Edit Event" : "Add New Event"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    className={`mt-1 ${errors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {errors.title && <p className="text-sm font-medium text-destructive mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    className={`mt-1 ${errors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    rows={3}
                  />
                  {errors.description && <p className="text-sm font-medium text-destructive mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    className={`mt-1 ${errors.date ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {errors.date && <p className="text-sm font-medium text-destructive mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input id="endDate" type="date" {...register("endDate")} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input id="location" {...register("location")} placeholder="e.g., School Auditorium" className="mt-1" />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-3">
                    <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch id="isFeatured" checked={isFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked)} />
                    <Label htmlFor="isFeatured">Featured Event</Label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="event-image">Event Image (Optional)</Label>
                  <FileUpload onUpload={setImage} currentImage={image} className="mt-1" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="detailed-content">Detailed Content (Optional)</Label>
              <div className="mt-1">
                <RichTextEditor value={content} onChange={setContent} placeholder="Add detailed event information..." height="300px" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-5 w-5 mr-2" />
                {event ? "Update Event" : "Create Event"}
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
