/**
 * Database Models and Schemas
 * Defines the structure of documents in MongoDB collections
 */

// User model for authentication
export interface User {
    _id?: string
    email: string
    password: string // Hashed password
    name: string
    role: "admin" | "sub-admin"
    createdAt: Date
    updatedAt: Date
    lastLogin?: Date
    isActive: boolean
  }
  
  // Header configuration model
  export interface HeaderConfig {
    _id?: string
    logo: string
    navigation: Array<{
      id: string
      name: string
      href: string
      order: number
      isActive: boolean
    }>
    ctaButton?: {
      label: string
      href: string
      isActive: boolean
    }
    updatedAt: Date
    updatedBy: string
  }
  
  // Footer configuration model
  export interface FooterConfig {
    _id?: string
    address: string
    phone: string
    email: string
    socialLinks: Array<{
      id: string
      platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube"
      url: string
      isActive: boolean
    }>
    quickLinks: Array<{
      id: string
      name: string
      href: string
      order: number
      isActive: boolean
    }>
    updatedAt: Date
    updatedBy: string
  }
  
  // Banner model for hero slider
  export interface Banner {
    _id?: string
    image: string
    heading: string
    subheading: string
    buttonLabel?: string
    buttonLink?: string
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: string
  }
  
  // About Us content model
  export interface AboutContent {
    _id?: string
    content: string // Rich text HTML content
    image?: string
    updatedAt: Date
    updatedBy: string
  }
  
  // Gallery item model
  export interface GalleryItem {
    _id?: string
    url: string
    alt: string
    category: string
    caption?: string
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: string
  }
  
  // Event model
  export interface Event {
    _id?: string
    title: string
    description: string
    content?: string // Rich text content for full event details
    date: Date
    endDate?: Date
    location?: string
    image?: string
    isActive: boolean
    isFeatured: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: string
  }
  
  // Team member model
  export interface TeamMember {
    _id?: string
    name: string
    photo: string
    designation: string
    bio?: string
    email?: string
    phone?: string
    socialLinks: {
      linkedin?: string
      twitter?: string
      facebook?: string
      instagram?: string
    }
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: string
  }
  
  // Testimonial model
  export interface Testimonial {
    _id?: string
    name: string
    photo?: string
    quote: string
    rating?: number // 1-5 stars
    designation?: string
    company?: string
    isActive: boolean
    isFeatured: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: string
  }
  
  // Contact form submission model
  export interface ContactSubmission {
    _id?: string
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    isRead: boolean
    createdAt: Date
  }
  
  // Site settings model
  export interface SiteSettings {
    _id?: string
    siteName: string
    siteDescription: string
    siteKeywords: string[]
    contactEmail: string
    contactPhone: string
    address: string
    socialLinks: {
      facebook?: string
      twitter?: string
      instagram?: string
      linkedin?: string
      youtube?: string
    }
    seoSettings: {
      metaTitle: string
      metaDescription: string
      ogImage?: string
    }
    updatedAt: Date
    updatedBy: string
  }
  