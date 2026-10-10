"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Award } from "lucide-react";
import StorySection from "@/components/StorySection";
import { StudioAboutContent } from "@/lib/types";

const defaultClients = [
  "VOGUE",
  "HARPER'S BAZAAR",
  "ELLE",
  "GQ",
  "L'OFFICIEL",
  "CARTIER",
  "CHANEL",
  "SAINT LAURENT",
];

export default function StudioAbout() {
  const [clients, setClients] = useState<string[]>(defaultClients);
  const [storyParagraph1, setStoryParagraph1] = useState(
    "Origine Studio beroperasi pada titik temu antara keindahan estetika visual abadi dan eksekusi fotografi profesional berstandar tertinggi. Berakar di ketenangan Jl. Raya Belung, Poncokusumo, Malang, studio kami menjadi ruang istimewa untuk mengabadikan momen personal, portofolio editorial, potret keluarga, hingga produksi visual jenama terkemuka."
  );
  const [storyParagraph2, setStoryParagraph2] = useState(
    "Fasilitas kami dirancang khusus: cyclorama lengkung presisi, tata cahaya studio profesional, area rias privat, serta atmosfer pegunungan Malang yang sejuk dan menenangkan bagi setiap klien."
  );
  const [ethosQuote, setEthosQuote] = useState(
    "Kami memperlakukan cahaya sebagai materi fisik—membentuk bayangan untuk mengungkap esensi sejati."
  );

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data.success && data.about) {
          const ab: StudioAboutContent = data.about;
          if (ab.storyParagraph1) setStoryParagraph1(ab.storyParagraph1);
          if (ab.storyParagraph2) setStoryParagraph2(ab.storyParagraph2);
          if (ab.ethosQuote) setEthosQuote(ab.ethosQuote);
          if (Array.isArray(ab.clientBrands) && ab.clientBrands.length > 0) {
            setClients(ab.clientBrands);
          }
        }
      } catch (e) {
        console.error("Gagal mengambil profil studio di beranda:", e);
      }
    }
    loadAbout();
  }, []);

  return (
    <StorySection
      id="about"
      variant="about"
      className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] border-t border-white/5 overflow-hidden"
    >
      {({ leftClass, rightClass, headerClass }) => (
        <div className="max-w-7xl mx-auto">
          {/* STORYTELLING TWO-COLUMN: Tulisan di KIRI, Gambar di KANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT COLUMN: Narrative & Philosophy (Tulisan di KIRI) */}
            <div className={`lg:col-span-6 flex flex-col justify-center ${leftClass}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-4 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
                05 // TENTANG KAMI & FILOSOFI
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight leading-[1.15]">
                Saat Presisi Optik <br />
                Bertemu Seni <span className="italic font-serif-italic font-normal">Haute Couture</span>.
              </h2>

              <p className="mt-6 text-zinc-300 font-light leading-relaxed text-sm sm:text-base">
                {storyParagraph1}
              </p>

              <p className="mt-4 text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
                {storyParagraph2}
              </p>

              {/* Numerical Milestones */}
              <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono">
                <div>
                  <p className="text-2xl font-bold text-white font-syne">100%</p>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Dedikasi Kualitas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-syne">500+</p>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Klien Terabadikan</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-2xl font-bold text-[#e03a42] font-syne">Malang</p>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Jl. Raya Belung</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-zinc-400 font-mono">Kenali filosofi, lokasi Malang, & seniman di balik lensa kami.</p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
                >
                  <span>Kisah & Tim Kami</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6169]" />
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: Visual Portrait & Creative Ethos (Gambar di KANAN) */}
            <div className={`lg:col-span-6 relative ${rightClass}`}>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-zinc-900 shadow-2xl">
                <Image
                  src="/images/hero-fashion.jpg"
                  alt="Visi Origine Studio Malang"
                  fill
                  className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Floating Ethos Box */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    Etos Kreatif Origine Studio
                  </p>
                  <p className="text-sm font-serif italic text-white mt-1">
                    &ldquo;{ethosQuote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Roster Marquee / Grid */}
          <div className={`mt-24 pt-12 border-t border-white/10 ${headerClass}`}>
            <p className="text-center text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 mb-8">
              DIPERCAYA OLEH RUMAH MODE & MERK MEWAH INTERNASIONAL
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60">
              {clients.map((client) => (
                <span
                  key={client}
                  className="font-serif tracking-[0.25em] text-sm sm:text-base text-zinc-300 hover:text-white hover:opacity-100 transition-all cursor-default"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </StorySection>
  );
}
