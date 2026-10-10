"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Copy,
  CreditCard,
  MessageCircle,
  AlertTriangle,
  Clock,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import type { StudioRoomPricing, StudioAddon } from "@/lib/types";

interface StudioRoom {
  id: string;
  name: string;
  code: string;
  dimensions: string;
  baseRate: number; // half-day base price in IDR
  fullDayRate: number; // full-day price in IDR
  highlight: string;
}

const defaultRooms: StudioRoom[] = [
  {
    id: "room-01",
    name: "Studio 01: Cyclorama Utama",
    code: "CYC-01",
    dimensions: "180 m² • Cyclorama Lengkung 12m • Plafon 6,2m",
    baseRate: 2500000,
    fullDayRate: 4500000,
    highlight: "Dilengkapi motorized overhead truss Broncolor & powerpack Scoro berdaya tinggi.",
  },
  {
    id: "room-02",
    name: "Studio 02: Loft Cahaya Alami",
    code: "LOFT-02",
    dimensions: "140 m² • Jendela Baja Menghadap Utara 5m",
    baseRate: 1800000,
    fullDayRate: 3200000,
    highlight: "Cahaya matahari alami terbaur, dinding beton mentah bertekstur & properti seni rupa.",
  },
  {
    id: "room-03",
    name: "Studio 03: Ruang Noir & Chiaroscuro",
    code: "NOIR-03",
    dimensions: "110 m² • Beludru Akustik Kedap Cahaya 360°",
    baseRate: 1500000,
    fullDayRate: 2800000,
    highlight: "Kedap cahaya sempurna, boom pencahayaan presisi, dan sistem kabut asap sinematik.",
  },
];

interface AddonOption {
  id: string;
  name: string;
  price: number; // in IDR
  desc: string;
}

const defaultAddons: AddonOption[] = [
  {
    id: "broncolor-para",
    name: "Broncolor Scoro Powerpack + Para 220 FB",
    price: 650000,
    desc: "Reflektor parabolik 2,2m legendaris untuk sebaran cahaya lembut memeluk siluet.",
  },
  {
    id: "phase-one",
    name: "Kit Punggung Digital Phase One IQ4 150MP",
    price: 1200000,
    desc: "Termasuk lensa Schneider Kreuznach 45mm, 80mm & 150mm.",
  },
  {
    id: "digi-tech",
    name: "Master Operator Digital & Kalibrasi Warna Langsung",
    price: 450000,
    desc: "Operator tether khusus di lokasi dengan monitor referensi EIZO ColorEdge.",
  },
  {
    id: "hmu-suite",
    name: "Lounge VIP Tata Rias & Ruang Busana",
    price: 300000,
    desc: "Ruang rias privat 3 kursi dengan steamer busana dan gantungan pakaian desainer.",
  },
  {
    id: "analog-lab",
    name: "Pengembangan Film Analog 120/35mm di Lab Kimia",
    price: 350000,
    desc: "Pemrosesan manual C-41 & B&W di hari yang sama + pindai resolusi tinggi Hasselblad Flextight.",
  },
];

export default function BookingEstimator() {
  const [studioRooms, setStudioRooms] = useState<StudioRoom[]>(defaultRooms);
  const [addonOptions, setAddonOptions] = useState<AddonOption[]>(defaultAddons);

  const [selectedRoomId, setSelectedRoomId] = useState<string>("room-01");
  const [sessionDuration, setSessionDuration] = useState<"half" | "full">("full");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["broncolor-para"]);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>("Pagi (09:00 - 13:00 / 17:00)");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [createdBookingId, setCreatedBookingId] = useState<string>("ORG-2026-8849");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isSubmitted) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsSubmitted(false);
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
  }, [isSubmitted]);

  // Slot Availability & Conversion Payment States
  const [availableSlots, setAvailableSlots] = useState<Array<{
    id: string;
    name: string;
    isAvailable: boolean;
    bookedDetails: string;
  }>>([
    { id: "slot-morning", name: "Pagi (09:00 - 13:00 / 17:00)", isAvailable: true, bookedDetails: "Tersedia" },
    { id: "slot-afternoon", name: "Siang & Sore (14:00 - 18:00 / 22:00)", isAvailable: true, bookedDetails: "Tersedia" },
    { id: "slot-fullday", name: "Seharian Penuh (09:00 - 17:00)", isAvailable: true, bookedDetails: "Tersedia" },
  ]);
  const [isCheckingSlots, setIsCheckingSlots] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer" | "whatsapp">("qris");
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Sync with backend API
  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/pricing");
        const data = await res.json();
        if (data.success) {
          if (data.rooms && data.rooms.length > 0) {
            setStudioRooms(
              data.rooms.map((r: StudioRoomPricing) => ({
                id: r.id,
                name: r.name,
                code: r.code,
                dimensions: r.dimensions,
                baseRate: Number(r.halfDayPrice),
                fullDayRate: Number(r.fullDayPrice),
                highlight: r.description,
              }))
            );
          }
          if (data.addons && data.addons.length > 0) {
            setAddonOptions(
              data.addons.map((a: StudioAddon) => ({
                id: a.id,
                name: a.name,
                price: Number(a.price),
                desc: a.desc,
              }))
            );
          }
        }
      } catch {
        // Fallback to default IDR values
      }
    }
    loadPricing();
  }, []);

  // Real-time Slot Availability Check
  useEffect(() => {
    let isCancelled = false;
    async function checkAvailability() {
      if (!bookingDate) return;
      setIsCheckingSlots(true);
      try {
        const res = await fetch(
          `/api/bookings/availability?date=${bookingDate}&roomId=${selectedRoomId}`
        );
        const data = await res.json();
        if (!isCancelled && data.success && data.slots) {
          setAvailableSlots(data.slots);
        }
      } catch (err) {
        console.warn("Failed to check slot availability", err);
      } finally {
        if (!isCancelled) setIsCheckingSlots(false);
      }
    }
    checkAvailability();
    return () => {
      isCancelled = true;
    };
  }, [bookingDate, selectedRoomId]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const currentRoom = studioRooms.find((r) => r.id === selectedRoomId) || studioRooms[0];
  const roomBasePrice = sessionDuration === "half" ? currentRoom.baseRate : currentRoom.fullDayRate;

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = addonOptions.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = roomBasePrice + addonsTotal;
  const deposit = Math.round(subtotal * 0.5); // 50% Uang Muka DP

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const chosenAddonDetails = addonOptions
      .filter((a) => selectedAddons.includes(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName || "Klien Produser",
          clientEmail,
          clientPhone: clientPhone || "+628123456789",
          roomId: currentRoom.id,
          date: bookingDate,
          timeSlot,
          duration: sessionDuration,
          selectedAddons: chosenAddonDetails,
          notes: `Reservasi online dari web. Metode DP: ${
            paymentMethod === "qris" ? "QRIS Instan" : paymentMethod === "transfer" ? "Transfer Bank BCA" : "WhatsApp Kasir"
          }`,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setCreatedBookingId(data.booking.id);
      }
    } catch (err) {
      console.error("Booking submit fallback", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <section id="booking" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#720C10]/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff6169] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
            RESERVASI STUDIO & ESTIMATOR TARIF IDR
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
            Konfigurasi Sesi <span className="italic font-serif-italic font-normal">Produksi</span> Anda
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light">
            Pilih ruang studio di Malang, durasi waktu sesi, dan paket optik teknis pendukung.
            Kalkulasi biaya langsung transparan dalam Rupiah (IDR) tanpa biaya tersembunyi.
          </p>
        </div>

        {/* TWO-COLUMN CONFIGURATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Controls & Selections */}
          <div className="lg:col-span-7 space-y-10">
            {/* 1. SELECT STUDIO SUITE */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#720C10] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Pilih Ruang Studio
              </label>

              <div className="grid grid-cols-1 gap-3">
                {studioRooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  const priceDisplay = sessionDuration === "half" ? room.baseRate : room.fullDayRate;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-[#720C10]/15 border-[#720C10] shadow-lg shadow-[#720C10]/20"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-lg sm:text-xl text-white font-medium">
                              {room.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-zinc-300 uppercase">
                              {room.code}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-[#e03a42] mt-1">{room.dimensions}</p>
                          <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                            {room.highlight}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg sm:text-2xl font-serif text-white font-semibold">
                            {formatRupiah(priceDisplay)}
                          </p>
                          <span className="text-[10px] uppercase font-mono text-zinc-400">
                            {sessionDuration === "half" ? "4 Jam" : "8 Jam"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. DURATION TOGGLE */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#720C10] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Durasi Waktu Sesi
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSessionDuration("half")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    sessionDuration === "half"
                      ? "bg-[#720C10]/20 border-[#720C10] text-white"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <p className="font-serif text-base sm:text-lg font-medium text-white">Setengah Hari (4 Jam)</p>
                  <p className="text-xs text-zinc-400 mt-1">Ideal untuk lookbook mode & potret seni rupa</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionDuration("full")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 relative ${
                    sessionDuration === "full"
                      ? "bg-[#720C10]/20 border-[#720C10] text-white"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#720C10] text-white">
                    Direkomendasikan
                  </span>
                  <p className="font-serif text-base sm:text-lg font-medium text-white">Satu Hari Penuh (8 Jam)</p>
                  <p className="text-xs text-zinc-400 mt-1">Kampanye editorial lengkap & set komersial</p>
                </button>
              </div>
            </div>

            {/* 3. TECHNICAL & PRODUCTION ADD-ONS */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#720C10] text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Paket Tambahan Alat Teknis Master
              </label>

              <div className="space-y-2.5">
                {addonOptions.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? "bg-white/[0.06] border-white/30 text-white"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isChecked ? "bg-[#720C10] text-white" : "border border-zinc-600 bg-transparent"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{addon.name}</p>
                          <p className="text-xs text-zinc-500 font-light">{addon.desc}</p>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-medium text-emerald-400 shrink-0 ml-4">
                        +{formatRupiah(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Quotation Card & Confirmation Form */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden bg-[#121212]/90 backdrop-blur-xl">
              {/* Crimson Accent Flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#720C10]/40 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff5b63]">
                    ESTIMASI ORIGINE (IDR)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">Rincian Biaya Sesi</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-zinc-300">
                  {currentRoom.code}
                </div>
              </div>

              {/* Breakdown List */}
              <div className="py-6 space-y-3.5 text-xs sm:text-sm font-mono border-b border-white/10">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>{currentRoom.name.split(":")[0]} ({sessionDuration === "half" ? "4 Jam" : "8 Jam"})</span>
                  <span className="font-semibold text-white">{formatRupiah(roomBasePrice)}</span>
                </div>

                {selectedAddons.map((id) => {
                  const item = addonOptions.find((a) => a.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-zinc-400">
                      <span className="truncate max-w-[210px]">↳ {item.name.split(" ")[0]} {item.name.split(" ")[1]}</span>
                      <span className="text-emerald-400">+{formatRupiah(item.price)}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center text-zinc-400 pt-2 border-t border-white/5">
                  <span>Tim Kebersihan & Kru Persiapan</span>
                  <span className="text-emerald-400">Termasuk</span>
                </div>
              </div>

              {/* Total & Deposit in IDR */}
              <div className="py-6 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-wider text-zinc-400 font-mono">
                    Estimasi Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>Uang Muka Retainer (50% DP)</span>
                  <span className="text-[#ff5b63] font-semibold">{formatRupiah(deposit)}</span>
                </div>
              </div>

              {/* Reservation Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Tanggal Pilihan
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block">
                        Waktu Sesi
                      </label>
                      {isCheckingSlots && (
                        <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                          <Loader2 className="w-2.5 h-2.5 animate-spin text-[#ff6169]" />
                          Cek slot...
                        </span>
                      )}
                    </div>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                    >
                      {availableSlots.map((s) => (
                        <option key={s.id} value={s.name} disabled={!s.isAvailable}>
                          {s.name} {s.isAvailable ? "✓ (Tersedia)" : "✕ (Penuh)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Slot Status Alert if Unavailable */}
                {availableSlots.find((s) => s.name === timeSlot && !s.isAvailable) && (
                  <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Slot sesi ini sudah terisi pada tanggal ini. Silakan pilih sesi lain atau tanggal berbeda.</span>
                  </div>
                )}

                {/* Payment Preference Selector */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-300 block mb-1.5 font-semibold">
                    Metode Pembayaran DP (50% Retainer)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === "qris"
                          ? "bg-[#720C10]/30 border-[#720C10] text-white ring-1 ring-[#720C10]"
                          : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1 text-[#ff6169]" />
                      <span className="text-[10px] font-mono block font-bold">QRIS Instan</span>
                      <span className="text-[9px] text-zinc-500 block">Semua E-Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("transfer")}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === "transfer"
                          ? "bg-[#720C10]/30 border-[#720C10] text-white ring-1 ring-[#720C10]"
                          : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#ff6169]" />
                      <span className="text-[10px] font-mono block font-bold">Transfer BCA</span>
                      <span className="text-[9px] text-zinc-500 block">Rekening Resmi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("whatsapp")}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === "whatsapp"
                          ? "bg-[#720C10]/30 border-[#720C10] text-white ring-1 ring-[#720C10]"
                          : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 mx-auto mb-1 text-[#25D366]" />
                      <span className="text-[10px] font-mono block font-bold">Kasir WA</span>
                      <span className="text-[9px] text-zinc-500 block">Invoice Chat</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Nama Produser / Kontak Utama *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dian Sastrowardoyo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Nomor WhatsApp / HP *
                    </label>
                    <input
                      type="tel"
                      placeholder="+62812345678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      placeholder="produser@agensi.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    Boolean(availableSlots.find((s) => s.name === timeSlot && !s.isAvailable))
                  }
                  className="w-full py-3.5 mt-2 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#720C10]/40 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Memproses Reservasi..." : "Ajukan Reservasi Studio"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Slot Real-time & Terhubung ke Kalender Admin Studio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SUCCESS & CONVERSION PAYMENT MODAL */}
      {isSubmitted && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setIsSubmitted(false)}
        >
          <div
            className="max-w-lg w-full bg-[#141414] border border-[#720C10] rounded-2xl p-6 sm:p-7 shadow-2xl relative text-center my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-[#720C10]/30 border border-[#720C10] text-[#ff6169] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <p className="text-xs font-mono tracking-widest text-[#e03a42] uppercase font-semibold">
              RESERVASI BERHASIL TERCATAT
            </p>
            <h3 className="text-2xl font-serif text-white font-medium mt-1">
              Sesi Studio Terkonfirmasi
            </h3>

            <p className="text-xs text-zinc-400 font-light mt-2 leading-relaxed">
              Halo <span className="text-white font-medium">{clientName || "Produser"}</span>, reservasi untuk <span className="text-white font-medium">{currentRoom.name}</span> pada tanggal <span className="text-white font-medium">{bookingDate}</span> ({timeSlot}) telah tercatat di sistem studio.
            </p>

            {/* Booking Summary Box */}
            <div className="my-5 p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between text-zinc-400">
                <span>Kode Booking:</span>
                <span className="text-white font-bold tracking-wider">{createdBookingId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Biaya Sesi:</span>
                <span className="text-zinc-200">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-t border-white/10 pt-2">
                <span>Uang Muka Retainer (50% DP):</span>
                <span className="text-[#ff5b63] font-bold text-sm">{formatRupiah(deposit)}</span>
              </div>
            </div>

            {/* DYNAMIC PAYMENT METHOD DISPLAY */}
            <div className="my-5 p-4 rounded-xl bg-white/[0.03] border border-white/15 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-[#ff6169]" />
                  Instruksi Pembayaran DP
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#720C10] text-white">
                  {paymentMethod === "qris" ? "QRIS INSTAN" : paymentMethod === "transfer" ? "TRANSFER BANK" : "WHATSAPP"}
                </span>
              </div>

              {paymentMethod === "qris" && (
                <div className="text-center py-2 space-y-3">
                  <div className="inline-block p-3 rounded-xl bg-white shadow-xl mx-auto">
                    {/* Simulated Clean QRIS Box */}
                    <div className="w-36 h-36 bg-zinc-950 p-2 rounded-lg flex flex-col items-center justify-between">
                      <div className="w-full flex justify-between items-center text-[8px] font-mono text-white/70">
                        <span>ORIGINE</span>
                        <span>QRIS</span>
                      </div>
                      <div className="w-24 h-24 bg-white rounded flex items-center justify-center p-1">
                        <QrCode className="w-full h-full text-black" />
                      </div>
                      <span className="text-[7px] font-mono text-zinc-400">NMID: ID102688490219</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-300">
                    Scan via BCA Mobile, Livin, GoPay, OVO, atau ShopeePay
                  </p>
                  <p className="text-xs font-mono font-semibold text-emerald-400">
                    Nominal Transfer: {formatRupiah(deposit)}
                  </p>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="space-y-3 py-1">
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block">Bank Central Asia (BCA)</span>
                      <span className="text-base font-mono font-bold text-white tracking-widest">
                        8270-1992-881
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block">a.n. PT ORIGINE STUDIO INDONESIA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("82701992881");
                        setCopiedAccount(true);
                        setTimeout(() => setCopiedAccount(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-[#720C10] text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-mono"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedAccount ? "Tersalin!" : "Salin"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Kirim bukti transfer ke WhatsApp studio untuk verifikasi instan.
                  </p>
                </div>
              )}

              {paymentMethod === "whatsapp" && (
                <div className="text-xs font-light text-zinc-300 py-1 space-y-1">
                  <p>Nomor invoice dan rekening kasir studio akan dikirimkan langsung melalui chat WhatsApp resmi Origine Studio.</p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5 pt-1">
              <a
                href={`https://wa.me/6285196671398?text=${encodeURIComponent(
                  `Halo Kak Ratna / Kasir Origine Studio, saya ${clientName || "Klien"} ingin konfirmasi reservasi sesi studio:\n\n` +
                  `• ID Booking: ${createdBookingId}\n` +
                  `• Ruangan: ${currentRoom.name}\n` +
                  `• Tanggal: ${bookingDate}\n` +
                  `• Waktu: ${timeSlot}\n` +
                  `• Total Biaya: ${formatRupiah(subtotal)}\n` +
                  `• Uang Muka DP (50%): ${formatRupiah(deposit)}\n` +
                  `• Metode DP: ${paymentMethod === "qris" ? "QRIS Instan" : paymentMethod === "transfer" ? "Transfer Bank BCA" : "Kasir WA"}\n\n` +
                  `Mohon verifikasi jadwal dan konfirmasi penerimaannya. Terima kasih!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi Langsung via WhatsApp Owner</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `RESERVASI ORIGINE STUDIO MALANG\nKode: ${createdBookingId}\nKlien: ${clientName}\nRuang: ${currentRoom.name}\nTanggal: ${bookingDate}\nWaktu: ${timeSlot}\nTotal: ${formatRupiah(subtotal)}\nDP (50%): ${formatRupiah(deposit)}`;
                    navigator.clipboard.writeText(text);
                    setCopiedSummary(true);
                    setTimeout(() => setCopiedSummary(false), 2000);
                  }}
                  className="py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-[11px] font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSummary ? "Tersalin!" : "Salin Ringkasan"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-[11px] font-mono tracking-wider uppercase transition-colors"
                >
                  Tutup & Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
