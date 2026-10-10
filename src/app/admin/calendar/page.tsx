"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ListChecks,
} from "lucide-react";
import { StudioBooking } from "@/lib/types";

export default function StudioCalendarPage() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Operational checklist for interns & staff
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "check-cyc": true,
    "check-broncolor": true,
    "check-coffee": false,
    "check-aircon": true,
    "check-tether": false,
    "check-steamer": true,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const bRes = await fetch("/api/bookings").then((r) => r.json());
        if (bRes.success) setBookings(bRes.bookings || []);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const upcomingBookings = bookings
    .filter((b) => b.bookingStatus === "confirmed" || b.bookingStatus === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
            JADWAL OPERASIONAL STUDIO
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] font-mono text-zinc-400">MAGANG & STAF STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
          Kalender Sesi & Kesiapan Ruang
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-light max-w-2xl leading-relaxed">
          Kru Magang dan Staf Studio dapat memeriksa agenda pemotretan hari ini, memastikan kesiapan peralatan Broncolor/Phase One, serta menandai checklist ruang studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: UPCOMING SESSIONS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-serif font-medium text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#ff6169]" />
            <span>Daftar Sesi Pemotretan Terjadwal</span>
          </h2>

          <div className="space-y-4">
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                Memuat kalender sesi...
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#121212] border border-white/10 text-center text-xs font-mono text-zinc-500">
                Belum ada jadwal sesi yang akan datang.
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-xs font-bold text-white font-mono">
                        {b.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                          b.bookingStatus === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-white">{b.roomName}</h3>
                    <p className="text-xs text-zinc-400 font-light">
                      Klien: <span className="text-white font-medium">{b.clientName}</span>
                      {b.clientPhone && ` (${b.clientPhone})`}
                    </p>

                    {b.selectedAddons && b.selectedAddons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {b.selectedAddons.map((a) => (
                          <span
                            key={a.id}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#720C10]/20 text-[#ff6169] border border-[#720C10]/30"
                          >
                            Alat: {a.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="inline-flex sm:flex flex-col items-start sm:items-end gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-white">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{b.timeSlot}</span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 font-medium">{b.date}</p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">
                        Petugas: {b.handledBy || "Staf Studio"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT 1 COL: INTERN CHECKLIST */}
        <div className="space-y-4">
          <h2 className="text-base font-serif font-medium text-white flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-emerald-400" />
            <span>Checklist Kru Magang & Studio</span>
          </h2>

          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl space-y-4">
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Tandai kelengkapan ruang studio sebelum sesi pemotretan klien dimulai:
            </p>

            <div className="space-y-3 font-mono text-xs">
              {[
                { id: "check-cyc", text: "Kebersihan lantai Cyclorama Putih (Mop & Touch-up)" },
                { id: "check-broncolor", text: "Uji sambungan Powerpack Broncolor Scoro" },
                { id: "check-aircon", text: "Suhu AC Studio diatur 20°C & Sirkulasi Udara" },
                { id: "check-coffee", text: "Minuman Selamat Datang & Coffee Bar Klien" },
                { id: "check-tether", text: "Kabel Tether USB-C & Monitor EIZO Dikalibrasi" },
                { id: "check-steamer", text: "Steamer Busana & Gantungan Pakaian Siap di Lounge" },
              ].map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    checklist[item.id]
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      checklist[item.id]
                        ? "bg-emerald-500 border-emerald-500 text-black"
                        : "border-zinc-500 bg-transparent"
                    }`}
                  >
                    {checklist[item.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={checklist[item.id] ? "line-through opacity-80" : ""}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-zinc-500 text-center">
              Akses khusus kru operasional & magang Origine Studio.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
