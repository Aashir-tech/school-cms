/**
 * Events Management Page
 * Admin interface for managing school events
 */
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import { EventForm } from "@/components/admin/event-form";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/layout";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    eventId: string | null;
  }>({
    open: false,
    eventId: null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { toast } = useToast();

  // Fetch events on component mount and when pagination changes
  useEffect(() => {
    fetchEvents();
  }, [pagination.page]);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchEvents();
  };

  // Handle event creation/update
  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      const url = editingEvent
        ? `/api/events/${editingEvent._id}`
        : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${
            editingEvent ? "updated" : "created"
          } successfully`,
        });
        fetchEvents();
        setShowForm(false);
        setEditingEvent(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
      });
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!deleteDialog.eventId) return;

    try {
      const response = await fetch(`/api/events/${deleteDialog.eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
      });
    } finally {
      setDeleteDialog({ open: false, eventId: null });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if event is upcoming
  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <AdminLayout>

      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Events Management
            </h1>
            <p className="text-gray-600">Manage school events and activities</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-gray-300 rounded-2xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event._id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Event Image */}
                  {event.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(event.date)}
                          </div>
                          {event.location && <span>📍 {event.location}</span>}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-500"
                          onClick={() => {
                            setEditingEvent(event);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-500"
                          onClick={() =>
                            setDeleteDialog({ open: true, eventId: event._id })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Event Badges */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge
                        variant={
                          isUpcoming(event.date) ? "default" : "secondary"
                        }
                      >
                        {isUpcoming(event.date) ? "Upcoming" : "Past"}
                      </Badge>
                      {event.isFeatured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first event to get started"}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
            >
              Next
            </Button>
          </div>
        )}

        {/* Event Form Modal */}
        {showForm && (
          <EventForm
            event={editingEvent}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, eventId: null })}
          title="Delete Event"
          description="Are you sure you want to delete this event? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteEvent}
          variant="destructive"
        />
      </div>
    </AdminLayout>
  );
}
