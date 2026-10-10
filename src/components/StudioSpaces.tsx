"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Maximize2, Shield } from "lucide-react";
import StorySection from "@/components/StorySection";
import { StudioSpaceItem } from "@/lib/types";

interface DisplaySpace {
  id?: string;
  number: string;
  title: string;
  tagline: string;
  image: string;
  area: string;
  ceiling: string;
  cove: string;
  power: string;
  features: string[];
}

const defaultSpaces: DisplaySpace[] = [
  {
    number: "01",
    title: "Studio 01 — Cyclorama Utama",
    tagline: "Ruang Tanpa Batas untuk Set Fashion Monumental & Produksi Otomotif",
    image: "/images/studio-space.jpg",
    area: "180 m² (1.937 sq ft)",
    ceiling: "Tinggi Bersih 6,2m",
    cove: "Lengkung Lebar 12m x Kedalaman 9m",
    power: "Listrik 3-Fase Camlock 63A",
    features: [
      "Sistem motorized truss dengan powerpack Broncolor Scoro",
      "Akses pintu roller drive-in langsung untuk pemotretan mobil/motor",
      "Perlakuan akustik kedap suara untuk perekaman video sinkron",
      "Mezanin VIP privat untuk klien dengan pemandangan ke lantai set",
    ],
  },
  {
    number: "02",
    title: "Studio 02 — Loft Cahaya Alami",
    tagline: "Lingkungan Editorial Alami Disinari Matahari dengan Tekstur Mentah",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    area: "140 m² (1.506 sq ft)",
    ceiling: "Rangka Kayu Ekspos 5,0m",
    cove: "Jendela Baja Utara Lantai ke Plafon",
    power: "Daya Bersih Fase Tunggal 32A",
    features: [
      "Cahaya alami baur (diffuse) lembut yang stabil sepanjang hari",
      "Dinding kapur mentah bertekstur, microcement poles & bata bersejarah",
      "Furnitur pilihan desain abad pertengahan & properti pedestal seni rupa",
      "Stasiun tata rias MUA dan penataan rambut bergerak terintegrasi",
    ],
  },
  {
    number: "03",
    title: "Studio 03 — Ruang Noir & Lab Kamar Gelap",
    tagline: "Ruang Gelap Total & Lab Kimia Kamar Gelap Analog",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
    area: "110 m² (1.184 sq ft)",
    ceiling: "Langit-langit Hitam Matte 4,5m",
    cove: "Tirai Beludru Akustik 360° Penyekat Cahaya",
    power: "Daya Studio Bersih 32A",
    features: [
      "100% kedap cahaya dengan kapabilitas chiaroscuro kontras tinggi",
      "Pemindai drum optik Hasselblad Flextight & lab arsip klise film",
      "Sistem mesin kabut asap atmosferis Rosco & rig proyeksi digital",
      "Suite kalibrasi digital khusus dengan monitor referensi warna 4K HDR",
    ],
  },
];

export default function StudioSpaces() {
  const [activeTab, setActiveTab] = useState(0);
  const [spaces, setSpaces] = useState<DisplaySpace[]>(defaultSpaces);

  useEffect(() => {
    async function loadSpaces() {
      try {
        const res = await fetch("/api/spaces");
        const data = await res.json();
        if (data.success && Array.isArray(data.spaces) && data.spaces.length > 0) {
          const mapped: DisplaySpace[] = data.spaces
            .filter((sp: StudioSpaceItem) => sp.isActive !== false)
            .map((sp: StudioSpaceItem) => ({
              id: sp.id,
              number: sp.number,
              title: sp.name.includes("—") ? sp.name : `Studio ${sp.number} — ${sp.name}`,
              tagline: sp.tagline,
              image: sp.image,
              area: sp.area,
              ceiling: sp.ceiling,
              cove: sp.cove,
              power: sp.power,
              features: sp.features || [],
            }));
          if (mapped.length > 0) {
            setSpaces(mapped);
          }
        }
      } catch (e) {
        console.error("Gagal mengambil ruang studio di beranda:", e);
      }
    }
    loadSpaces();
  }, []);

  const currentSpace = spaces[activeTab] || spaces[0] || defaultSpaces[0];

  return (
    <StorySection
      id="spaces"
      variant="spaces"
      className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] border-t border-white/5 overflow-hidden"
    >
      {({ leftClass, rightClass, headerClass }) => (
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10 mb-14 ${headerClass}`}>
            <div>
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold block mb-3">
                03 // FASILITAS & ARSITEKTUR
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
                Dirancang untuk <span className="italic font-serif-italic font-normal">Visi Tanpa Batas</span>
              </h2>
            </div>

            {/* Space Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
              {spaces.map((space, idx) => (
                <button
                  key={space.title}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`text-xs sm:text-sm font-mono tracking-wider uppercase py-2 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === idx
                      ? "border-[#720C10] text-white font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {space.number} {" // "} {space.title.split("—")[1]?.trim() || space.title}
                </button>
              ))}
            </div>
          </div>

          {/* STORYTELLING TWO-COLUMN: Tulisan di KIRI, Gambar di KANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT COLUMN: Narrative, Specifications & Features (Tulisan di KIRI) */}
            <div className={`lg:col-span-6 flex flex-col justify-center ${leftClass}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-wider uppercase text-[#ff6169] mb-4 w-fit">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>SUITE STUDIO {currentSpace.number}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif text-white font-medium leading-tight">
                {currentSpace.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                {currentSpace.tagline}
              </p>

              {/* Technical Specifications Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4 p-5 rounded-2xl glass-panel border border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Luas Area</span>
                  <span className="text-sm font-mono font-medium text-white mt-0.5 block">{currentSpace.area}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Tinggi Plafon</span>
                  <span className="text-sm font-mono font-medium text-white mt-0.5 block">{currentSpace.ceiling}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Lengkung / Jendela</span>
                  <span className="text-sm font-mono font-medium text-white mt-0.5 block">{currentSpace.cove}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Kapasitas Listrik</span>
                  <span className="text-sm font-mono font-medium text-white mt-0.5 block">{currentSpace.power}</span>
                </div>
              </div>

              {/* Core Features List */}
              <div className="mt-6 space-y-2.5">
                {currentSpace.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 font-light">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6169] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <Link
                  href="/spaces"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#720C10]/30 hover:scale-105"
                >
                  <span>Spesifikasi Lengkap Ruang</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cek Jadwal Suite Ini</span>
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: Architectural Visual Showcase (Gambar di KANAN) */}
            <div className={`lg:col-span-6 ${rightClass}`}>
              <div className="relative group mx-auto">
                {/* Glow Ambient Shadow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#720C10]/30 via-transparent to-[#720C10]/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
                  <Image
                    src={currentSpace.image}
                    alt={currentSpace.title}
                    fill
                    className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top Film Marker */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/80 backdrop-blur-md bg-black/50 px-3.5 py-1.5 rounded-lg border border-white/10">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#720C10]" />
                      ORIGINE SUITE {currentSpace.number}
                    </span>
                    <span>{currentSpace.area.split("(")[0]}</span>
                  </div>

                  {/* Bottom Overlay Label */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                    <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider">
                      TERSEDIA UNTUK DISEWA HARIAN / SETENGAH HARI
                    </p>
                    <p className="text-sm font-serif text-white mt-0.5">
                      Termasuk Kru Asisten Teknis, Ruang Rias MUA, & Akses Parkir Mobil Luas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </StorySection>
  );
}
