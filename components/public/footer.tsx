"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useInitialPublicData } from "@/hooks/useInitialPublicData"
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";


export function PublicFooter() {

  const { isLoading, publicData } = useInitialPublicData()
  const { settings } = publicData

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (isLoading) return null;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{settings.siteName}</h3>
            <p className="text-gray-300 mb-6">
              Providing quality education and nurturing young minds for a
              brighter future. Join our community of learners and discover your
              potential.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {settings.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-400" />
                  <span className="text-gray-300">{settings.address}</span>
                </div>
              )}
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* "socialMedia": {
                "facebook": "",
                "twitter": "",
                "instagram": "",
                "linkedin": ""
            }, */}

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {Object.entries(settings?.socialMedia || {}).map(
                ([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
