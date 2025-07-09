"use client"

import { Label } from "@/components/ui/label"

/**
 * Contact Messages Management Page
 * Admin interface for managing contact form submissions
 */
import { useState, useEffect } from "react"
import { Mail, MailOpen, Trash2, Eye, Calendar, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { AdminLayout } from "@/components/admin/layout"
import { createAuthenticatedFetch } from "@/lib/api-helpers"

interface ContactMessage {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [authFetch, setAuthFetch] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; messageId: string | null }>({
    open: false,
    messageId: null,
  })
  const { toast } = useToast()
  
  useEffect(() => {
    setAuthFetch(() => createAuthenticatedFetch())
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await authFetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact messages"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await authFetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setMessages(messages.map((msg) => (msg._id === messageId ? { ...msg, isRead: true } : msg)))
        toast({
          title: "Success",
          description: "Message marked as read",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message"
      })
    }
  }

  const handleDeleteMessage = async () => {
    if (!deleteDialog.messageId) return

    try {
      const response = await authFetch(`/api/contact/${deleteDialog.messageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== deleteDialog.messageId))
        toast({
          title: "Success",
          description: "Message deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message"
      })
    } finally {
      setDeleteDialog({ open: false, messageId: null })
    }
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      handleMarkAsRead(message._id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter((msg) => !msg.isRead).length

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
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">Manage contact form submissions from your website</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
            <Badge variant="outline" className="text-sm">
              {messages.length} total
            </Badge>
          </div>
        </div>

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <Card
                key={message._id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !message.isRead ? "border-blue-200 bg-blue-50" : "hover:bg-gray-50"
                } ${selectedMessage?._id === message._id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleViewMessage(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {message.isRead ? (
                          <MailOpen className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Mail className="h-4 w-4 text-blue-500" />
                        )}
                        <h3 className={`font-medium truncate ${!message.isRead ? "text-blue-900" : "text-gray-900"}`}>
                          {message.subject}
                        </h3>
                        {!message.isRead && <Badge className="bg-blue-500 text-white text-xs">New</Badge>}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{message.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{message.email}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{message.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(message.createdAt)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteDialog({ open: true, messageId: message._id })
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {messages.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Contact form submissions will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Message Details</span>
                    <Badge variant={selectedMessage.isRead ? "secondary" : "default"}>
                      {selectedMessage.isRead ? "Read" : "Unread"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Subject</Label>
                    <p className="text-lg font-semibold">{selectedMessage.subject}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{selectedMessage.name}</span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date Received</Label>
                    <p className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Message</Label>
                    <div className="bg-gray-50 p-4 rounded-lg mt-2">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      className="flex-1"
                      onClick={() =>
                        window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)
                      }
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialog({ open: true, messageId: selectedMessage._id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a message</h3>
                  <p className="text-gray-600">Click on a message to view its details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, messageId: null })}
          title="Delete Message"
          description="Are you sure you want to delete this contact message? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteMessage}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  )
}
