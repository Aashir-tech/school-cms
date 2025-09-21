import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { Suspense } from "react";
import { PublicLayoutWrapper } from "@/components/public/public-layout-wrapper"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School CMS",
  description: "Modern school content management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Suspense fallback={null}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

            <Providers>
              <AnalyticsTracker />
              <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
              <Toaster />
            </Providers>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
