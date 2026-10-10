"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MessageSquare,
} from "lucide-react";
import { StudioBooking, StaffSession } from "@/lib/types";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyBookings() {
      setLoading(true);
      try {
        const [meRes, bRes] = await Promise.all([
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/bookings").then((r) => r.json()),
        ]);

        if (meRes.authenticated) setSession(meRes.user);
        if (bRes.success) setBookings(bRes.bookings || []);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchMyBookings();
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
            PORTAL KLIEN PRODUSER
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] font-mono text-zinc-400">ORIGINE STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
          Jadwal & Reservasi {session?.name ? `(${session.name})` : "Saya"}
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-light">
          Lihat riwayat booking pemotretan Anda di Origine Studio Malang, status pembayaran, dan rincian sesi.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">
          Memuat jadwal Anda...
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#121212] border border-white/10 text-center space-y-3">
          <Calendar className="w-8 h-8 text-zinc-500 mx-auto" />
          <h3 className="text-base font-serif text-white">Belum Ada Sesi yang Dipesan</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Anda belum memiliki reservasi studio aktif. Silakan pilih jadwal sesi pemotretan Anda di website kami.
          </p>
          <div className="pt-2">
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#720C10] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Pesan Sesi Studio Sekarang
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/50 border border-white/10 text-xs font-mono font-bold text-white">
                    {b.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                      b.paymentStatus === "paid"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : b.paymentStatus === "dp_paid"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {b.paymentStatus === "paid"
                      ? "Lunas"
                      : b.paymentStatus === "dp_paid"
                      ? "DP Terbayar"
                      : "Menunggu Pembayaran"}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-medium text-white">{b.roomName}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{b.timeSlot}</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-xs text-zinc-400 font-light mt-1">Catatan: {b.notes}</p>
                )}
              </div>

              <div className="md:text-right border-t md:border-t-0 border-white/5 pt-4 md:pt-0 shrink-0">
                <p className="text-[10px] font-mono uppercase text-zinc-400">Total Biaya Sesi:</p>
                <p className="text-xl font-syne font-bold text-white mt-0.5">
                  {formatRupiah(b.totalPrice)}
                </p>

                <div className="mt-3 flex items-center md:justify-end gap-2">
                  <a
                    href="https://wa.me/6285196671398?text=Halo%20Kak%20Ratna,%20saya%20ingin%20tanya%20mengenai%20booking%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs font-mono"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Admin Studio</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
