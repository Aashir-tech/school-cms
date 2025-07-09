"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  endDate?: string
  location?: string
  image?: string
  isActive: boolean
  isFeatured: boolean
}

export function EventsPageClient() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchEvents()
  }, [pagination.page, filter])

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/events?${params}`)
      if (response.ok) {
        const data = await response.json()
        let filteredEvents = (data.data || []).filter((event: Event) => event.isActive)

        // Apply client-side filtering
        if (filter === "upcoming") {
          filteredEvents = filteredEvents.filter((event: Event) => new Date(event.date) > new Date())
        } else if (filter === "past") {
          filteredEvents = filteredEvents.filter((event: Event) => new Date(event.date) <= new Date())
        }

        setEvents(filteredEvents)
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    fetchEvents()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">School Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest events and activities happening at our school.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
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

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="cursor-pointer"
                >
                  All Events
                </Button>
                <Button
                  variant={filter === "upcoming" ? "default" : "outline"}
                  onClick={() => setFilter("upcoming")}
                  className="cursor-pointer"
                >
                  Upcoming
                </Button>
                <Button
                  variant={filter === "past" ? "default" : "outline"}
                  onClick={() => setFilter("past")}
                  className="cursor-pointer"
                >
                  Past Events
                </Button>
              </div>

              <Button onClick={handleSearch} className="cursor-pointer">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Spinner size="large" />
          </div>
        )}

        {/* Events Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {event.image && (
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    {event.isFeatured && <Badge className="absolute top-2 left-2">Featured</Badge>}
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant={isUpcoming(event.date) ? "default" : "secondary"}>
                      {isUpcoming(event.date) ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                      {event.endDate && event.endDate !== event.date && <span> - {formatDate(event.endDate)}</span>}
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "Check back later for upcoming events"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
