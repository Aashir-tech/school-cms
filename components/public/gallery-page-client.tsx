"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

interface GalleryItem {
  _id: string
  url: string
  alt: string
  category: string
  caption?: string
  order: number
  isActive: boolean
}

export function GalleryPageClient() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(galleryItems.map((item) => item.category)))
    setCategories(uniqueCategories)
  }, [galleryItems])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        // Filter only active items for public display and sort by order
        const activeItems = (data.data || [])
          .filter((item: GalleryItem) => item.isActive)
          .sort((a: GalleryItem, b: GalleryItem) => a.order - b.order)
        setGalleryItems(activeItems)
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      item.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openImageModal = (item: GalleryItem) => {
    setSelectedImage(item)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our school's photo gallery showcasing events, facilities, and student activities.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search photos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  size="sm"
                  className="cursor-pointer"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                    className="cursor-pointer"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openImageModal(item)}
            >
              <div className="relative aspect-square">
                <Image src={item.url || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </div>
              {item.caption && (
                <CardContent className="p-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{item.caption}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "Check back later for new photos"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-4xl max-h-full">
              <button onClick={closeImageModal} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                {selectedImage.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                    <p className="text-center">{selectedImage.caption}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
