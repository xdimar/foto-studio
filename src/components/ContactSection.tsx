"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import StorySection from "@/components/StorySection";
import { StudioContactSettings } from "@/lib/types";

export default function ContactSection() {
  const [settings, setSettings] = useState<StudioContactSettings>({
    brandName: "Origine Studio",
    tagline: "Timeless Memories From the Origine",
    phone: "+62 851-9667-1398",
    whatsappNumber: "6285196671398",
    email: "concierge@origine-studio.my.id",
    addressLine1: "Jl. Raya Belung, Belung",
    addressSubdistrict: "Kec. Poncokusumo",
    addressCity: "Kabupaten Malang, Jawa Timur 65157",
    googleMapsUrl: "https://maps.app.goo.gl/XUjKjMeSeEBewEgq6",
    operatingHours: "08:00 - 22:00 WIB",
    instagramHandle: "@originestudio",
  });

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState("Editorial & Mode");
  const [formMessage, setFormMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (e) {
        console.error("Gagal memuat kontak studio:", e);
      }
    }
    loadSettings();
  }, []);

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWA = settings.whatsappNumber.replace(/[^0-9]/g, "") || "6285196671398";
    const text =
      `Halo Tim ${settings.brandName || "Origine Studio"} Malang,\n\n` +
      `Saya ingin konsultasi pemotretan:\n` +
      `• Nama: ${formName || "Klien"}\n` +
      `• Kontak: ${formPhone || "-"}\n` +
      `• Kategori Layanan: ${formService}\n` +
      `• Rincian/Pesan: ${formMessage || "Ingin informasi ketersediaan jadwal dan konsep visual."}\n\n` +
      `Mohon informasi lebih lanjut. Terima kasih!`;

    window.open(
      `https://wa.me/${cleanWA}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsSent(true);
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <StorySection
      id="contact"
      variant="contact"
      className="py-28 px-4 sm:px-6 lg:px-8 bg-[#080808] border-t border-white/5 overflow-hidden"
    >
      {({ leftClass, rightClass, headerClass }) => (
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10 mb-14 ${headerClass}`}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
                06 // KONTAK & LOKASI STUDIO
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
                Konsultasikan <span className="italic font-serif-italic font-normal">Visi Pemotretan</span> Anda
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tim Konsultasi Siaga • Respons Cepat</span>
            </div>
          </div>

          {/* STORYTELLING TWO-COLUMN: Gambar/Lokasi di KIRI, Tulisan/Form di KANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* LEFT COLUMN: Atmosphere Visual, Location & Live Hours (Gambar di KIRI) */}
            <div className={`lg:col-span-6 space-y-6 ${leftClass}`}>
              {/* Studio Exterior Atmosphere Frame */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl group">
                <Image
                  src="/images/studio-space.jpg"
                  alt="Lokasi Origine Studio Malang di Jl. Raya Belung Poncokusumo"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Live Hours Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    BUKA HARI INI
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300">
                    {settings.operatingHours || "08:00 - 22:00 WIB"}
                  </span>
                </div>

                {/* Bottom Address Info on Image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-mono text-[#ff6169] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {settings.addressSubdistrict.toUpperCase() || "PONCOKUSUMO"}, MALANG
                  </p>
                  <p className="text-sm font-medium text-white mt-1">
                    {settings.addressLine1}, {settings.addressSubdistrict}, {settings.addressCity}
                  </p>
                </div>
              </div>

              {/* Direct Maps & Contact Quick Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={settings.googleMapsUrl || "https://maps.app.goo.gl/XUjKjMeSeEBewEgq6"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl glass-panel border border-white/10 hover:border-white/30 transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="w-5 h-5 text-[#ff6169]" />
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-medium text-white">Buka Google Maps</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Petunjuk navigasi & rute langsung</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "") || "6285196671398"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl glass-panel border border-white/10 hover:border-white/30 transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-medium text-white">{settings.phone || "+62 851-9667-1398"}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">WhatsApp Kasir & Pengarah Studio</p>
                  </div>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Story Narrative & Instant Inquiry Form (Tulisan di KANAN) */}
            <div className={`lg:col-span-6 flex flex-col justify-center ${rightClass}`}>
              <div className="glass-panel p-6 sm:p-9 rounded-2xl border border-white/10 shadow-2xl relative bg-[#121212]/90">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#720C10] font-bold mb-2 block">
                  KONSULTASI GRATIS
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium">
                  Rencanakan Sesi Pemotretan
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light leading-relaxed">
                  Isi formulir singkat di bawah untuk terhubung langsung dengan tim konseptual Origine Studio melalui pesan WhatsApp yang terstruktur.
                </p>

                <form onSubmit={handleSendWA} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Nama Lengkap / Jenama
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Contoh: Ratna / Maison Valois"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#720C10] focus:ring-1 focus:ring-[#720C10] text-sm text-white placeholder-zinc-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#720C10] focus:ring-1 focus:ring-[#720C10] text-sm text-white placeholder-zinc-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Pilihan Layanan
                    </label>
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 focus:border-[#720C10] text-sm text-white outline-none transition-all cursor-pointer"
                    >
                      <option value="Editorial & Mode Haute Couture">Editorial & Mode Haute Couture</option>
                      <option value="Sewa Ruang Cyclorama 180m²">Sewa Ruang Cyclorama 180m²</option>
                      <option value="Potret Wisuda & Keluarga Eksklusif">Potret Wisuda & Keluarga Eksklusif</option>
                      <option value="Prewedding Romantis Pegunungan">Prewedding Romantis Pegunungan</option>
                      <option value="Produksi Visual Komersial Jenama">Produksi Visual Komersial Jenama</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Rencana Tanggal / Konsep Sesi
                    </label>
                    <textarea
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Jelaskan kebutuhan jumlah orang, rencana tanggal, atau konsep tata cahaya..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#720C10] focus:ring-1 focus:ring-[#720C10] text-sm text-white placeholder-zinc-600 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-[#720C10]/40 hover:scale-[1.02] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>{isSent ? "Membuka WhatsApp..." : "Kirim Konsultasi ke WhatsApp"}</span>
                  </button>
                </form>

                {isSent && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pesan telah disusun dan diarahkan ke WhatsApp resmi!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </StorySection>
  );
}
