"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, Linkedin, Twitter, Facebook, Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

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

export function TeamPageClient() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team")
      if (response.ok) {
        const data = await response.json()
        // Filter only active members for public display and sort by order
        const activeMembers = (data.data || [])
          .filter((member: TeamMember) => member.isActive)
          .sort((a: TeamMember, b: TeamMember) => a.order - b.order)
        setTeamMembers(activeMembers)
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Spinner size="large" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our dedicated team of educators and staff members who are committed to providing excellence in
            education.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image src={member.photo || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.designation}</p>

                {member.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>}

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  {member.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${member.email}`} className="hover:text-blue-600 cursor-pointer">
                        {member.email}
                      </a>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${member.phone}`} className="hover:text-blue-600 cursor-pointer">
                        {member.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex space-x-3">
                  {Object.entries(member.socialLinks).map(([platform, url]) => {
                    if (!url) return null
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {getSocialIcon(platform)}
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members available</h3>
              <p className="text-gray-600">Check back later to meet our team.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
