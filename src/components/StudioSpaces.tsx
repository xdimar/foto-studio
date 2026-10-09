"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function StudioSpaces() {
  const [activeTab, setActiveTab] = useState(0);

  const spaces = [
    {
      title: "Studio 01 — Cyclorama Utama",
      tagline: "Ruang Tanpa Batas untuk Set Fashion Monumental & Kampanye Komersial",
      image: "/images/studio-space.jpg",
      area: "180 m² (1.937 sq ft)",
      ceiling: "Tinggi Bersih 6,2m",
      cove: "Lengkung Lebar 12m x Kedalaman 9m",
      power: "Listrik 3-Fase Camlock 63A",
      features: [
        "Sistem motorized truss dengan powerpack pencahayaan Broncolor Scoro",
        "Akses pintu roller drive-in langsung untuk pemotretan kendaraan & otomotif",
        "Perlakuan akustik kedap suara untuk perekaman audio produksi sinkron",
        "Mezanin VIP privat untuk klien dengan pemandangan langsung ke lantai produksi",
      ],
    },
    {
      title: "Studio 02 — Loft Cahaya Alami",
      tagline: "Lingkungan Editorial Alami Disinari Matahari dengan Tekstur Arsitektur Mentah",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
      area: "140 m² (1.506 sq ft)",
      ceiling: "Rangka Kayu Ekspos 5,0m",
      cove: "Jendela Baja Utara Lantai ke Plafon",
      power: "Daya Bersih Fase Tunggal 32A",
      features: [
        "Cahaya alami baur (diffuse) lembut yang konsisten sepanjang hari",
        "Dinding kapur mentah bertekstur, microcement poles & bata bersejarah",
        "Furnitur pilihan desain abad pertengahan & properti pedestal seni rupa",
        "Stasiun tata rias dan penataan rambut bergerak terintegrasi",
      ],
    },
    {
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

  const currentSpace = spaces[activeTab];

  return (
    <section id="spaces" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold block mb-3">
              FASILITAS & ARSITEKTUR
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
              Dirancang untuk <span className="italic font-serif-italic font-normal">Visi Tanpa Kompromi</span>
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
                SPESIFIKASI STUDIO
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
                METRIK TEKNIS
              </p>

              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Area Luas</span>
                  <span className="text-base sm:text-lg font-serif text-white font-medium">{currentSpace.area}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Tinggi Plafon</span>
                  <span className="text-base sm:text-lg font-serif text-white font-medium">{currentSpace.ceiling}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Lengkung Cyc</span>
                  <span className="text-xs font-mono text-zinc-200 font-medium">{currentSpace.cove}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Rig Listrik</span>
                  <span className="text-xs font-mono text-[#ff6169] font-medium">{currentSpace.power}</span>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Fitur Arsitektur Utama
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
                <span>Cek Ketersediaan {currentSpace.title.split("—")[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
