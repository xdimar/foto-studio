import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StudioBookingExperience from "@/components/StudioBookingExperience";
import { ArrowLeft, ShieldCheck, MapPin, Sparkles, Clock, Car, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Reservasi Sesi & Booking Studio",
  description:
    "Booking sesi Self Photo Studio mulai Rp 10.000 / 15 menit atau studio produksi profesional. Cek tanggal & slot jam real-time terhubung ke panel admin Origine Studio Malang.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Reservasi Sesi & Booking Studio | Origine Studio Malang",
    description:
      "Pilih paket Self Studio atau Studio Suite, tentukan durasi & jumlah orang, lalu jadwalkan tanggal dan jam sesi yang tersedia di Origine Studio.",
    url: "https://www.origine-studio.my.id/booking",
    images: [
      {
        url: "/images/studio-space.jpg",
        width: 1200,
        height: 630,
        alt: "Reservasi Sesi Studio Origine Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reservasi Sesi & Booking Studio | Origine Studio Malang",
    description: "Booking sesi Self Photo Studio dan studio produksi resmi Origine Studio Malang.",
    images: ["/images/studio-space.jpg"],
  },
};

function BookingPageSkeleton() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse space-y-8">
      <div className="h-20 rounded-2xl bg-white/5 border border-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-96 rounded-3xl bg-white/5 border border-white/5" />
        <div className="h-96 rounded-3xl bg-white/5 border border-white/5" />
      </div>
      <div className="h-64 rounded-3xl bg-white/5 border border-white/5" />
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] selection:bg-[#720C10] selection:text-white">
      {/* 1. FIXED TOP NAVBAR */}
      <Navbar />

      {/* 2. HEADER BANNER SECTION */}
      <section className="pt-28 sm:pt-36 pb-8 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Breadcrumbs */}
        <div className="mb-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1.5 px-4 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
          PORTAL RESERVASI & JADWAL RESMI • ORIGINE STUDIO
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-light tracking-tight">
          Reservasi Sesi & <span className="italic font-serif-italic font-normal">Jadwal Studio</span>
        </h1>
        <p className="mt-3.5 text-xs sm:text-sm text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
          Pilih paket studio pilihan Anda, atur durasi menit/jam dan jumlah orang, lalu jadwalkan tanggal dan jam sesi pemotretan yang masih tersedia.
        </p>

        {/* Feature Highlights Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Tersinkronisasi Real-Time ke Panel Admin
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Self Photo Studio Mulai Rp 10.000 / 15 Menit
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-[#ff6169]" />
            Jl. Raya Belung, Poncokusumo, Malang
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
            <Car className="w-3.5 h-3.5 text-sky-400" />
            Area Parkir Luas & Akses Nyaman
          </span>
        </div>
      </section>

      {/* 3. BESPOKE INTERACTIVE BOOKING PROGRESSION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Suspense fallback={<BookingPageSkeleton />}>
          <StudioBookingExperience />
        </Suspense>
      </main>

      {/* 4. FOOTER NOTE */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-8 text-center text-xs font-mono text-zinc-500">
        <p>Origine Studio • Jl. Raya Belung, Belung, Kec. Poncokusumo, Kabupaten Malang, Jawa Timur 65157</p>
        <p className="mt-2 text-[10px] text-zinc-600">
          Hak Cipta © 2026 Origine Studio Malang. Terhubung langsung ke Panel Kontrol Admin.
        </p>
      </footer>
    </div>
  );
}
