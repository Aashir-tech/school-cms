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

interface TeamMember {
  _id?: string
  name: string
  photo: string
  designation: string
  bio?: string
  email?: string
  phone?: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  order: number
  isActive: boolean
}

interface TeamMemberFormProps {
  member?: TeamMember | null
  onSave: (data: Partial<TeamMember>) => void
  onCancel: () => void
}

export function TeamMemberForm({ member, onSave, onCancel }: TeamMemberFormProps) {
  const [photo, setPhoto] = useState(member?.photo || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeamMember>({
    defaultValues: {
      name: member?.name || "",
      designation: member?.designation || "",
      bio: member?.bio || "",
      email: member?.email || "",
      phone: member?.phone || "",
      socialLinks: {
        linkedin: member?.socialLinks?.linkedin || "",
        twitter: member?.socialLinks?.twitter || "",
        facebook: member?.socialLinks?.facebook || "",
        instagram: member?.socialLinks?.instagram || "",
      },
      order: member?.order || 1,
      isActive: member?.isActive ?? true,
    },
  })

  const isActive = watch("isActive")

  useEffect(() => {
    setValue("photo", photo)
  }, [photo, setValue])

  const onSubmit = (data: TeamMember) => {
    onSave({
      ...data,
      photo,
    })
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 bg-card border-border rounded-2xl shadow-2xl animate-scale-in custom-scrollbar">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-2xl font-bold text-foreground">
            {member ? "Edit Team Member" : "Add New Team Member"}
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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className={`mt-1 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {errors.name && <p className="text-sm font-medium text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    {...register("designation", { required: "Designation is required" })}
                    className={`mt-1 ${errors.designation ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    placeholder="e.g., Principal, Math Teacher"
                  />
                  {errors.designation && <p className="text-sm font-medium text-destructive mt-1">{errors.designation.message}</p>}
                </div>

                <div>
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    rows={4}
                    placeholder="Brief description about the team member..."
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="email@school.edu" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" {...register("phone")} placeholder="+1 (555) 123-4567" className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
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
                    {errors.order && <p className="text-sm font-medium text-destructive mt-1">{errors.order.message}</p>}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="profile-photo">Profile Photo *</Label>
                  <FileUpload onUpload={setPhoto} currentImage={photo} className="mt-1" />
                  {!photo && <p className="text-sm font-medium text-destructive mt-2">Photo is required</p>}
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground">Social Links (Optional)</h3>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" {...register("socialLinks.linkedin")} placeholder="https://linkedin.com/in/username" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input id="twitter" {...register("socialLinks.twitter")} placeholder="https://twitter.com/username" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input id="facebook" {...register("socialLinks.facebook")} placeholder="https://facebook.com/username" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input id="instagram" {...register("socialLinks.instagram")} placeholder="https://instagram.com/username" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!photo}>
                <Save className="h-5 w-5 mr-2" />
                {member ? "Update Member" : "Add Member"}
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
