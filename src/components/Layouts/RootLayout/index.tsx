"use client";

import HeaderRootLayout from "./Header";
import Footer from "./Footer";
import "swiper/css";
import "swiper/css/navigation";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  if (pathname.startsWith("/dang-nhap") || pathname.startsWith("/dang-ki")) {
    return (
      <div className="max-w-[1000px] w-full bg-[#5B5B5B] text-black mx-auto">
        {children}
      </div>
    );
  }
  return (
    <div className="w-full bg-[#5B5B5B] text-black">
      <div className="w-full max-w-screen-sm mx-auto flex flex-col min-h-screen">
        <HeaderRootLayout />
        {children}
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
