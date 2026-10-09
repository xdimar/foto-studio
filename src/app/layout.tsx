import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FotoStudio - Profesional Photography Studio",
  description: "Studio fotografi profesional dengan layanan terbaik untuk setiap momen berharga Anda",
  keywords: "studio foto, fotografi profesional, foto pernikahan, foto keluarga, foto produk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
