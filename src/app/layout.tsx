import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ScrollReset from "@/components/ScrollReset";

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

const BASE_URL = "https://www.origine-studio.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Origine Studio Malang — Timeless Memories From the Origine",
    template: "%s | Origine Studio Malang",
  },
  description:
    "Timeless Memories From the Origine. Studio foto profesional & studio visual di Jl. Raya Belung, Poncokusumo, Malang. Layanan cyclorama raksasa, portrait wisuda, prewedding, editorial mode, dan produksi komersial berstandar internasional.",
  keywords: [
    "Origine Studio",
    "Origine Studio Malang",
    "Studio Foto Malang",
    "Foto Studio Poncokusumo",
    "Cyclorama Studio Malang",
    "Foto Wisuda Malang",
    "Prewedding Malang",
    "Editorial Photography Malang",
    "Sewa Studio Foto Malang",
    "Fotografer Malang Profesional",
    "Studio Foto Belung Poncokusumo",
  ],
  authors: [{ name: "Ratna Kusuma & Origine Studio Team", url: BASE_URL }],
  creator: "Origine Studio",
  publisher: "Origine Studio Malang",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Origine Studio Malang",
    title: "Origine Studio Malang — Timeless Memories From the Origine",
    description:
      "Studio foto eksklusif & sewa ruang cyclorama di Poncokusumo, Malang. Abadikan potret wisuda, prewedding, dan editorial haute couture dengan tata cahaya sinematik standar dunia.",
    images: [
      {
        url: "/images/studio-space.jpg",
        width: 1200,
        height: 630,
        alt: "Studio 01 Cyclorama Monumentil — Origine Studio Malang",
      },
      {
        url: "/images/hero-fashion.jpg",
        width: 1200,
        height: 800,
        alt: "Editorial Fashion Haute Couture — Origine Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Origine Studio Malang — Timeless Memories From the Origine",
    description:
      "Studio fotografi profesional di Jl. Raya Belung, Poncokusumo, Malang. Layanan foto portrait, wisuda, prewedding, & editorial mode berkualitas tinggi.",
    images: ["/images/studio-space.jpg"],
    creator: "@originestudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const studioSchema = {
  "@context": "https://schema.org",
  "@type": "PhotographyStudio",
  "@id": `${BASE_URL}/#studio`,
  name: "Origine Studio Malang",
  alternateName: "Origine Studio",
  url: BASE_URL,
  logo: `${BASE_URL}/icon.svg`,
  image: [
    `${BASE_URL}/images/studio-space.jpg`,
    `${BASE_URL}/images/hero-fashion.jpg`,
    `${BASE_URL}/images/portrait-art.jpg`,
  ],
  description:
    "Studio foto profesional dan ruang visual eksklusif di Jl. Raya Belung, Poncokusumo, Kabupaten Malang. Menyediakan fasilitas sewa cyclorama luas, potret wisuda personal, foto prewedding romantis, dan editorial mode berstandar internasional.",
  telephone: "+6285196671398",
  priceRange: "Rp 350.000 - Rp 4.500.000",
  currenciesAccepted: "IDR",
  paymentAccepted: "Cash, QRIS, Bank Transfer BCA",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Raya Belung, Belung",
    addressLocality: "Poncokusumo",
    addressRegion: "Jawa Timur",
    postalCode: "65157",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -8.0452,
    longitude: 112.7554,
  },
  hasMap: "https://maps.app.goo.gl/XUjKjMeSeEBewEgq6",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/origine.studio",
    "https://maps.app.goo.gl/XUjKjMeSeEBewEgq6",
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] selection:bg-[#720C10] selection:text-white font-sans overflow-x-clip">
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
