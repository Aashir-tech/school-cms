"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


interface Testimonial {
  _id: string;
  name: string;
  photo?: string;
  quote: string;
  rating?: number;
  designation?: string;
  company?: string;
  isActive: boolean;
  isFeatured: boolean;
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Parents Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our school community about their experiences and success
            stories.
          </p>
        </div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="text-gray-600 mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    {testimonial.photo && (
                      <Image
                        src={
                          testimonial.photo ||
                          "/placeholder.svg?height=48&width=48"
                        }
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.designation || "Parent"}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No testimonials available
            </h3>
            <p className="text-gray-600">
              Check back later to read what people are saying about our school.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
