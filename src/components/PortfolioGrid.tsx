"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, X, ArrowUpRight, Sparkles, Camera, Layers, Check } from "lucide-react";
import StorySection from "@/components/StorySection";

import { StudioGalleryItem } from "@/lib/types";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  aspect: string;
  client: string;
  gear: string;
  year: string;
  description: string;
}

const portfolioData: PortfolioItem[] = [
  {
    id: "01",
    title: "Crimson Nocturne — Editorial Mode Haute Couture",
    category: "Editorial",
    image: "/images/hero-fashion.jpg",
    aspect: "aspect-[3/4]",
    client: "Vogue Archive Special",
    gear: "Hasselblad H6D-100c • Broncolor Para 220 FB",
    year: "2024",
    description: "Eksplorasi drape kain wol premium berpadu siluet tegas dan tata cahaya chiaroscuro bernuansa crimson red khas Origine.",
  },
  {
    id: "02",
    title: "The Cyclorama Horizon — Arsitektur Ruang & Set",
    category: "Commercial",
    image: "/images/studio-space.jpg",
    aspect: "aspect-[16/10]",
    client: "Origine Studio Interior Architecture",
    gear: "Phase One IQ4 150MP • Profoto Pro-11",
    year: "2024",
    description: "Visualisasi cyclorama lengkung tanpa batas 12m dengan kemampuan menampung kendaraan roda empat serta produksi skala besar.",
  },
  {
    id: "03",
    title: "Sovereign Chiaroscuro — Potret Fine-Art & Karakter",
    category: "Portrait",
    image: "/images/portrait-art.jpg",
    aspect: "aspect-[3/4]",
    client: "Fine-Art Private Commission",
    gear: "Leica SL2-S • Summilux-SL 50mm f/1.4",
    year: "2024",
    description: "Menyingkap kedalaman karakter personal lewat bayangan tegas dan kontras lembut, menghasilkan potret pusaka keluarga bernilai tinggi.",
  },
  {
    id: "04",
    title: "Velvet Eclipse — Kampanye Musim Gugur",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    client: "Harper's Bazaar Couture",
    gear: "Phase One XF • Schneider Kreuznach 80mm LS",
    year: "2024",
    description: "Kolaborasi mode internasional dengan nuansa pencahayaan atmosferis, mempertegas tekstur beludru mewah dan gestur dramatis.",
  },
  {
    id: "05",
    title: "Monochrome Solitude — Seni Rupa Kontemporer",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    client: "Private Collectors",
    gear: "Hasselblad 907X 50C • XCD 45mm",
    year: "2024",
    description: "Gradasi hitam-putih murni yang menyorot ekspresi otentik tanpa distraksi warna, dicetak pada kertas katun museum archival.",
  },
  {
    id: "06",
    title: "L'Heure Dorée — Prewedding & Lanskap Poncokusumo",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[16/10]",
    client: "Origine Bridal Couture",
    gear: "Sony A1 • FE 50mm f/1.2 GM",
    year: "2024",
    description: "Kehangatan cahaya keemasan fajar pegunungan Malang membingkai momen cinta abadi sebelum melangkah ke jenjang pernikahan.",
  },
];

export default function PortfolioGrid() {
  const [items, setItems] = useState<PortfolioItem[]>(portfolioData);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadDynamicGallery() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success && Array.isArray(data.gallery) && data.gallery.length > 0) {
          const dbItems: PortfolioItem[] = data.gallery.map((g: StudioGalleryItem, index: number) => ({
            id: g.id || `db-${index}`,
            title: g.title || "Karya Origine Studio",
            category: g.category || "Editorial",
            image: g.imageUrl || "/images/hero-fashion.jpg",
            aspect: g.aspectRatio === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]",
            client: g.client || "Origine Studio Collection",
            gear: g.photographer ? `Fotografer: ${g.photographer}` : "Leica & Hasselblad Master Rig",
            year: g.date ? g.date.slice(0, 4) : "2026",
            description: `Arsip visual resmi Origine Studio Malang kategori ${g.category || "Editorial"}.`,
          }));

          // Merge: dbItems on top, keep fallback items that aren't duplicates
          const merged = [...dbItems];
          portfolioData.forEach((fallback) => {
            if (!merged.some((m) => m.image === fallback.image)) {
              merged.push(fallback);
            }
          });

          setItems(merged);
        }
      } catch (e) {
        console.error("Gagal memuat galeri beranda:", e);
      }
    }
    loadDynamicGallery();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((item) => item.category))).filter((c) => c !== "All"),
  ];

  const filteredItems = (
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase())
  );

  const activeItem = filteredItems[selectedIdx] || filteredItems[0] || items[0] || portfolioData[0];

  useEffect(() => {
    setSelectedIdx(0);
  }, [activeCategory]);

  return (
    <StorySection
      id="portfolio"
      variant="portfolio"
      className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
    >
      {({ leftClass, rightClass, headerClass }) => (
        <div className="max-w-7xl mx-auto">
          {/* Section Header Track */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10 mb-14 ${headerClass}`}>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-[#720C10] font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-[#720C10]" />
                02 // ARSIP TERKURASI 2024
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
                Karya <span className="italic font-serif-italic font-normal">Terpilih</span> & Arsip Visual
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#720C10] text-white font-semibold shadow-lg shadow-[#720C10]/30"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  {cat === "All" ? "Semua Kurasi" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* STORYTELLING TWO-COLUMN: Gambar di KIRI, Tulisan di KANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT COLUMN: Gallery Visual & Thumbnail Carousel (Gambar di KIRI) */}
            <div className={`lg:col-span-7 ${leftClass}`}>
              <div className="space-y-4">
                {/* Main Visual Display Frame */}
                <div
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[4/5] shadow-2xl shadow-black/80 cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                  title="Klik untuk melihat resolusi penuh"
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Film Badges */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 uppercase text-[10px] tracking-wider">
                      {activeItem.category}
                    </span>
                    <button
                      type="button"
                      className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 group-hover:text-white group-hover:bg-[#720C10] transition-colors border border-white/10"
                      aria-label="Lihat foto penuh"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Image Caption Bar */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169]">
                      {activeItem.client}
                    </p>
                    <p className="text-base sm:text-lg font-serif text-white font-medium line-clamp-1 mt-0.5">
                      {activeItem.title}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-2">
                      <Camera className="w-3 h-3 text-[#ff6169]" />
                      <span>{activeItem.gear}</span>
                    </p>
                  </div>
                </div>

                {/* Interactive Thumbnail Strip */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 pt-2">
                  {filteredItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIdx(idx)}
                      type="button"
                      className={`relative aspect-[4/5] rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${
                        selectedIdx === idx
                          ? "border-[#ff6169] ring-2 ring-[#720C10] scale-105 opacity-100"
                          : "border-white/10 opacity-50 hover:opacity-90 hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 25vw, 12vw"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Storytelling Narrative & Editorial Details (Tulisan di KANAN) */}
            <div className={`lg:col-span-5 flex flex-col justify-center ${rightClass}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono tracking-wider uppercase text-zinc-400 mb-4 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6169]" />
                <span>FILOSOFI KURASI</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif text-white font-light leading-tight">
                Merangkai Cerita <br />
                Lewat <span className="italic font-serif-italic font-normal">Bayangan & Cahaya</span>.
              </h3>

              <p className="mt-5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                Setiap karya di Origine Studio lahir dari percakapan mendalam antara karakter subjek dan tata pencahayaan presisi. Kami menolak pendekatan foto pabrikan masal—setiap jepretan dipahat menggunakan modifier pencahayaan studio berstandar internasional demi mengabadikan esensi murni Anda.
              </p>

              {/* Active Item Curated Story Card */}
              <div className="mt-8 p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Karya Aktif</span>
                  <span className="text-[#ff6169] font-bold text-[10px]">ID: {activeItem.id} // {activeItem.year}</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs sm:text-sm font-light leading-relaxed italic">
                  &ldquo;{activeItem.description}&rdquo;
                </p>
                <div className="pt-2 text-[11px] text-zinc-400 space-y-1">
                  <p><strong className="text-zinc-200">Klien / Lembaga:</strong> {activeItem.client}</p>
                  <p><strong className="text-zinc-200">Kamera & Lensa:</strong> {activeItem.gear}</p>
                </div>
              </div>

              {/* Actions & Deep Dive */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#720C10]/30 hover:scale-105"
                >
                  <span>Jelajahi Galeri Lengkap</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Reservasi Konsep Serupa</span>
                </Link>
              </div>
            </div>
          </div>

          {/* LIGHTBOX MODAL */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-[#720C10] text-white transition-colors cursor-pointer z-50"
                aria-label="Tutup pratinjau"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="max-w-4xl w-full bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-[4/5] sm:aspect-[16/10] bg-zinc-950">
                  <Image
                    src={activeItem.image}
                    alt={activeItem.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff6169]">
                      {activeItem.category} • {activeItem.client}
                    </span>
                    <h4 className="text-xl font-serif text-white mt-1">{activeItem.title}</h4>
                    <p className="text-xs font-mono text-zinc-400 mt-1">{activeItem.gear}</p>
                  </div>
                  <Link
                    href="/booking"
                    className="px-6 py-2.5 rounded-full bg-[#720C10] text-white text-xs font-mono uppercase tracking-wider font-semibold shrink-0 text-center hover:bg-[#8e1015] transition-colors"
                  >
                    Booking Sesi Ini
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </StorySection>
  );
}
