import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeApplier from "@/app/components/ThemeApplier";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NCS Traffic",
  description: "Real-time traffic monitoring for the Norwegian Continental Shelf",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeApplier />
        {children}
      </body>
    </html>
  );
}
