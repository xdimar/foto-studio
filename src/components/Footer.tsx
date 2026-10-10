"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OrigineLogo from "./OrigineLogo";
import { ArrowUp, ArrowUpRight, Clock, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import StorySection from "@/components/StorySection";
import { StudioContactSettings } from "@/lib/types";

interface FooterProps {
  onReplay?: () => void;
}

export default function Footer({ onReplay }: FooterProps) {
  const [timeStr, setTimeStr] = useState<string>("");
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

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (e) {
        console.error("Gagal mengambil kontak footer:", e);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to WIB (GMT+7)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTimeStr(new Intl.DateTimeFormat("id-ID", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <StorySection
      id="footer"
      variant="footer"
      className="bg-[#060606] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-zinc-400 overflow-hidden"
    >
      {({ containerClass }) => (
        <div className={`max-w-7xl mx-auto ${containerClass}`}>
          {/* Top Live Studio Atmosphere Bar */}
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 mb-16 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-xs font-mono">
                <span className="text-white font-semibold">STATUS STUDIO AKTIF</span>
                <span className="text-zinc-500 mx-2">•</span>
                <span className="text-zinc-400">Siap Melayani Reservasi Sesi & Sewa Cyclorama</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#ff6169]" />
                <span>WAKTU MALANG: <strong className="text-white font-mono">{timeStr || "10:00:00"} WIB</strong></span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#720C10]" />
                <span>PONCOKUSUMO, MALANG</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
            {/* Col 1 & 2: Brand & Studio Narrative */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-white text-3xl">
                <OrigineLogo />
              </div>
              <p className="text-sm font-light text-zinc-400 max-w-sm leading-relaxed">
                {settings.tagline} — Studio foto eksklusif di Malang untuk potret personal, wisuda, prewedding, editorial mode, dan produksi visual berkualitas tinggi.
              </p>
              <div className="flex items-center gap-4 text-zinc-300">
                <span className="text-xs font-mono tracking-widest text-[#e03a42] uppercase">
                  MALANG, JAWA TIMUR
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-xs font-mono text-zinc-500">EST. 2024</span>
              </div>
            </div>

            {/* Col 3: Story Navigation */}
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
                NAVIGASI UTAMA
              </p>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    01 // BERANDA UTAMA
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-white transition-colors">
                    02 // PORTOFOLIO LENGKAP
                  </Link>
                </li>
                <li>
                  <Link href="/spaces" className="hover:text-white transition-colors">
                    03 // SUITE STUDIO & CYC
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="hover:text-white transition-colors">
                    04 // TARIF & RESERVASI
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    05 // TENTANG KAMI
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-white transition-colors">
                    06 // KONTAK & LOKASI
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Studio Locations */}
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
                ALAMAT STUDIO
              </p>
              <div className="space-y-3 text-xs font-mono text-zinc-400">
                <div>
                  <p className="text-white font-medium">{settings.brandName || "Origine Studio"} Malang</p>
                  <p className="text-zinc-400 leading-relaxed mt-1">
                    {settings.addressLine1}, {settings.addressSubdistrict}, {settings.addressCity}
                  </p>
                </div>
                <div className="pt-1">
                  <a
                    href={settings.googleMapsUrl || "https://maps.app.goo.gl/XUjKjMeSeEBewEgq6"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#e03a42] hover:text-white transition-colors underline underline-offset-4"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 5: Production Concierge */}
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
                MEJA KONTAK LANGSUNG
              </p>
              <div className="space-y-2.5 text-xs font-mono text-zinc-400">
                <div>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "") || "6285196671398"}?text=Halo%20Admin,%20saya%20ingin%20tanya%20reservasi%20di%20Origine%20Studio%20Malang`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-[#e03a42] transition-colors flex items-center gap-1.5"
                  >
                    <span>{settings.phone || "+62 851-9667-1398"} (WhatsApp)</span>
                    <ArrowUpRight className="w-3 h-3 text-[#e03a42]" />
                  </a>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Admin Studio (Booking & Konsultasi)</p>
                </div>
                <p className="hover:text-white transition-colors">{settings.email || "contact@origine-studio.my.id"}</p>
                <p className="text-zinc-500">Buka Setiap Hari ({settings.operatingHours || "08:00 - 22:00 WIB"})</p>
              </div>

              {onReplay && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onReplay}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-[10px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#720C10] transition-colors cursor-pointer"
                  >
                    ↺ Putar Ulang Animasi Intro
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Credits & Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <p>© 2026 Origine Studio Malang (www.origine-studio.my.id). Seluruh Hak Dilindungi.</p>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
            >
              <span className="uppercase tracking-wider text-[11px]">Kembali ke Atas</span>
              <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-[#ff6169]" />
              </div>
            </button>
          </div>
        </div>
      )}
    </StorySection>
  );
}
