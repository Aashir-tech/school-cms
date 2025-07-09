/**
 * Public Contact Page
 * Contact form and information for public visitors
 */
import type { Metadata } from "next"
import { ContactPageClient } from "@/components/public/contact-page-client"

export const metadata: Metadata = {
  title: "Contact Us - School Name",
  description: "Get in touch with us. Find our contact information and send us a message.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <main>
        <ContactPageClient />
      </main>
    </div>
  )
}
