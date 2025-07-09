"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInitialPublicData } from "@/hooks/useInitialPublicData"

export function PublicHeader() {

  const { isLoading, publicData } = useInitialPublicData()
  const { settings } = publicData

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ]

  if (isLoading) return null;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-blue-200 cursor-pointer">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-blue-200 cursor-pointer">
                  {settings.contactEmail}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {settings?.socialMedia?.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 cursor-pointer"
                >
                  Facebook
                </a>
              )}
              {settings?.socialMedia?.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 cursor-pointer"
                >
                  Twitter
                </a>
              )}
              {settings?.socialMedia?.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 cursor-pointer"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-900 cursor-pointer">
                {settings.siteName}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-900 font-medium transition-colors cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-900 font-medium transition-colors cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
