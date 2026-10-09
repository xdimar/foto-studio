"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Eye, X, Camera, Sliders, ArrowUpRight } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "Editorial" | "Portrait" | "Commercial";
  image: string;
  aspect: string;
  client: string;
  gear: string;
  year: string;
}

const portfolioData: PortfolioItem[] = [
  {
    id: "01",
    title: "Crimson Nocturne",
    category: "Editorial",
    image: "/images/hero-fashion.jpg",
    aspect: "aspect-[3/4]",
    client: "Vogue Archive Special",
    gear: "Hasselblad H6D-100c • Broncolor Para 220 FB",
    year: "2024",
  },
  {
    id: "02",
    title: "The Cyclorama Horizon",
    category: "Commercial",
    image: "/images/studio-space.jpg",
    aspect: "aspect-[16/10]",
    client: "Origine Atelier Interior Architecture",
    gear: "Phase One IQ4 150MP • Profoto Pro-11",
    year: "2024",
  },
  {
    id: "03",
    title: "Sovereign Chiaroscuro",
    category: "Portrait",
    image: "/images/portrait-art.jpg",
    aspect: "aspect-[3/4]",
    client: "Fine-Art Private Commission",
    gear: "Leica SL2-S • Summilux-SL 50mm f/1.4",
    year: "2024",
  },
  {
    id: "04",
    title: "Velvet Eclipse",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    client: "Harper's Bazaar Couture",
    gear: "Phase One XF • Schneider Kreuznach 80mm LS",
    year: "2024",
  },
  {
    id: "05",
    title: "Sculpted Monolith",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-square",
    client: "GQ Gentlemen Profile",
    gear: "Hasselblad 907X • XCD 90mm f/2.5",
    year: "2024",
  },
  {
    id: "06",
    title: "Aura Luminescence",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    client: "Maison De Parfum Global Campaign",
    gear: "Sony A7R V • G Master 85mm f/1.4",
    year: "2024",
  },
  {
    id: "07",
    title: "Ephemeral Solitude",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    client: "L'Officiel Paris Lookbook",
    gear: "Contax 645 • Zeiss Planar 80mm f/2 (Kodak Portra 400)",
    year: "2023",
  },
  {
    id: "08",
    title: "Architectural Silhouette",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    client: "Elle International Talents",
    gear: "Canon EOS R5 C • RF 50mm f/1.2L",
    year: "2024",
  },
];

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const categories = ["All", "Editorial", "Portrait", "Commercial"];

  const filteredItems =
    activeFilter === "All"
      ? portfolioData
      : portfolioData.filter((item) => item.category === activeFilter);

  return (
    <section id="portfolio" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      {/* Decorative Atelier Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#720C10]" />
              CURATED ARCHIVE 2024
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
              Selected <span className="italic font-serif-italic font-normal">Works</span> & Editions
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                  activeFilter === category
                    ? "bg-[#720C10] text-white shadow-lg shadow-[#720C10]/40 font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* MASONRY / EDITORIAL GRID */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer transition-all duration-500 hover:border-white/30 hover:-translate-y-1.5 shadow-xl shadow-black/40 ${
                idx === 1 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              onClick={() => setSelectedItem(item)}
            >
              {/* Media Container */}
              <div className={`relative w-full ${item.aspect} overflow-hidden bg-zinc-950`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Ambient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Corner Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-black/50 backdrop-blur-md text-white/80 border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Inspect Eye Icon on Hover */}
                <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Bottom Editorial Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                  <p className="text-[11px] font-mono tracking-widest text-[#e03a42] uppercase mb-1">
                    {item.client}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-serif text-white font-medium group-hover:text-zinc-100 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span className="truncate max-w-[200px]">{item.gear.split("•")[0]}</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#121212] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#720C10] transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Area */}
            <div className="relative w-full lg:w-2/3 h-[50vh] lg:h-[75vh] bg-black">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            {/* Modal Details Area */}
            <div className="w-full lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-[#141414]">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#720C10]/30 text-[#ff6169] border border-[#720C10]/50">
                  {selectedItem.category}
                </span>

                <h3 className="mt-4 text-2xl sm:text-3xl font-serif text-white font-medium">
                  {selectedItem.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-400 font-light">
                  Commissioned by <span className="text-white font-medium">{selectedItem.client}</span>. Produced within Origine Creative Atelier with bespoke cinematic lighting.
                </p>

                <div className="mt-8 space-y-4 pt-6 border-t border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block">Optics & Camera</span>
                    <span className="text-zinc-200 font-medium">{selectedItem.gear}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block">Production Year</span>
                    <span className="text-zinc-200">{selectedItem.year}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block">Location Atelier</span>
                    <span className="text-zinc-200">Origine Studio 01 (Cyclorama Suite)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href="#booking"
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <span>Book Similar Production</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
