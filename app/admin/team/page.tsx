/**
 * Team Management Page
 * Admin interface for managing team members
 */
"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { TeamMemberForm } from "@/components/admin/team-member-form"
import Image from "next/image"
import { AdminLayout } from "@/components/admin/layout"

interface TeamMember {
  _id: string
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

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; memberId: string | null }>({
    open: false,
    memberId: null,
  })
  const { toast } = useToast()

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers()
  }, [])

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team members",      })
    } finally {
      setLoading(false)
    }
  }

  // Handle team member creation/update
  const handleSaveMember = async (memberData: Partial<TeamMember>) => {
    try {
      const url = editingMember ? `/api/team/${editingMember._id}` : "/api/team"
      const method = editingMember ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Team member ${editingMember ? "updated" : "added"} successfully`,
        })
        fetchTeamMembers()
        setShowForm(false)
        setEditingMember(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member",      })
    }
  }

  // Handle team member deletion
  const handleDeleteMember = async () => {
    if (!deleteDialog.memberId) return

    try {
      const response = await fetch(`/api/team/${deleteDialog.memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        })
        fetchTeamMembers()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",      })
    } finally {
      setDeleteDialog({ open: false, memberId: null })
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your school's team members and staff</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member._id} className="overflow-hidden">
            <div className="relative">
              <div className="relative h-48">
                <Image src={member.photo || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-blue-500"
                  onClick={() => {
                    setEditingMember(member)
                    setShowForm(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500"
                  variant="destructive"
                  onClick={() => setDeleteDialog({ open: true, memberId: member._id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!member.isActive && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Inactive</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-blue-600 text-sm mb-2">{member.designation}</p>
              {member.bio && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{member.bio}</p>}

              {/* Contact Info */}
              <div className="space-y-1 mb-3">
                {member.email && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Mail className="h-3 w-3 mr-1" />
                    {member.email}
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Phone className="h-3 w-3 mr-1" />
                    {member.phone}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                </div>
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {teamMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-4">Add your first team member to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Team Member Form Modal */}
      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={() => {
            setShowForm(false)
            setEditingMember(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, memberId: null })}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteMember}
        variant="destructive"
      />
    </div>
    </AdminLayout>
  )
}
