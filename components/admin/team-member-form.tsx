/**
 * Team Member Form Component
 * Form for creating and editing team members
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

  // Update photo in form when uploaded
  useEffect(() => {
    setValue("photo", photo)
  }, [photo, setValue])

  // Handle form submission
  const onSubmit = (data: TeamMember) => {
    onSave({
      ...data,
      photo,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{member ? "Edit Team Member" : "Add New Team Member"}</CardTitle>
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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Designation */}
                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    {...register("designation", { required: "Designation is required" })}
                    className={errors.designation ? "border-red-500" : ""}
                    placeholder="e.g., Principal, Math Teacher"
                  />
                  {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    rows={4}
                    placeholder="Brief description about the team member..."
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>

                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="email@school.edu" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" {...register("phone")} placeholder="+1 (555) 123-4567" />
                  </div>
                </div>

                {/* Order and Status */}
                <div className="space-y-4">
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <Label>Profile Photo *</Label>
                  <FileUpload onUpload={setPhoto} currentImage={photo} className="mt-2" />
                  {!photo && <p className="text-red-500 text-sm mt-1">Photo is required</p>}
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Links (Optional)</h3>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      {...register("socialLinks.linkedin")}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      {...register("socialLinks.twitter")}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input
                      id="facebook"
                      {...register("socialLinks.facebook")}
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                      id="instagram"
                      {...register("socialLinks.instagram")}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!photo}>
                {member ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
