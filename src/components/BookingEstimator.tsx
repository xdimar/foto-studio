"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface StudioRoom {
  id: string;
  name: string;
  code: string;
  dimensions: string;
  baseRate: number; // half-day base price in USD
  fullDayRate: number;
  highlight: string;
}

const studioRooms: StudioRoom[] = [
  {
    id: "room-01",
    name: "Studio 01: Cyclorama Tanpa Batas",
    code: "CYC-01",
    dimensions: "180 m² • Cyclorama Lengkung 12m • Plafon 6m",
    baseRate: 950,
    fullDayRate: 1650,
    highlight: "Dilengkapi motorized overhead truss Broncolor & powerpack Scoro berdaya tinggi.",
  },
  {
    id: "room-02",
    name: "Studio 02: Loft Cahaya Alami",
    code: "LOFT-02",
    dimensions: "140 m² • Jendela Baja Menghadap Utara 5m",
    baseRate: 750,
    fullDayRate: 1350,
    highlight: "Cahaya matahari alami terbaur, dinding beton mentah bertekstur & properti seni rupa.",
  },
  {
    id: "room-03",
    name: "Studio 03: Ruang Noir & Chiaroscuro",
    code: "NOIR-03",
    dimensions: "110 m² • Beludru Akustik Kedap Cahaya 360°",
    baseRate: 700,
    fullDayRate: 1250,
    highlight: "Kedap cahaya sempurna, boom pencahayaan presisi, dan sistem kabut asap sinematik.",
  },
];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  desc: string;
}

const addonOptions: AddonOption[] = [
  {
    id: "phase-one",
    name: "Kit Punggung Digital Phase One IQ4 150MP",
    price: 350,
    desc: "Termasuk lensa Schneider Kreuznach 45mm, 80mm & 150mm.",
  },
  {
    id: "broncolor-para",
    name: "Broncolor Para 220 FB + Powerpack Scoro",
    price: 200,
    desc: "Reflektor parabolik 2,2m legendaris untuk sebaran cahaya lembut memeluk siluet.",
  },
  {
    id: "digi-tech",
    name: "Master Operator Digital & Kalibrasi Warna Langsung",
    price: 250,
    desc: "Operator tether khusus di lokasi dengan monitor referensi EIZO ColorEdge.",
  },
  {
    id: "hmu-suite",
    name: "Lounge VIP Tata Rias & Ruang Busana",
    price: 150,
    desc: "Ruang rias privat 3 kursi dengan steamer busana dan gantungan pakaian desainer.",
  },
  {
    id: "analog-lab",
    name: "Pengembangan Film Analog 120/35mm di Lab Kimia",
    price: 180,
    desc: "Pemrosesan manual C-41 & B&W di hari yang sama + pindai resolusi tinggi Hasselblad Flextight.",
  },
];

export default function BookingEstimator() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("room-01");
  const [sessionDuration, setSessionDuration] = useState<"half" | "full">("full");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["phase-one", "broncolor-para"]);
  const [bookingDate, setBookingDate] = useState<string>("2024-11-15");
  const [timeSlot, setTimeSlot] = useState<string>("Pagi (09:00 - 17:00)");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");

  const currentRoom = studioRooms.find((r) => r.id === selectedRoomId) || studioRooms[0];
  const roomBasePrice = sessionDuration === "half" ? currentRoom.baseRate : currentRoom.fullDayRate;

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = addonOptions.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = roomBasePrice + addonsTotal;
  const deposit = Math.round(subtotal * 0.35);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="booking" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#720C10]/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-[0.25em] uppercase text-[#ff5b63] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#720C10]" />
            RESERVASI ATELIER & ESTIMATOR BIAYA
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-tight">
            Konfigurasi Sesi <span className="italic font-serif-italic font-normal">Produksi</span> Anda
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light">
            Pilih ruang studio atelier, durasi waktu sesi, dan paket optik teknis pendukung.
            Kalkulasi biaya langsung transparan tanpa biaya tersembunyi.
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
                Pilih Ruang Atelier
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
                          <p className="text-xl sm:text-2xl font-serif text-white font-semibold">
                            ${priceDisplay}
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
                      <span className="text-sm font-mono font-medium text-zinc-200 shrink-0 ml-4">
                        +${addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Quotation Card & Confirmation Form */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden">
              {/* Crimson Accent Flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#720C10]/40 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff5b63]">
                    ESTIMASI ORIGINE
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
                  <span className="font-semibold text-white">${roomBasePrice}</span>
                </div>

                {selectedAddons.map((id) => {
                  const item = addonOptions.find((a) => a.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-zinc-400">
                      <span className="truncate max-w-[210px]">↳ {item.name.split(" ")[0]} {item.name.split(" ")[1]}</span>
                      <span>+${item.price}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center text-zinc-400 pt-2 border-t border-white/5">
                  <span>Tim Kebersihan & Kru Persiapan</span>
                  <span className="text-emerald-400">Termasuk</span>
                </div>
              </div>

              {/* Total & Deposit */}
              <div className="py-6 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-wider text-zinc-400 font-mono">
                    Estimasi Total
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>Uang Muka Retainer (35%)</span>
                  <span className="text-[#ff5b63] font-semibold">${deposit}</span>
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
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Waktu Sesi
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-[#720C10] outline-none"
                    >
                      <option>Pagi (09:00 - 13:00 / 17:00)</option>
                      <option>Siang & Sore (14:00 - 22:00)</option>
                      <option>Seharian Penuh & Malam (09:00 - 21:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Nama Produser / Kontak Utama
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tim Produksi Vivienne Westwood"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Email Pekerjaan
                  </label>
                  <input
                    type="email"
                    placeholder="produser@agensi.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#720C10] outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#720C10]/40 hover:scale-[1.02]"
                >
                  <span>Ajukan Reservasi Atelier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Konfirmasi Instan & Penahanan Alat Terjamin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SUCCESS MODAL */}
      {isSubmitted && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsSubmitted(false)}
        >
          <div
            className="max-w-md w-full bg-[#141414] border border-[#720C10] rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-[#720C10]/30 border border-[#720C10] text-[#ff6169] flex items-center justify-center mx-auto mb-5 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <p className="text-xs font-mono tracking-widest text-[#e03a42] uppercase font-semibold">
              RESERVASI DITERIMA
            </p>
            <h3 className="text-2xl font-serif text-white font-medium mt-1">
              Sesi Atelier Terkonfirmasi
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-3 leading-relaxed">
              Terima kasih, <span className="text-white font-medium">{clientName || "Produser"}</span>. Kami telah menahan jadwal 48 jam untuk <span className="text-white font-medium">{currentRoom.name}</span> pada tanggal <span className="text-white font-medium">{bookingDate}</span>.
            </p>

            <div className="my-6 p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between text-zinc-400">
                <span>ID Reservasi:</span>
                <span className="text-white font-bold">ORG-2024-8849</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Estimasi:</span>
                <span className="text-white font-bold">${subtotal} USD</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Uang Muka Terhutang:</span>
                <span className="text-[#ff5b63] font-bold">${deposit} USD</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg"
            >
              Kembali ke Studio Atelier
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
