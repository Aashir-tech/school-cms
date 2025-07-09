"use client";

import { Spinner } from "@/components/ui/spinner";
import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { EventsSection } from "@/components/public/events-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { useHomeData } from "@/hooks/useHomeData";
import { useInitialPublicData } from "@/hooks/useInitialPublicData";

export default function HomePage() {
  const { loading: homeLoading, hero, about, events, testimonials } = useHomeData();
  const { isLoading: publicLoading } = useInitialPublicData();

  const isAppLoading = homeLoading || publicLoading;

  if (isAppLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
      <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection banners={hero} />
        <AboutSection aboutData={about} />
        <EventsSection events={events} />
        <TestimonialsSection testimonials={testimonials} />
      </main>
    </div>
  );
}
