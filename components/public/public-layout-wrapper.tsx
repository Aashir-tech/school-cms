"use client";

import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

export function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <PublicHeader />}
      {children}
      {!isAdminRoute && <PublicFooter />}
    </>
  );
}
