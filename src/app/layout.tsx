import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/Toast";
import Providers from "@/app/providers";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.heart-blooming.site"),
  title: "마음 꽃집",
  description: "따뜻한 가정의 달에만 열리는 마음 꽃집",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "마음 꽃집",
    description: "따뜻한 가정의 달에만 열리는 마음 꽃집",
    url: "https://www.heart-blooming.site",
    siteName: "마음 꽃집",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "마음 꽃집 — 따뜻한 가정의 달에만 열리는 마음 꽃집",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마음 꽃집",
    description: "따뜻한 가정의 달에만 열리는 마음 꽃집",
    images: ["/images/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
