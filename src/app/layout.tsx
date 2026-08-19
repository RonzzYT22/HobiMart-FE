import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "HOBBYCO — COLLECT • ENJOY • CONNECT",
  description: "Your Ultimate Hobby Destination. Collect trading cards, Gundam, figures & more. Trade with fellow collectors. Join HOBBYCO today!",
  keywords: ["hobby", "collectibles", "trading cards", "Gundam", "figures", "TCG", "hobby shop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FFF3E0] text-[#1A1A1A]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
