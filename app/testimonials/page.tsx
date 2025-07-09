/**
 * Public Testimonials Page
 * Display testimonials for public visitors
 */
import type { Metadata } from "next"
import { TestimonialsPageClient } from "@/components/public/testimonials-page-client"

export const metadata: Metadata = {
  title: "Testimonials - School Name",
  description: "Read what parents and students say about their experience at our school.",
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      <main>
        <TestimonialsPageClient />
      </main>
    </div>
  )
}
