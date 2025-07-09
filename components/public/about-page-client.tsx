"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useInitialPublicData } from "@/hooks/useInitialPublicData"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

export function AboutPageClient() {
  const { isLoading, publicData } = useInitialPublicData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    )
  }

  const { about, stats } = publicData

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our School</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about our mission, values, and commitment to educational excellence.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Text Content */}
          <div className="prose prose-lg max-w-none">
            {about.content ? (
              <div dangerouslySetInnerHTML={{ __html: about.content }} />
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Our school has been a cornerstone of educational excellence for over 50 years. We are committed to
                  providing a nurturing environment where students can grow academically, socially, and personally.
                </p>
                <p className="text-gray-600">
                  With state-of-the-art facilities, experienced faculty, and a comprehensive curriculum, we prepare our
                  students for success in an ever-changing world. Our approach combines traditional values with
                  innovative teaching methods.
                </p>
                <p className="text-gray-600">
                  We believe in developing well-rounded individuals who are not only academically proficient but also
                  possess strong character, leadership skills, and a sense of social responsibility.
                </p>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={about.image || "/placeholder.svg?height=500&width=600"}
                alt="About Our School"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Live Statistics Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <h3 className="text-lg font-semibold mb-2">Years of Excellence</h3>
              <p className="text-gray-600">Providing quality education since 1974</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalTeamMembers}+</div>
              <h3 className="text-lg font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">Dedicated and experienced educators</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalEvents}+</div>
              <h3 className="text-lg font-semibold mb-2">Annual Events</h3>
              <p className="text-gray-600">Engaging activities and programs</p>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To provide a comprehensive, innovative, and inclusive educational experience that empowers students to
                become confident, creative, and responsible global citizens who contribute positively to society.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be a leading educational institution that nurtures academic excellence, character development, and
                lifelong learning, preparing students to thrive in an ever-evolving world.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
