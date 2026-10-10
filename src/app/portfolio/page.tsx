"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import OrigineLogo from "@/components/OrigineLogo";
import { ArrowLeft, ArrowUpRight, Eye, X, Sparkles, Filter, Camera } from "lucide-react";
import { StudioGalleryItem } from "@/lib/types";

// Default curated fallback if gallery database is still new
const fallbackPortfolio: StudioGalleryItem[] = [
  {
    id: "01",
    title: "Crimson Nocturne — Autumn/Winter Editorial",
    category: "Editorial",
    imageUrl: "/images/hero-fashion.jpg",
    client: "Vogue Archive Special",
    photographer: "Ratna Kusuma & Origine Studio",
    date: "2026-10-01",
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "02",
    title: "The Cyclorama Horizon — Architecture & Space",
    category: "Studio Space",
    imageUrl: "/images/studio-space.jpg",
    client: "Origine Studio Architecture",
    photographer: "Aditya Pratama",
    date: "2026-09-25",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    id: "03",
    title: "Sovereign Chiaroscuro — Fine Art Portraiture",
    category: "Portrait",
    imageUrl: "/images/portrait-art.jpg",
    client: "Fine-Art Private Commission",
    photographer: "Ratna Kusuma",
    date: "2026-09-18",
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "04",
    title: "Velvet Eclipse — High-Fashion Campaign",
    category: "Editorial",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    client: "Harper's Bazaar Couture",
    photographer: "Origine Studio Team",
    date: "2026-09-10",
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "05",
    title: "Sculpted Monolith — Executive Editorial",
    category: "Portrait",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    client: "GQ Gentlemen Profile",
    photographer: "Bima Arya",
    date: "2026-08-30",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: "06",
    title: "Aura Luminescence — Fragrance & Beauty",
    category: "Commercial",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    client: "Maison De Parfum Campaign",
    photographer: "Origine Commercial Unit",
    date: "2026-08-20",
    featured: true,
    aspectRatio: "portrait",
  },
  {
    id: "07",
    title: "Ephemeral Solitude — French Lookbook",
    category: "Editorial",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    client: "L'Officiel Lookbook Archive",
    photographer: "Ratna Kusuma",
    date: "2026-08-15",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: "08",
    title: "Lembayung Bromo — Prewedding Seri Poncokusumo",
    category: "Portrait",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    client: "Arya & Karina",
    photographer: "Bima Arya",
    date: "2026-10-02",
    featured: true,
    aspectRatio: "portrait",
  },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<StudioGalleryItem[]>(fallbackPortfolio);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<StudioGalleryItem | null>(null);

  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedPhoto(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [selectedPhoto]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success && data.gallery && data.gallery.length > 0) {
          // Merge dynamic database items with fallback to provide a rich visual showcase
          const dbItems = data.gallery;
          const merged = [...dbItems];
          fallbackPortfolio.forEach((f) => {
            if (!merged.some((m) => m.imageUrl === f.imageUrl)) {
              merged.push(f);
            }
          });
          setItems(merged);
        }
      } catch (err) {
        console.warn("Using curated fallback gallery items", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = [
    { key: "all", label: "Semua Karya" },
    { key: "Editorial", label: "Editorial Fashion" },
    { key: "Portrait", label: "Potret & Prewedding" },
    { key: "Fine Art", label: "Fine Art" },
    { key: "Studio Space", label: "Fasilitas Studio" },
    { key: "Commercial", label: "Komersial" },
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#F9F8F6] selection:bg-[#720C10] selection:text-white">
      {/* 1. UNIFIED PREMIUM NAVBAR */}
      <Navbar />

      {/* 2. PAGE HERO TITLE */}
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
              ARSIP VISUAL TERKURASI • ORIGINE STUDIO MALANG
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-white font-light tracking-tight leading-[1.1]">
              Portofolio & <span className="italic font-serif-italic font-normal">Koleksi Karya</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
              Jelajahi dokumentasi pemotretan editorial haute couture, potret seni rupa, prewedding pegunungan, serta kampanye komersial yang diproduksi di Origine Studio Malang.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Camera className="w-4 h-4 text-[#ff6169]" />
            <span>{filteredItems.length} Karya Terpilih</span>
          </div>
        </div>

        {/* 3. CATEGORY FILTERS */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                activeCategory.toLowerCase() === cat.key.toLowerCase()
                  ? "bg-[#720C10] text-white font-bold shadow-md shadow-[#720C10]/30"
                  : "bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. MASONRY PHOTO GRID */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <div className="py-24 text-center font-mono text-xs text-zinc-500">
            Memuat arsip portofolio studio...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-24 text-center font-mono text-xs text-zinc-500">
            Tidak ada karya untuk kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-[#720C10] cursor-pointer transition-all duration-500 hover:-translate-y-1 shadow-2xl"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={item.imageUrl.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-[#720C10] text-white">
                        Unggulan
                      </span>
                    )}
                  </div>

                  {/* Hover Inspect Icon */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4" />
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169]">
                      {item.client || "Origine Studio"}
                    </p>
                    <h3 className="text-lg font-serif text-white font-medium line-clamp-1 mt-0.5">
                      {item.title}
                    </h3>
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>{item.photographer || "Tim Studio"}</span>
                      <span>{item.date ? item.date.split("-")[0] : "2026"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. BOTTOM INVITATION BANNER */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#161616] via-[#121212] to-[#720C10]/20 border border-white/10 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
              KOLABORASI KREATIF
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-white font-medium">
              Wujudkan Visi Visual Anda Bersama Origine
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Dari set editorial busana, potret wisuda eksklusif, hingga kampanye komersial, studio kami siap memberikan pengalaman produksi yang tenang dan presisi.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xl shadow-[#720C10]/30 hover:scale-105"
              >
                <span>Mulai Reservasi Sesi & Cek Slot</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6285196671398?text=Halo%20Kak%20Ratna,%20saya%20tertarik%20dengan%20karya%20di%20portofolio%20Origine%20Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>Konsultasi Konsep via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#121212] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#720C10] transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Frame */}
            <div className="relative w-full lg:w-2/3 h-[50vh] lg:h-[75vh] bg-black">
              <Image
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 66vw"
                unoptimized={selectedPhoto.imageUrl.startsWith("http")}
              />
            </div>

            {/* Modal Info Panel */}
            <div className="w-full lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-[#141414] overflow-y-auto">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#720C10]/30 text-[#ff6169] border border-[#720C10]/50">
                  {selectedPhoto.category}
                </span>

                <h3 className="mt-4 text-xl sm:text-2xl font-serif text-white font-medium">
                  {selectedPhoto.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light">
                  Klien / Proyek: <span className="text-white font-medium">{selectedPhoto.client || "Origine Studio"}</span>
                </p>

                <div className="mt-6 space-y-3 pt-6 border-t border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block">Pengarah & Fotografer</span>
                    <span className="text-zinc-200">{selectedPhoto.photographer || "Origine Studio Team"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block">Tanggal Produksi</span>
                    <span className="text-zinc-200">{selectedPhoto.date || "2026"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block">Lokasi Studio</span>
                    <span className="text-zinc-200">Jl. Raya Belung, Poncokusumo, Malang</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href="/booking"
                  onClick={() => setSelectedPhoto(null)}
                  className="w-full py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <span>Reservasi Sesi Serupa</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
