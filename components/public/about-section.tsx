"use client"

import Image from "next/image"

interface AboutContent {
  content: string
  image?: string
}

export function AboutSection({aboutData} : {aboutData : AboutContent}) {

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Our School</h2>
            <div className="prose prose-lg text-gray-600">
              {aboutData.content ? (
                <div dangerouslySetInnerHTML={{ __html: aboutData.content }} />
              ) : (
                <div className="space-y-4">
                  <p>
                    Our school has been a cornerstone of educational excellence for over 50 years. We are committed to
                    providing a nurturing environment where students can grow academically, socially, and personally.
                  </p>
                  <p>
                    With state-of-the-art facilities, experienced faculty, and a comprehensive curriculum, we prepare
                    our students for success in an ever-changing world. Our approach combines traditional values with
                    innovative teaching methods.
                  </p>
                  <p>
                    We believe in developing well-rounded individuals who are not only academically proficient but also
                    possess strong character, leadership skills, and a sense of social responsibility.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <Image
              src={aboutData.image || "/placeholder.svg?height=500&width=600"}
              alt="School Building"
              width={600}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
