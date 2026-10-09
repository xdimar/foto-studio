"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, Shield, Sparkles, Check, ArrowRight } from "lucide-react";

export default function StudioSpaces() {
  const [activeTab, setActiveTab] = useState(0);

  const spaces = [
    {
      title: "Studio 01 — The Master Cyclorama",
      tagline: "Unrestricted Infinity Space for Monumental Fashion & Commercial Sets",
      image: "/images/studio-space.jpg",
      area: "180 m² (1,937 sq ft)",
      ceiling: "6.2m Clear Height",
      cove: "12m Width x 9m Depth Curved Cove",
      power: "63A 3-Phase Camlock",
      features: [
        "Motorized motorized truss system with Broncolor Scoro powerpacks",
        "Direct drive-in vehicle access roller door for automotive shoots",
        "Sound-damped acoustic treatment for synchronous sound recording",
        "Dedicated VIP client mezzanine overlooking production floor",
      ],
    },
    {
      title: "Studio 02 — The Daylight Loft",
      tagline: "Natural Sun-Drenched Editorial Environment with Raw Architectural Textures",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
      area: "140 m² (1,506 sq ft)",
      ceiling: "5.0m Exposed Timber Truss",
      cove: "North-Facing Floor-to-Ceiling Steel Mullions",
      power: "32A Single Phase Clean Power",
      features: [
        "Unfiltered natural diffuse light throughout the day",
        "Textured raw lime-wash walls, polished microcement & heritage brick",
        "Curated mid-century design furniture & sculptural pedestal props",
        "Integrated mobile hair & makeup styling station",
      ],
    },
    {
      title: "Studio 03 — The Noir Void & Lab",
      tagline: "Total Light Blackout & Analog Darkroom Chemistry Lab",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
      area: "110 m² (1,184 sq ft)",
      ceiling: "4.5m Matte Black Ceiling",
      cove: "360° Heavyweight Acoustic Velvet Drapes",
      power: "32A Clean Studio Power",
      features: [
        "100% light-seal blackout with high-contrast chiaroscuro capabilities",
        "Hasselblad Flextight optical drum scanner & archival negative lab",
        "High-output Rosco haze and atmospheric projection rigs",
        "Dedicated digital calibration suite with 4K HDR reference monitors",
      ],
    },
  ];

  const currentSpace = spaces[activeTab];

  return (
    <section id="spaces" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold block mb-3">
              FACILITIES & ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
              Designed for <span className="italic font-serif-italic font-normal">Uncompromised</span> Vision
            </h2>
          </div>

          {/* Space Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
            {spaces.map((space, idx) => (
              <button
                key={space.title}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`text-xs sm:text-sm font-mono tracking-wider uppercase py-2 px-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === idx
                    ? "border-[#720C10] text-white font-bold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                0{idx + 1} // {space.title.split("—")[1]?.trim() || space.title}
              </button>
            ))}
          </div>
        </div>

        {/* Space Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual Left */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/10 min-h-[380px] lg:min-h-[500px] bg-zinc-950">
            <Image
              src={currentSpace.image}
              alt={currentSpace.title}
              fill
              className="object-cover object-center transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#720C10] text-white">
                STUDIO SPECIFICATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium mt-2">
                {currentSpace.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light">
                {currentSpace.tagline}
              </p>
            </div>
          </div>

          {/* Details Right */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff6169] mb-4">
                TECHNICAL METRICS
              </p>

              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Usable Area</span>
                  <span className="text-base sm:text-lg font-serif text-white font-medium">{currentSpace.area}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Ceiling Height</span>
                  <span className="text-base sm:text-lg font-serif text-white font-medium">{currentSpace.ceiling}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Cyc / Aperture</span>
                  <span className="text-xs font-mono text-zinc-200 font-medium">{currentSpace.cove}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Electrical Rig</span>
                  <span className="text-xs font-mono text-[#ff6169] font-medium">{currentSpace.power}</span>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Key Architectural Features
                </p>
                <ul className="space-y-3">
                  {currentSpace.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-light">
                      <span className="w-4 h-4 rounded-full bg-[#720C10]/40 text-[#ff6169] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10">
              <a
                href="#booking"
                className="inline-flex items-center justify-between w-full px-5 py-3 rounded-full bg-white/5 hover:bg-[#720C10] border border-white/10 hover:border-[#720C10] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
                <span>Check Availability for {currentSpace.title.split("—")[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
