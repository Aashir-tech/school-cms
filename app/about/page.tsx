/**
 * Public About Page
 * Display about us content for public visitors
 */
import type { Metadata } from "next"
import { AboutPageClient } from "@/components/public/about-page-client"
import { PublicHeader } from "@/components/public/header"
import { PublicFooter } from "@/components/public/footer"

export const metadata: Metadata = {
  title: "About Us - School Name",
  description: "Learn more about our school's mission, values, and commitment to educational excellence.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main>
        <AboutPageClient />
      </main>
    </div>
  )
}
