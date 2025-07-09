"use client"

import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

interface Testimonial {
  _id: string
  name: string
  photo?: string
  quote: string
  rating?: number
  designation?: string
  company?: string
  isActive: boolean
  isFeatured: boolean
}

export function TestimonialsPageClient() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        // Filter only active testimonials for public display
        const activeTestimonials = (data.data || []).filter((testimonial: Testimonial) => testimonial.isActive)
        // Sort by featured first, then by creation date
        const sortedTestimonials = activeTestimonials.sort((a: Testimonial, b: Testimonial) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return 0
        })
        setTestimonials(sortedTestimonials)
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read what parents and students say about their experience at our school.
          </p>
        </div>

        {/* Featured Testimonials */}
        {testimonials.some((t) => t.isFeatured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Testimonials</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials
                .filter((testimonial) => testimonial.isFeatured)
                .slice(0, 2)
                .map((testimonial) => (
                  <Card key={testimonial._id} className="relative overflow-hidden">
                    <CardContent className="p-8">
                      <div className="absolute top-4 right-4">
                        <Badge>Featured</Badge>
                      </div>
                      <div className="absolute top-4 left-4 text-blue-200">
                        <Quote className="h-8 w-8" />
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4 mt-4">{renderStars(testimonial.rating)}</div>

                      {/* Quote */}
                      <blockquote className="text-lg text-gray-700 mb-6 italic">"{testimonial.quote}"</blockquote>

                      {/* Author */}
                      <div className="flex items-center">
                        {testimonial.photo && (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                            <Image
                              src={testimonial.photo || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          {testimonial.designation && (
                            <div className="text-sm text-gray-600">
                              {testimonial.designation}
                              {testimonial.company && ` at ${testimonial.company}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                  {testimonial.isFeatured && (
                    <Badge variant="outline" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 flex-grow italic">"{testimonial.quote}"</blockquote>

                {/* Author */}
                <div className="flex items-center mt-auto">
                  {testimonial.photo && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={testimonial.photo || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    {testimonial.designation && (
                      <div className="text-sm text-gray-600">
                        {testimonial.designation}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Quote className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials available</h3>
              <p className="text-gray-600">Check back later to read what people are saying about our school.</p>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {testimonials.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="bg-blue-50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
                <p className="text-gray-600 mb-6">
                  We'd love to hear about your experience with our school. Your feedback helps us improve and helps
                  other families make informed decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Contact Us
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Call Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
