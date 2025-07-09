/**
 * Public Events Page
 * Display all events for public visitors
 */
import type { Metadata } from "next"
import { EventsPageClient } from "@/components/public/events-page-client"
export const metadata: Metadata = {
  title: "Events - School Name",
  description: "Stay updated with our latest events and activities happening at our school.",
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <main>
        <EventsPageClient />
      </main>
    </div>
  )
}
