"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MessageSquare,
  FolderDown,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Search,
  Camera,
  Layers,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  HardDriveDownload,
  Info,
} from "lucide-react";
import { StudioBooking, StaffSession } from "@/lib/types";

export default function MyBookingsClientPortalPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ready" | "processing">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyBookings() {
      setLoading(true);
      try {
        const [meRes, bRes] = await Promise.all([
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/bookings").then((r) => r.json()),
        ]);

        if (meRes.authenticated) {
          setSession(meRes.user);

          // If Staff/Manager/Kasir opens client portal, redirect them to Studio Bookings Management
          if (meRes.user.role === "owner" || meRes.user.role === "admin" || meRes.user.role === "kasir") {
            router.replace("/admin/bookings");
            return;
          }
        }

        if (bRes.success) {
          const allBookings: StudioBooking[] = bRes.bookings || [];

          if (meRes.user?.role === "user") {
            const userEmail = (meRes.user.email || "").toLowerCase().trim();
            const userPhone = (meRes.user.phone || "").replace(/\D/g, "");
            const userName = (meRes.user.name || "").toLowerCase().trim();

            const myOnlyBookings = allBookings.filter((b) => {
              const bEmail = (b.clientEmail || "").toLowerCase().trim();
              const bPhone = (b.clientPhone || "").replace(/\D/g, "");
              const bName = (b.clientName || "").toLowerCase().trim();

              const matchEmail = Boolean(userEmail && bEmail === userEmail);
              const matchPhone = Boolean(
                userPhone && userPhone.length >= 6 && bPhone.includes(userPhone.slice(-8))
              );
              const matchName = Boolean(userName && bName.includes(userName));

              return matchEmail || matchPhone || matchName;
            });

            // STRICT ISOLATION: User only sees their own bookings, never other clients' bookings!
            setBookings(myOnlyBookings);
          } else {
            setBookings([]);
          }
        }
      } catch (err) {
        console.error("Error fetching bookings for portal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyBookings();
  }, [router]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomName.toLowerCase().includes(searchQuery.toLowerCase());

      const hasDrive = Boolean(b.googleDriveUrl && b.googleDriveUrl.trim());
      if (statusFilter === "ready" && !hasDrive) return false;
      if (statusFilter === "processing" && hasDrive) return false;

      return matchSearch;
    });
  }, [bookings, searchQuery, statusFilter]);

  const readyToDownloadCount = bookings.filter(
    (b) => b.googleDriveUrl && b.googleDriveUrl.trim()
  ).length;

  return (
    <div className="space-y-8">
      {/* 1. HERO HEADER PORTAL KLIEN */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#181112] via-[#0f0e0f] to-[#0a0a0a] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#720C10]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-widest text-[#ff6169] uppercase font-bold">
              <Sparkles className="w-3 h-3 text-[#ff6169]" />
              <span>ORIGINE CLIENT CLOUD • PORTAL DOWNLOAD RESMI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-medium">
              Galeri & Portal Unduhan Foto{" "}
              {session?.name ? (
                <span className="text-[#ff6169]">Kak {session.name}</span>
              ) : (
                "Klien"
              )}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Akses cepat tautan Google Drive original resolusi tinggi untuk seluruh sesi pemotretan Anda di Origine Studio Malang. Nikmati kemudahan menyimpan dan membagikan momen berharga Anda.
            </p>
          </div>

          {/* Quick Stat Badge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FolderDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-zinc-400">Hasil Foto Siap</p>
              <p className="text-2xl font-syne font-bold text-white">
                {readyToDownloadCount}{" "}
                <span className="text-xs text-zinc-400 font-mono font-normal">
                  / {bookings.length} Sesi
                </span>
              </p>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Google Drive High-Res
              </p>
            </div>
          </div>
        </div>

        {/* Info Tips Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tautan Cloud Aman & Terverifikasi</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Camera className="w-4 h-4 text-[#ff6169]" />
            <span>Format File JPG High-Res + Culling Pilihan</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Masa Aktif Tautan Cloud Selamanya</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari ID booking, nama paket, atau studio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121212] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#720C10] transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#121212] border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === "all"
                ? "bg-[#720C10] text-white font-semibold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Semua ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("ready")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              statusFilter === "ready"
                ? "bg-emerald-600 text-white font-semibold shadow-md"
                : "text-emerald-400 hover:text-emerald-300"
            }`}
          >
            <span>Siap Download</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
              {readyToDownloadCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("processing")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              statusFilter === "processing"
                ? "bg-amber-600 text-white font-semibold shadow-md"
                : "text-amber-400 hover:text-amber-300"
            }`}
          >
            <span>Sedang Diedit</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
              {bookings.length - readyToDownloadCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. BOOKINGS LIST / DOWNLOAD CARDS */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#ff6169] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Sinkronisasi berkas Google Drive klien...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#121212] border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 text-zinc-500 flex items-center justify-center mx-auto">
            <FolderDown className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-serif text-white">Tidak Ditemukan Sesi yang Cocok</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Tidak ada sesi pemotretan dengan filter yang dipilih. Silakan reset filter pencarian Anda atau reservasi jadwal pemotretan baru.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
            >
              Reset Filter
            </button>
            <Link
              href="/booking"
              className="px-5 py-2 rounded-xl bg-[#720C10] hover:bg-[#8d1116] text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Booking Sesi Baru
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const hasDrive = Boolean(b.googleDriveUrl && b.googleDriveUrl.trim());

            return (
              <div
                key={b.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xl ${
                  hasDrive
                    ? "bg-[#121212] border-emerald-500/30 hover:border-emerald-500/60"
                    : "bg-[#121212] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Card Header & Status Ribbon */}
                <div className="p-6 sm:p-7 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono font-bold text-white tracking-wider">
                        {b.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md border ${
                          b.paymentStatus === "paid"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : b.paymentStatus === "dp_paid"
                            ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {b.paymentStatus === "paid"
                          ? "Lunas"
                          : b.paymentStatus === "dp_paid"
                          ? "DP Terbayar"
                          : "Menunggu Pembayaran"}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {b.bookingStatus === "confirmed"
                          ? "Sesi Terkonfirmasi"
                          : b.bookingStatus === "completed"
                          ? "Sesi Selesai"
                          : "Sesi Pending"}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                        Total Biaya Sesi
                      </span>
                      <span className="text-lg sm:text-xl font-syne font-bold text-white">
                        {formatRupiah(b.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Package info */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#ff6169] tracking-wider font-semibold">
                          PAKET & RUANGAN
                        </span>
                        <h3 className="text-xl font-serif font-medium text-white mt-0.5">
                          {b.roomName}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300 pt-1">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{b.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{b.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                          <Layers className="w-3.5 h-3.5 text-[#ff6169]" />
                          <span>Studio 01 / Cyclorama</span>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-zinc-400 font-light bg-black/30 p-3 rounded-xl border border-white/5">
                          <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-0.5">
                            Catatan Sesi:
                          </span>
                          {b.notes}
                        </p>
                      )}
                    </div>

                    {/* Right: Client info & Chat Concierge */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                          Klien Terdaftar
                        </span>
                        <p className="text-sm font-semibold text-white">{b.clientName}</p>
                        <p className="text-xs font-mono text-zinc-400">{b.clientPhone}</p>
                        {b.clientEmail && (
                          <p className="text-xs font-mono text-zinc-500 truncate">{b.clientEmail}</p>
                        )}
                      </div>

                      <a
                        href={`https://wa.me/6285196671398?text=${encodeURIComponent(
                          `Halo Admin Origine Studio, saya ingin bertanya terkait file foto sesi saya (${b.id} - ${b.clientName}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 text-xs font-mono transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Admin WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* 4. GOOGLE DRIVE DOWNLOAD SECTION (PROMINENT PORTAL) */}
                  <div className="pt-2">
                    {hasDrive ? (
                      /* READY TO DOWNLOAD BANNER */
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1e17] to-emerald-950/20 border border-emerald-500/40 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <FileCheck2 className="w-4 h-4" />
                              </span>
                              <h4 className="text-base sm:text-lg font-serif text-white font-medium">
                                File Foto Sesi Anda Siap Diunduh!
                              </h4>
                            </div>

                            <p className="text-xs text-zinc-300 font-light max-w-xl leading-relaxed">
                              Folder Google Drive berisi file foto original resolusi tinggi (JPG & Culling). Anda dapat mengunduh seluruh folder secara instan ke ponsel maupun komputer.
                            </p>

                            {b.deliveredAt && (
                              <p className="text-[10px] font-mono text-emerald-300/80">
                                Diserahkan oleh Studio: {new Date(b.deliveredAt).toLocaleString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} WIB
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopy(b.id, b.googleDriveUrl!)}
                              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all"
                            >
                              {copiedId === b.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>Salin Link</span>
                                </>
                              )}
                            </button>

                            <a
                              href={b.googleDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all group"
                            >
                              <HardDriveDownload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                              <span>Buka Google Drive</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* EDITING / PROCESSING BANNER */
                      <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                            <Clock className="w-4 h-4 animate-spin" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-white">
                              Hasil Foto Sedang Dalam Proses Kurasi & Editing
                            </h4>
                            <p className="text-xs text-zinc-400 font-light mt-0.5">
                              Tim fotografer Origine Studio sedang menyunting dan mengunggah hasil foto ke Google Drive. Tautan unduhan otomatis muncul di portal ini begitu selesai.
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-zinc-500 shrink-0 self-start sm:self-center px-3 py-1 rounded-full bg-white/[0.02] border border-white/5">
                          Estimasi: 1x24 Jam Sesi
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
