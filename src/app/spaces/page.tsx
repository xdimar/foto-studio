"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import OrigineLogo from "@/components/OrigineLogo";
import { StudioSpaceItem } from "@/lib/types";
import {
  ArrowLeft,
  ArrowUpRight,
  Maximize2,
  Zap,
  CheckCircle2,
  Wind,
  Layers,
  Sparkles,
  ShieldCheck,
  Coffee,
  Car,
  Wifi,
} from "lucide-react";

interface StudioDetail {
  id: string;
  number: string;
  name: string;
  tagline: string;
  image: string;
  secondaryImage: string;
  area: string;
  ceiling: string;
  cove: string;
  power: string;
  idealFor: string[];
  equipmentIncluded: string[];
  features: string[];
  hourlyRate: string;
}

const studiosData: StudioDetail[] = [
  {
    id: "studio-01",
    number: "01",
    name: "Cyclorama Utama",
    tagline: "Ruang Monumental Tanpa Batas untuk Kampanye Komersial, Fashion Couture & Produksi Otomotif",
    image: "/images/studio-space.jpg",
    secondaryImage: "/images/hero-fashion.jpg",
    area: "180 m² (1.937 sq ft)",
    ceiling: "Tinggi Bersih 6,2 meter",
    cove: "Lengkung Lebar 12m x Kedalaman 9m",
    power: "Listrik 3-Fase Camlock 63 Ampere",
    hourlyRate: "Rp 350.000 / jam",
    idealFor: [
      "Editorial Mode & Kampanye Brand Internasional",
      "Foto Grup Besar, Wisuda Keluarga & Paduan Suara",
      "Produksi Video Komersial & Musik Klip",
      "Pemotretan Otomotif (Mobil / Moge Masuk Studio)",
    ],
    equipmentIncluded: [
      "4x Broncolor Siros 800 S WiFi Flash Heads",
      "1x Broncolor Para 220 FB Reflector Giant Softbox",
      "Motorized Overhead Ceiling Pantograph System",
      "Kabel Audio XLR & Wireless PA System",
    ],
    features: [
      "Pintu roller drive-in langsung berukuran 3,5 x 4 meter untuk akses kendaraan",
      "Mezanin VIP ber-AC untuk klien dengan pandangan bird-eye ke lantai produksi",
      "Dinding kedap suara akustik bersertifikasi studio rekaman",
      "Lantai cor epoxy putih gloss tinggi tahan beban berat dan mudah dibersihkan",
    ],
  },
  {
    id: "studio-02",
    number: "02",
    name: "Loft Cahaya Alami",
    tagline: "Kehangatan Matahari Alami Berpadu dengan Tekstur Arsitektural Mentah & Furnitur Abad Pertengahan",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    area: "140 m² (1.506 sq ft)",
    ceiling: "Rangka Kayu Ekspos 5,0 meter",
    cove: "Jendela Baja Gaya Industrial Menghadap Utara",
    power: "Daya Bersih Fase Tunggal 32 Ampere",
    hourlyRate: "Rp 275.000 / jam",
    idealFor: [
      "Foto Prewedding Romantis & Intimate Couple",
      "Potret Personal & Maternity Bernuansa Hangat",
      "Lookbook Busana Muslimah, Kebaya & Casual Chic",
      "Konten Visual Produk Beauty & Skincare",
    ],
    equipmentIncluded: [
      "2x Profoto D2 1000 AirTTL High-Speed Sync",
      "2x Profoto Softbox RFi 3x4' & Strip 1x4'",
      "Koleksi Tirai Linen Putih Sheer Diffuser Otomatis",
      "Reflector Jumbo Lastolite 2x1m Silver/White",
    ],
    features: [
      "Paparan cahaya alami utara (North Light) yang stabil tanpa panas menyengat",
      "Kombinasi dinding microcement poles, bata ekspos klasik, dan plester kapur artisanal",
      "Koleksi kursi desainer abad pertengahan (Mid-Century Modern) & pedestal seni",
      "Area rias semi-privat dengan cermin LED daylight 5500K CRI 98",
    ],
  },
  {
    id: "studio-03",
    number: "03",
    name: "Ruang Noir & Lab Kamar Gelap",
    tagline: "Total Light-Isolation untuk Drama Chiaroscuro Ekstrem, Seni Lukis Cahaya & Arsip Analog",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1400&auto=format&fit=crop",
    secondaryImage: "/images/portrait-art.jpg",
    area: "110 m² (1.184 sq ft)",
    ceiling: "Langit-langit Hitam Matte 4,5 meter",
    cove: "Tirai Beludru Akustik 360° Penyekat Cahaya",
    power: "Daya Bersih Studio Terisolasi 32 Ampere",
    hourlyRate: "Rp 225.000 / jam",
    idealFor: [
      "Fine-Art Portraiture & Chiaroscuro Klasik",
      "Cover Album Musik, Artis & Teatrikal",
      "Fotografi Monokrom Hitam Putih Abadi",
      "Proyeksi Visual Sinematik & Efek Asap Atmosferis",
    ],
    equipmentIncluded: [
      "3x Aputure LS 600d Pro Daylight LED (Continuous Light)",
      "1x Aputure Spotlight Mount dengan Shutter Blades",
      "Mesin Kabut Asap Atmosferis Rosco Vapour",
      "Set Flag & Floppy Floppy Frame 40x40 Solid Black",
    ],
    features: [
      "100% kedap cahaya eksternal untuk kontrol rasio kontras rasional mutlak",
      "Tirai beludru hitam keliling 360 derajat untuk penyerapan pantulan cahaya sempurna",
      "Laboratorium cetak klise film analog kamar gelap terintegrasi",
      "Monitor referensi warna 4K HDR terkalibrasi Eizo ColorEdge untuk tethering real-time",
    ],
  },
];

export default function SpacesPage() {
  const [studios, setStudios] = useState<StudioDetail[]>(studiosData);
  const [selectedStudio, setSelectedStudio] = useState<string>("studio-01");

  useEffect(() => {
    async function loadSpaces() {
      try {
        const res = await fetch("/api/spaces");
        const data = await res.json();
        if (data.success && Array.isArray(data.spaces) && data.spaces.length > 0) {
          const mapped: StudioDetail[] = data.spaces
            .filter((sp: StudioSpaceItem) => sp.isActive !== false)
            .map((sp: StudioSpaceItem) => ({
              id: sp.id,
              number: sp.number,
              name: sp.name,
              tagline: sp.tagline,
              image: sp.image,
              secondaryImage: sp.secondaryImage || sp.image,
              area: sp.area,
              ceiling: sp.ceiling,
              cove: sp.cove,
              power: sp.power,
              hourlyRate: sp.hourlyRate,
              idealFor: sp.idealFor || [],
              equipmentIncluded: sp.equipmentIncluded || [],
              features: sp.features || [],
            }));
          if (mapped.length > 0) {
            setStudios(mapped);
            if (!mapped.some((s) => s.id === selectedStudio)) {
              setSelectedStudio(mapped[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat data ruang studio:", err);
      }
    }
    loadSpaces();
  }, []);

  const currentStudio = studios.find((s) => s.id === selectedStudio) || studios[0] || studiosData[0];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] selection:bg-[#720C10] selection:text-white">
      {/* 1. UNIFIED PREMIUM NAVBAR */}
      <Navbar />

      {/* 2. HERO PAGE BANNER */}
      <section className="pt-28 sm:pt-32 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
              ARSITEKTUR & RUANG STUDIO ORIGINE
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-light tracking-tight">
              Tiga Ruang Visual <span className="italic font-serif-italic font-normal">Tanpa Batas</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
              Dirancang dengan presisi akustik, kelenturan tata cahaya, dan privasi penuh di kawasan asri Malang untuk mendukung ekspresi visual paling ambisius Anda.
            </p>
          </div>

          {/* Quick Studio Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-x-auto">
            {studios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStudio(s.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedStudio === s.id
                    ? "bg-[#720C10] text-white font-semibold shadow-lg shadow-[#720C10]/40"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Studio {s.number}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE DETAIL CURRENT STUDIO */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Visual Showcase (Images) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-zinc-950 shadow-2xl">
              <Image
                src={currentStudio.image}
                alt={currentStudio.name}
                fill
                className="object-cover object-center transition-all duration-700"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#720C10] text-white">
                  STUDIO {currentStudio.number} — ORIGINE STUDIO
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-white font-medium mt-2">
                  {currentStudio.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light max-w-xl">
                  {currentStudio.tagline}
                </p>
              </div>
            </div>

            {/* Secondary Snapshot & Atmosphere */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-zinc-900">
                <Image
                  src={currentStudio.secondaryImage}
                  alt="Atmosfer Produksi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                  <span className="text-[11px] font-mono text-zinc-200 uppercase tracking-wider">
                    Karakter Tata Cahaya
                  </span>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider mb-1">
                    Tarif Dasar Sewa
                  </p>
                  <p className="text-2xl sm:text-3xl font-serif text-white font-medium">
                    {currentStudio.hourlyRate}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">
                    Termasuk operator asisten studio & listrik daya penuh
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <Link
                    href={`/booking?studio=${currentStudio.id}`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-white hover:text-[#ff6169] uppercase tracking-wider transition-colors"
                  >
                    <span>Cek Slot di Kalender</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs & Inclusions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dimension Matrix Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff6169] mb-5">
                METRIK TEKNIS & KAPASITAS
              </p>

              <div className="grid grid-cols-2 gap-5 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Total Area</span>
                  <span className="text-lg font-serif text-white font-medium">{currentStudio.area}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Tinggi Plafon</span>
                  <span className="text-lg font-serif text-white font-medium">{currentStudio.ceiling}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Spesifikasi Cove</span>
                  <span className="text-xs font-mono text-zinc-200 font-medium">{currentStudio.cove}</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">Daya Listrik</span>
                  <span className="text-xs font-mono text-[#ff6169] font-medium">{currentStudio.power}</span>
                </div>
              </div>

              {/* Peruntukan Ideal */}
              <div className="pt-6">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 mb-3">
                  Sangat Ideal Untuk
                </p>
                <ul className="space-y-2.5">
                  {currentStudio.idealFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light">
                      <span className="w-4 h-4 rounded-full bg-[#720C10]/40 text-[#ff6169] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Peralatan Termasuk */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 mb-3">
                  Peralatan Master Termasuk
                </p>
                <ul className="space-y-2.5">
                  {currentStudio.equipmentIncluded.map((eq, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6169] shrink-0 mt-1.5" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Booking Button */}
              <div className="pt-8 mt-6 border-t border-white/10">
                <Link
                  href={`/booking?studio=${currentStudio.id}`}
                  className="w-full py-4 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#720C10]/30 hover:scale-[1.02]"
                >
                  <span>Reservasi Studio {currentStudio.number} Sekarang</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE FACILITIES & AMENITIES */}
      <section className="py-20 px-4 sm:px-8 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff6169] block mb-2">
              KENYAMANAN TANPA KOMPROMI
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-light">
              Fasilitas Pendukung Produksi
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-3">
              Setiap sesi sewa mencakup akses penuh ke fasilitas pendukung premium kami untuk memastikan kenyamanan kru, talent, dan klien VIP Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#720C10]/20 text-[#ff6169] flex items-center justify-center mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-white font-medium mb-1">
                Lounge Klien & Coffee Bar
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Ruang santai privat dengan sajian kopi artisanal lokal Malang, teh herbal, dan air mineral tak terbatas untuk kru dan klien Anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#720C10]/20 text-[#ff6169] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-white font-medium mb-1">
                Fitting Room & Vanity Rias
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Stasiun make-up terpisah dengan pencahayaan daylight CRI 98, steamer busana uap bertekanan tinggi, dan gantungan baju beroda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#720C10]/20 text-[#ff6169] flex items-center justify-center mb-4">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-white font-medium mb-1">
                Akses Loading Bay & Parkir
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Area parkir luas hingga 10+ mobil dan loading bay datar tanpa tangga untuk kemudahan bongkar-muat koper peralatan lighting berat.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#720C10]/20 text-[#ff6169] flex items-center justify-center mb-4">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-white font-medium mb-1">
                Wi-Fi Fiber Optic 300 Mbps
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Koneksi internet dedicated berkecepatan tinggi untuk live tethering client streaming, upload cloud langsung, dan koordinasi tim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#181818] to-[#101010] border border-white/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
              Siap Memulai <span className="italic font-serif-italic font-normal">Produksi Anda?</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Jadwalkan survei lokasi fisik atau langsung amankan tanggal pemotretan Anda melalui portal reservasi online resmi kami.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xl shadow-[#720C10]/40 hover:scale-105"
              >
                Reservasi Studio Sekarang
              </Link>
              <a
                href="https://wa.me/6285196671398?text=Halo%20Kak%20Ratna,%20saya%20ingin%20tanya%20detail%20ruang%20studio%20Origine%20Malang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white text-xs font-mono uppercase tracking-wider transition-all"
              >
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL FOOTER */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-8 text-center text-xs font-mono text-zinc-500">
        <p>Origine Studio • Jl. Raya Belung, Belung, Kec. Poncokusumo, Kabupaten Malang, Jawa Timur 65157</p>
        <p className="mt-2 text-[10px] text-zinc-600">Hak Cipta © 2026 Origine Studio Malang. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
