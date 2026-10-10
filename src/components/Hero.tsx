"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import StorySection from "@/components/StorySection";

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
  const [activeMood, setActiveMood] = useState<"editorial" | "studio" | "portrait">("editorial");

  const moodImages = {
    editorial: "/images/hero-fashion.jpg",
    studio: "/images/studio-space.jpg",
    portrait: "/images/portrait-art.jpg",
  };

  const moodLabels = [
    { key: "editorial", label: "Editorial Mode Tinggi" },
    { key: "studio", label: "Ruang Cyclorama Studio" },
    { key: "portrait", label: "Chiaroscuro Seni Rupa" },
  ] as const;

  return (
    <StorySection
      id="hero"
      variant="hero"
      className="min-h-screen flex flex-col justify-between pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0d0d0d]"
    >
      {({ leftClass, rightClass, headerClass }) => (
        <>
          {/* Background Ambience & Subtle Grain */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(114,12,16,0.22),rgba(255,255,255,0))] pointer-events-none" />
          <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />

          {/* Decorative vertical editorial guide lines */}
          <div className="hidden lg:block absolute left-12 top-0 bottom-0 w-[1px] bg-white/[0.04] pointer-events-none" />
          <div className="hidden lg:block absolute right-12 top-0 bottom-0 w-[1px] bg-white/[0.04] pointer-events-none" />

          {/* Main Hero Container */}
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto relative z-10">
            {/* TOP BADGE */}
            <div
              className={`flex flex-wrap items-center gap-3 mb-6 sm:mb-8 transition-all duration-700 ${
                isLoaded ? headerClass : "opacity-0 translate-y-4"
              }`}
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#720C10] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-zinc-200">
                  Timeless Memories From the Origine
                </span>
              </div>
              <span className="hidden sm:inline-block text-xs font-mono text-zinc-500 tracking-widest">
                {"// STUDIO FOTO EKSKLUSIF MALANG"}
              </span>
            </div>

            {/* HEADLINE EDITORIAL: Left = Kata-kata, Right = Gambar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Typography & Narrative (Kata-kata di KIRI) */}
              <div className={`lg:col-span-7 flex flex-col ${leftClass}`}>
                <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-[5.2rem] font-serif font-light text-white leading-[1.05] tracking-[-0.02em]">
                  Momen Abadi, <br />
                  <span className="italic font-serif-italic font-normal text-white/95">
                    Kemewahan Sinematik
                  </span>
                  <br />
                  <span className="text-2xl sm:text-4xl md:text-5xl font-sans font-light tracking-wide text-zinc-400 block mt-2">
                    di Alam Sejuk Poncokusumo.
                  </span>
                </h1>

                <p className="mt-6 sm:mt-8 text-base sm:text-lg text-zinc-300 font-light max-w-xl leading-relaxed">
                  Berlokasi di kawasan sejuk Jl. Raya Belung, Poncokusumo, Malang. Origine Studio adalah studio fotografi eksklusif yang memadukan keasrian alam perbukitan dengan presisi tata cahaya dan cyclorama modern untuk mengabadikan momen abadi Anda.
                </p>

                {/* CTAs & Micro Actions */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                  <Link
                    href="/booking"
                    className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl shadow-[#720C10]/30 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span>Reservasi Sesi Studio</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white transition-transform group-hover:scale-150" />
                  </Link>

                  <a
                    href="https://wa.me/6285196671398?text=Halo%20Kak%20Ratna,%20saya%20ingin%20tanya%20reservasi%20di%20Origine%20Studio%20Malang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] text-white text-sm font-medium tracking-wider uppercase transition-all duration-300"
                  >
                    <span>WhatsApp Owner</span>
                  </a>
                </div>

                {/* Studio Specs Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div>
                    <a
                      href="https://maps.app.goo.gl/XUjKjMeSeEBewEgq6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/map block hover:opacity-80 transition-opacity"
                      title="Buka lokasi di Google Maps"
                    >
                      <p className="font-syne text-xl sm:text-2xl font-bold text-white flex items-center gap-1">
                        <span>Malang</span>
                        <ArrowDown className="w-3.5 h-3.5 -rotate-135 text-[#e03a42] opacity-75 group-hover/map:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium mt-0.5 underline underline-offset-4 decoration-white/20">
                        Jl. Raya Belung (Maps)
                      </p>
                    </a>
                  </div>
                  <div>
                    <p className="font-syne text-xl sm:text-2xl font-bold text-white">12m</p>
                    <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                      Cyclorama Lengkung
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="font-syne text-xl sm:text-2xl font-bold text-[#e03a42]">Privat & Tenang</p>
                    <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                      Suasana Asri Pegunungan
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase (Gambar di KANAN) */}
              <div className={`lg:col-span-5 ${rightClass}`}>
                <div className="relative group mx-auto max-w-md lg:max-w-none">
                  {/* Outer Glow Halo */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#720C10]/40 to-transparent rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Main Image Frame */}
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl shadow-black/80 aspect-[4/5]">
                    <Image
                      src={moodImages[activeMood]}
                      alt={`Editorial Visual Studio Origine Malang — ${
                        moodLabels.find((m) => m.key === activeMood)?.label || 'Haute Couture Editorial'
                      }`}
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />

                    {/* Film Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Corner Camera Metadata Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/70 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-md border border-white/10">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#720C10]" />
                        ARSIP ORIGINE
                      </span>
                      <span>100 ISO • 90mm T2.0</span>
                    </div>

                    {/* Bottom Interactive Mood Selector */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                      <div className="flex items-center justify-between gap-1">
                        {moodLabels.map((m) => (
                          <button
                            key={m.key}
                            onClick={() => setActiveMood(m.key)}
                            type="button"
                            className={`px-2.5 py-1.5 rounded text-[10px] sm:text-[11px] font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                              activeMood === m.key
                                ? "bg-[#720C10] text-white shadow-md"
                                : "text-zinc-400 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {m.label.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Award/Client Badge */}
                  <div className="absolute -bottom-5 -left-4 sm:-left-6 p-4 rounded-xl glass-panel shadow-2xl flex items-center gap-3 border border-white/15">
                    <div className="w-10 h-10 rounded-full bg-[#720C10]/30 border border-[#720C10] flex items-center justify-center text-[#ff6169]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Tampil Di</p>
                      <p className="text-sm font-serif font-medium text-white">Vogue • Elle • Harper&apos;s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className={`max-w-7xl mx-auto w-full pt-10 flex items-center justify-between text-zinc-500 text-xs font-mono relative z-10 ${headerClass}`}>
            <span className="tracking-widest uppercase">Gulir untuk Menjelajah Cerita</span>
            <a
              href="#portfolio"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <span className="text-[11px] tracking-wider uppercase">Jelajahi Arsip Origine Studio</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#ff6169]" />
            </a>
          </div>
        </>
      )}
    </StorySection>
  );
}
