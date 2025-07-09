/**
 * Custom 404 Page
 * Displayed when a page is not found
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/public/header"
import { PublicFooter } from "@/components/public/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
