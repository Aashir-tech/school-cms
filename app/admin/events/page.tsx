"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Search, Zap } from "lucide-react";
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
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; eventId: string | null }>({
    open: false,
    eventId: null,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [pagination.page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
      });

      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/events?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch events");
      
      const data = await response.json();
      setEvents(data.data || []);
      setPagination(data.pagination || pagination);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: `Failed to fetch events: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchEvents();
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      const token = localStorage.getItem("auth-token");
      const url = editingEvent ? `/api/events/${editingEvent._id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save event");
      }

      toast({
        title: "Success",
        description: `Event ${editingEvent ? "updated" : "created"} successfully`,
      });
      fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: `Failed to save event: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteDialog.eventId) return;
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/events/${deleteDialog.eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete event");
      
      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, eventId: null });
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const isUpcoming = (dateString: string) => new Date(dateString) > new Date();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-background">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-background">
        <div className="relative z-10 bg-card/80 backdrop-blur-xl border-b border-border p-8 shadow-sm flex justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Events Management</h1>
            <p className="text-muted-foreground text-lg mt-1">Manage school events and activities.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="p-6 space-y-8">
          <Card className="animate-fade-in-up">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search events by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="w-full md:w-auto">Search</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 z-10 relative">
            {events.length === 0 ? (
              <Card className="animate-fade-in-up">
                <CardContent className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Try adjusting your search terms." : "Create your first event to get started."}
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              events.map((event, index) => (
                <div key={event._id} className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <Card className="relative bg-card border-border rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-start md:space-x-6">
                        {event.image && (
                          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 mb-4 md:mb-0 shadow-md">
                            <Image src={event.image} alt={event.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row items-start sm:justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{event.title}</h3>
                              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{event.description}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center text-primary"><Calendar className="h-4 w-4 mr-1.5" />{formatDate(event.date)}</div>
                                {event.location && <div className="flex items-center text-primary/80"><Zap className="h-4 w-4 mr-1.5" />{event.location}</div>}
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2 mt-4 sm:mt-0">
                              <Button size="icon" variant="secondary" onClick={() => { setEditingEvent(event); setShowForm(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="destructive" onClick={() => setDeleteDialog({ open: true, eventId: event._id })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                            <Badge variant={isUpcoming(event.date) ? "default" : "secondary"}>{isUpcoming(event.date) ? "Upcoming" : "Past"}</Badge>
                            {event.isFeatured && <Badge variant="outline" className="border-primary text-primary">Featured</Badge>}
                            <Badge variant={event.isActive ? "default" : "secondary"}>{event.isActive ? "Active" : "Inactive"}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8 z-10 relative">
              <Button variant="outline" disabled={pagination.page === 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}>Previous</Button>
              <span className="text-muted-foreground text-sm font-medium">Page {pagination.page} of {pagination.pages}</span>
              <Button variant="outline" disabled={pagination.page === pagination.pages} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}>Next</Button>
            </div>
          )}
        </div>

        {showForm && (
          <EventForm
            event={editingEvent}
            onSave={handleSaveEvent}
            onCancel={() => { setShowForm(false); setEditingEvent(null); }}
          />
        )}

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Event"
          description="Are you sure you want to delete this event? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteEvent}
          variant="destructive"
        />
      </div>
      <style jsx global>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
      `}</style>
    </AdminLayout>
  );
}
