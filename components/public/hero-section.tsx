"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Banner {
  _id: string
  image: string
  heading: string
  subheading: string
  buttonLabel?: string
  buttonLink?: string
  order: number
  isActive: boolean
}

export function HeroSection({banners} : {banners : Banner[]}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[600px] overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center text-gray-600">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our School</h1>
          <p className="text-xl md:text-2xl">Providing quality education for a brighter future</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner.image || "/placeholder.svg?height=600&width=1200"}
            alt={banner.heading}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.heading}</h1>
              <p className="text-xl md:text-2xl mb-8">{banner.subheading}</p>
              {banner.buttonLabel && banner.buttonLink && (
                <Button size="lg" asChild className="cursor-pointer">
                  <a href={banner.buttonLink}>{banner.buttonLabel}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
