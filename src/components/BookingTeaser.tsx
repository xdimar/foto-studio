"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Clock, MessageCircle, CreditCard, ChevronRight } from "lucide-react";
import StorySection from "@/components/StorySection";

export default function BookingTeaser() {
  const [selectedSuiteIdx, setSelectedSuiteIdx] = useState(0);
  const [durationMode, setDurationMode] = useState<"half" | "full">("half");

  const suites = [
    {
      code: "CYC-01",
      name: "Studio 01: Cyclorama Utama",
      tagline: "Set Monumental 12m & Editorial Mode",
      halfDayRate: "Rp 2.500.000",
      fullDayRate: "Rp 4.500.000",
      halfHours: "4 Jam Sesi",
      fullHours: "8 Jam Sesi Penuh",
      features: [
        "Motorized Overhead Truss Broncolor Scoro",
        "Akses Pintu Roller Drive-in Kendaraan",
        "Kapasitas Daya Industri 3-Fase 63A",
        "Stasiun Rias MUA VIP Ber-AC & Mezanin Klien",
      ],
      badge: "Paling Populer",
      color: "border-[#720C10] bg-[#720C10]/10",
    },
    {
      code: "LOFT-02",
      name: "Studio 02: Loft Cahaya Alami",
      tagline: "Pencahayaan Matahari Arah Utara",
      halfDayRate: "Rp 1.800.000",
      fullDayRate: "Rp 3.200.000",
      halfHours: "4 Jam Sesi",
      fullHours: "8 Jam Sesi Penuh",
      features: [
        "Jendela Baja Utara 5m Langit-ke-Lantai",
        "Dinding Kapur Mentah & Lantai Microcement",
        "Koleksi Properti Furnitur Abad Pertengahan",
        "Pencahayaan Difus Alami Konstan Tanpa Bayang Keras",
      ],
      badge: "Favorit Editorial",
      color: "border-white/10 bg-white/[0.02]",
    },
    {
      code: "NOIR-03",
      name: "Studio 03: Ruang Noir & Lab Analog",
      tagline: "Total Blackout 100% & Lab Analog",
      halfDayRate: "Rp 1.500.000",
      fullDayRate: "Rp 2.800.000",
      halfHours: "4 Jam Sesi",
      fullHours: "8 Jam Sesi Penuh",
      features: [
        "Tirai Beludru 360° Kedap Cahaya Sempurna",
        "Mesin Kabut Asap Sinematik Rosco",
        "Scanner Drum Hasselblad Flextight Archival",
        "Monitor Kalibrasi Warna 4K HDR Profesional",
      ],
      badge: "Eksklusif Chiaroscuro",
      color: "border-white/10 bg-white/[0.02]",
    },
  ];

  const currentSuite = suites[selectedSuiteIdx];

  return (
    <StorySection
      id="booking"
      variant="rates"
      className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
    >
      {({ leftClass, rightClass, headerClass }) => (
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10 mb-14 ${headerClass}`}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
                04 // TARIF STUDIO & RESERVASI
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
                Transparansi Tarif untuk <span className="italic font-serif-italic font-normal">Karya Terbaik</span>
              </h2>
            </div>

            {/* Duration Switcher (Setengah Hari vs Seharian Penuh) */}
            <div className="flex items-center p-1 rounded-full bg-black/60 border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setDurationMode("half")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  durationMode === "half"
                    ? "bg-[#720C10] text-white font-semibold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Setengah Hari (4 Jam)
              </button>
              <button
                type="button"
                onClick={() => setDurationMode("full")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  durationMode === "full"
                    ? "bg-[#720C10] text-white font-semibold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Seharian Penuh (8 Jam)
              </button>
            </div>
          </div>

          {/* STORYTELLING TWO-COLUMN: Kartu/Estimator di KIRI, Tulisan/Narasi di KANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT COLUMN: Interactive Suite Rate Cards (Gambar/Kartu di KIRI) */}
            <div className={`lg:col-span-6 ${leftClass}`}>
              <div className="space-y-4">
                {/* Suite Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {suites.map((st, idx) => (
                    <button
                      key={st.code}
                      type="button"
                      onClick={() => setSelectedSuiteIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSuiteIdx === idx
                          ? "border-[#ff6169] bg-[#720C10]/20 text-white shadow-lg"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span className="text-[10px] font-mono block text-[#ff6169]">{st.code}</span>
                      <span className="text-xs font-serif font-medium line-clamp-1 mt-0.5">{st.name.split(":")[1]?.trim() || st.name}</span>
                    </button>
                  ))}
                </div>

                {/* Main Active Pricing Feature Card */}
                <div className="relative rounded-2xl glass-panel border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden bg-[#121212]/90">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#720C10]/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#720C10] text-white font-semibold">
                      {currentSuite.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      IDR • Transparan & All-In
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif text-white font-medium">
                    {currentSuite.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-light">
                    {currentSuite.tagline}
                  </p>

                  {/* Rate Display */}
                  <div className="my-6 p-5 rounded-xl bg-black/60 border border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Tarif Sesi Terpilih</span>
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-white text-[#ff6169]">
                        {durationMode === "half" ? currentSuite.halfDayRate : currentSuite.fullDayRate}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      / {durationMode === "half" ? currentSuite.halfHours : currentSuite.fullHours}
                    </span>
                  </div>

                  {/* Included Amenities Checklist */}
                  <div className="space-y-2.5 text-xs text-zinc-300 font-light">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                      Fasilitas Sudah Termasuk (All-in):
                    </p>
                    {currentSuite.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6169] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Card Action */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>DP Retainer 50%</span>
                    </div>

                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105"
                    >
                      <span>Pilih Suite Ini</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Value Story & Booking Guarantees (Tulisan di KANAN) */}
            <div className={`lg:col-span-6 flex flex-col justify-center ${rightClass}`}>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#720C10] font-bold mb-3">
                INTEGRITAS & PROFESIONALISME
              </span>

              <h3 className="text-3xl sm:text-4xl font-serif text-white font-light leading-tight">
                Karya Berkualitas <br />
                Dimulai dari <span className="italic font-serif-italic font-normal">Kenyamanan Sesi</span>.
              </h3>

              <p className="mt-5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                Kami memahami bahwa sesi foto yang sukses membutuhkan dukungan teknis tanpa cela. Setiap tarif sewa di Origine Studio Malang sudah mencakup bantuan kru teknis persiapan tata cahaya, ruangan privat ber-AC dengan meja rias MUA luas, serta kestabilan pasokan listrik industri 3-fase agar lampu flash Anda meletup konsisten dari awal hingga akhir sesi.
              </p>

              {/* Guarantees Box */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">Garansi Slot</h4>
                  <p className="text-xs text-zinc-400 font-light mt-1">Jadwal Anda langsung terkunci di kalender admin real-time setelah DP.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#720C10]/20 text-[#ff6169] flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">Fleksibilitas Waktu</h4>
                  <p className="text-xs text-zinc-400 font-light mt-1">Dapat memilih slot sesi pagi, siang, atau malam hingga pukul 22:00 WIB.</p>
                </div>
              </div>

              {/* Direct WhatsApp Concierge Link */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <Link
                  href="/booking"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#720C10]/30 hover:scale-105"
                >
                  <span>Buka Estimator Lengkap</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="https://wa.me/6285196671398?text=Halo%20Kak%20Ratna,%20saya%20ingin%20tanya%20tarif%20dan%20ketersediaan%20sesi%20di%20Origine%20Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Tanya WhatsApp Kasir</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </StorySection>
  );
}
