import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Computer Studies Organization (CSO) | ACLC College Mandaue City",
  description: "Official website and committee registration portal for the Computer Studies Organization (CSO) at ACLC College Mandaue City.",
  icons: {
    icon: "/imgs/CSOLOGO.png",
    shortcut: "/imgs/CSOLOGO.png",
    apple: "/imgs/CSOLOGO.png",
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
      <body className="min-h-full flex flex-col">{children}</body>

      <Analytics/>
      <SpeedInsights/>
      
    </html>
  );
}
