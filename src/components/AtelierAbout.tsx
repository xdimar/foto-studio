"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Award, ShieldCheck, HeartHandshake } from "lucide-react";

export default function AtelierAbout() {
  const clients = [
    "VOGUE",
    "HARPER'S BAZAAR",
    "ELLE",
    "GQ",
    "L'OFFICIEL",
    "CARTIER",
    "CHANEL",
    "SAINT LAURENT",
  ];

  return (
    <section id="about" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-zinc-900 shadow-2xl">
              <Image
                src="/images/hero-fashion.jpg"
                alt="Origine Studio Atelier Vision"
                fill
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider">
                  The Origine Ethos
                </p>
                <p className="text-sm font-serif italic text-white mt-1">
                  &ldquo;We treat light as physical matter—shaping shadow to reveal the unspoken essence.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold mb-3">
              THE CREATIVE ATELIER
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight leading-[1.15]">
              Where Precision Optics <br />
              Meet <span className="italic font-serif-italic font-normal">Haute Couture</span> Art.
            </h2>

            <p className="mt-6 text-zinc-300 font-light leading-relaxed text-sm sm:text-base">
              Origine Studio operates at the intersection of avant-garde visual experimentation and uncompromising commercial execution. With facilities in central Jakarta and the coastal sanctuaries of Bali, we host international luxury brands, fashion editorial publications, and world-renowned creative directors.
            </p>

            <p className="mt-4 text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
              Our spaces are custom-engineered from the ground up: complete acoustic isolation, floating precision cycloramas, digital tethering bays, and an analog silver-halide darkroom for purists who demand film authenticity.
            </p>

            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono">
              <div>
                <p className="text-2xl font-bold text-white font-syne">14+</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Global Awards</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-syne">350+</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Campaigns Realized</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-[#e03a42] font-syne">2 Locations</p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">Jakarta & Bali</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Roster Marquee / Grid */}
        <div className="mt-24 pt-12 border-t border-white/10">
          <p className="text-center text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 mb-8">
            TRUSTED BY HOUSES OF CULTURE & LUXURY
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
    </section>
  );
}
