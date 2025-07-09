/**
 * Public Team Page
 * Display all team members for public visitors
 */
import type { Metadata } from "next"
import { TeamPageClient } from "@/components/public/team-page-client"
import { PublicHeader } from "@/components/public/header"
import { PublicFooter } from "@/components/public/footer"

export const metadata: Metadata = {
  title: "Our Team - School Name",
  description: "Meet our dedicated team of educators and staff members.",
}

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <main>
        <TeamPageClient />
      </main>
    </div>
  )
}
