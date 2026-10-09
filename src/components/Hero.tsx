"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, Camera, Compass, Layers, ShieldCheck } from "lucide-react";

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
    { key: "studio", label: "Ruang Cyclorama Atelier" },
    { key: "portrait", label: "Chiaroscuro Seni Rupa" },
  ] as const;

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0d0d0d]">
      {/* Background Ambience & Subtle Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(114,12,16,0.22),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />

      {/* Decorative vertical editorial guide line */}
      <div className="hidden lg:block absolute left-12 top-0 bottom-0 w-[1px] bg-white/[0.04] pointer-events-none" />
      <div className="hidden lg:block absolute right-12 top-0 bottom-0 w-[1px] bg-white/[0.04] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto">
        {/* TOP BADGE: Staggered reveal */}
        <div
          className="flex items-center gap-3 mb-6 sm:mb-8 transition-all duration-700"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(25px)",
            transitionDelay: "0.2s",
          }}
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#720C10] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-zinc-300">
              Studio Fotografi Kreatif • Jakarta & Bali
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-zinc-600 tracking-widest">
            // ARSIP VOL. 24
          </span>
        </div>

        {/* HEADLINE EDITORIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-7 flex flex-col">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl xl:text-[5.2rem] font-serif font-light text-white leading-[1.05] tracking-[-0.02em] transition-all duration-700"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(35px)",
                transitionDelay: "0.35s",
              }}
            >
              Memahat <span className="italic font-serif-italic text-zinc-300 font-normal">Cahaya</span>,
              <br />
              Mengabadikan <span className="font-syne font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#720C10]">Esensi</span>.
            </h1>

            <p
              className="mt-6 sm:mt-8 text-base sm:text-lg text-zinc-400 font-light max-w-xl leading-relaxed transition-all duration-700"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "0.5s",
              }}
            >
              Origine adalah atelier kreatif eksklusif untuk kampanye editorial mode tinggi,
              potret seni rupa (fine-art), dan sinematografi komersial. Dilengkapi cyclorama tanpa batas
              dan tata cahaya Broncolor kelas dunia.
            </p>

            {/* CTAs & Micro Actions */}
            <div
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5 transition-all duration-700"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(25px)",
                transitionDelay: "0.65s",
              }}
            >
              <a
                href="#booking"
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl shadow-[#720C10]/30 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Reservasi Sesi Studio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white transition-transform group-hover:scale-150" />
              </a>

              <a
                href="#portfolio"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] text-white text-sm font-medium tracking-wider uppercase transition-all duration-300"
              >
                <Compass className="w-4 h-4 text-zinc-400" />
                <span>Jelajahi Karya</span>
              </a>
            </div>

            {/* Studio Specs Bar */}
            <div
              className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6 transition-all duration-700"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "0.8s",
              }}
            >
              <div>
                <p className="font-syne text-xl sm:text-2xl font-bold text-white">12m</p>
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                  Cyclorama Lengkung
                </p>
              </div>
              <div>
                <p className="font-syne text-xl sm:text-2xl font-bold text-white">150 MP</p>
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                  Format Menengah Phase One
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-syne text-xl sm:text-2xl font-bold text-[#e03a42]">Broncolor</p>
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                  Sistem Pencahayaan Scoro
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div
            className="lg:col-span-5 transition-all duration-1000"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
              transitionDelay: "0.5s",
            }}
          >
            <div className="relative group mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#720C10]/40 to-transparent rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Main Image Frame */}
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl shadow-black/80 aspect-[4/5]">
                <Image
                  src={moodImages[activeMood]}
                  alt="Editorial Studio Origine"
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
                        onClick={() => setActiveMood(m.key as any)}
                        type="button"
                        className={`px-2.5 py-1.5 rounded text-[10px] sm:text-[11px] font-medium tracking-wider uppercase transition-all duration-200 ${
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
      <div
        className="max-w-7xl mx-auto w-full pt-10 flex items-center justify-between text-zinc-500 text-xs font-mono transition-opacity duration-700"
        style={{
          opacity: isLoaded ? 1 : 0,
          transitionDelay: "0.9s",
        }}
      >
        <span className="tracking-widest uppercase">Gulir untuk Menjelajah</span>
        <a
          href="#portfolio"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <span className="text-[11px] tracking-wider uppercase">Jelajahi Arsip Atelier</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
