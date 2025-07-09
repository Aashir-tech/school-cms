"use client"

import { useEffect, useState } from "react"

interface AboutContent {
    content: string
    image?: string
}

export function useHomeData() {
  const [loading, setLoading] = useState(true)
  const [hero, setHero] = useState([])
  const [about, setAbout] = useState<AboutContent>({
    content: "",
    image: "",
  })
  const [events, setEvents] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bannersRes, aboutRes, eventsRes, testimonialsRes] = await Promise.all([
          fetch("/api/banners"),
          fetch("/api/about"),
          fetch("/api/events?limit=3"),
          fetch("/api/testimonials?limit=3"),
        ])

        const [bannersData, aboutData, eventsData, testimonialsData] = await Promise.all([
          bannersRes.json(),
          aboutRes.json(),
          eventsRes.json(),
          testimonialsRes.json(),
        ])

        setHero((bannersData.data || []).filter((b: any) => b.isActive).sort((a: any, b: any) => a.order - b.order))
        setAbout(aboutData.data)
        setEvents((eventsData.data || []).filter((e: any) => e.isActive && new Date(e.date) >= new Date()))
        setTestimonials((testimonialsData.data || []).filter((t: any) => t.isActive).slice(0, 3))
      } catch (e) {
        console.error("Home fetch error", e)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return { loading, hero, about, events, testimonials }
}
