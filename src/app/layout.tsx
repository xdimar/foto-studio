import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif-italic",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Origine Studio — Studio Foto Kreatif & Atelier Visual",
  description: "Fotografi editorial haute couture, potret seni rupa, dan produksi visual komersial oleh Origine Creative Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${syne.variable} ${playfair.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] selection:bg-[#720C10] selection:text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
