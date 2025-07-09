"use client"

import Image from "next/image"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

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

export function EventsSection({events} : {events : Event[]}) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest events and activities happening at our school.
          </p>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  {event.image && (
                    <div className="relative h-48">
                      <Image
                        src={event.image || "/placeholder.svg?height=200&width=300"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(event.date)}
                      {event.endDate && event.endDate !== event.date && <span> - {formatDate(event.endDate)}</span>}
                    </div>
                    {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent cursor-pointer">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="cursor-pointer">
                <a href="/events">View All Events</a>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-600">Check back later for new events and activities.</p>
          </div>
        )}
      </div>
    </section>
  )
}
