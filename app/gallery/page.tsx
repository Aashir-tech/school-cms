/**
 * Public Gallery Page
 * Display photo gallery for public visitors
 */
import type { Metadata } from "next"
import { GalleryPageClient } from "@/components/public/gallery-page-client"

export const metadata: Metadata = {
  title: "Gallery - School Name",
  description: "Explore our school's photo gallery showcasing events, facilities, and student activities.",
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <main>
        <GalleryPageClient />
      </main>
    </div>
  )
}
