"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  CreditCard,
  GraduationCap,
  Sparkles,
  Layers,
  Building2,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Settings,
} from "lucide-react";
import {
  StudioBooking,
  StudioUser,
  StaffSession,
  StudioSpaceItem,
  StudioAboutContent,
  StudioContactSettings,
} from "@/lib/types";

export default function AdminOverviewPage() {
  const [session, setSession] = useState<StaffSession | null>(null);
  const [users, setUsers] = useState<StudioUser[]>([]);
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [spaces, setSpaces] = useState<StudioSpaceItem[]>([]);
  const [aboutData, setAboutData] = useState<StudioAboutContent | null>(null);
  const [contactSettings, setContactSettings] = useState<StudioContactSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, userRes, bookRes, galRes, spaceRes, aboutRes, settingsRes] = await Promise.all([
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/users").then((r) => r.json()).catch(() => ({ users: [] })),
          fetch("/api/bookings").then((r) => r.json()).catch(() => ({ bookings: [] })),
          fetch("/api/gallery").then((r) => r.json()).catch(() => ({ gallery: [] })),
          fetch("/api/spaces").then((r) => r.json()).catch(() => ({ spaces: [] })),
          fetch("/api/about").then((r) => r.json()).catch(() => ({ about: null })),
          fetch("/api/settings").then((r) => r.json()).catch(() => ({ settings: null })),
        ]);

        if (meRes.authenticated) {
          setSession(meRes.user);
        }
        if (userRes.users) setUsers(userRes.users);
        if (bookRes.bookings) setBookings(bookRes.bookings);
        if (galRes.gallery) setGalleryCount(galRes.gallery.length);
        if (spaceRes.spaces) setSpaces(spaceRes.spaces);
        if (aboutRes.about) setAboutData(aboutRes.about);
        if (settingsRes.settings) setContactSettings(settingsRes.settings);
      } catch (e) {
        console.error("Failed to load overview data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid" || b.paymentStatus === "dp_paid")
    .reduce(
      (sum, b) =>
        sum +
        (b.paymentStatus === "paid"
          ? Number(b.totalPrice) || 0
          : Number(b.depositPaid) || 0),
      0
    );

  const pendingBookings = bookings.filter((b) => b.bookingStatus === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "confirmed").length;

  const role = session?.role || "user";
  const isManager = role === "owner" || role === "admin";
  const isCashier = role === "kasir";

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-zinc-500">
        Memuat data operasional...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HEADER & ROLE BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
              STUDIO DASHBOARD
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-400">
              ORIGINE STUDIO MALANG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium">
            Halo, <span className="text-white font-semibold">{session?.name}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Selamat datang di panel kontrol terpadu Origine Studio Malang.
          </p>
        </div>

        {/* Role Privileges Banner */}
        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#720C10]/40 text-[#ff6169] flex items-center justify-center shrink-0">
            {role === "owner" && <Crown className="w-5 h-5 text-amber-400" />}
            {role === "admin" && <ShieldCheck className="w-5 h-5 text-purple-400" />}
            {role === "kasir" && <CreditCard className="w-5 h-5 text-emerald-400" />}
            {role === "magang" && <GraduationCap className="w-5 h-5 text-sky-400" />}
            {role === "user" && <Sparkles className="w-5 h-5 text-zinc-300" />}
          </div>
          <div className="text-left">
            <p className="text-[10px] font-mono uppercase text-zinc-400">Hak Akses Aktif</p>
            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Role: {role}
            </p>
          </div>
        </div>
      </div>

      {/* 2. STATS KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Bookings */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Reservasi</span>
            <div className="p-2 rounded-xl bg-white/5 text-white">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-syne font-bold text-white">{bookings.length}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-zinc-400">
            <span className="text-emerald-400">{confirmedBookings} Terkonfirmasi</span>
            <span>•</span>
            <span className="text-amber-400">{pendingBookings} Pending</span>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Penerimaan Studio</span>
            <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-syne font-bold text-emerald-300">
            {formatRupiah(totalRevenue)}
          </p>
          <p className="text-[11px] font-mono text-zinc-500 mt-2">
            Dari deposit & pelunasan sesi
          </p>
        </div>

        {/* Metric 3: Users & Staff */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pengguna & Staf</span>
            <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-syne font-bold text-white">
            {isManager ? users.length : 5}
          </p>
          <p className="text-[11px] font-mono text-zinc-400 mt-2">
            5 Role: Owner, Admin, Kasir, Magang, User
          </p>
        </div>

        {/* Metric 4: Gallery */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Koleksi Galeri</span>
            <div className="p-2 rounded-xl bg-[#720C10]/40 text-[#ff6169]">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-syne font-bold text-white">{galleryCount}</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-2">
            Karya foto terkurasi di website
          </p>
        </div>
      </div>

      {/* 3. WIDGET STATISTIK CMS & KONTEN WEBSITE DINAMIS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff6169] font-bold">
                CMS LIVE METRICS
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dinamis & Real-time
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white font-medium">
              Statistik Konten & Modul CMS
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Ringkasan data publik yang aktif ditampilkan di beranda dan halaman utama Origine Studio.
            </p>
          </div>

          {isManager && (
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/admin/packages"
                className="px-3 py-1.5 rounded-lg bg-[#720C10]/20 hover:bg-[#720C10]/40 border border-[#720C10]/40 hover:border-[#ff6169] text-[11px] font-mono text-zinc-200 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-[#ff6169]" />
                <span>Paket Booking</span>
              </Link>
              <Link
                href="/admin/spaces"
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#720C10]/20 border border-white/10 hover:border-[#720C10] text-[11px] font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-[#ff6169]" />
                <span>Ruang Studio</span>
              </Link>
              <Link
                href="/admin/about"
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-amber-950/20 border border-white/10 hover:border-amber-500/40 text-[11px] font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Profil & Tim</span>
              </Link>
              <Link
                href="/admin/settings"
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-sky-950/20 border border-white/10 hover:border-sky-500/40 text-[11px] font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>Hotline & Kontak</span>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CMS Card 1: Ruang Studio Suite */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-[#720C10]/60 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#720C10]/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[#720C10]/30 text-[#ff6169] border border-[#720C10]/40">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {spaces.filter((s) => s.isActive).length}/{spaces.length} Ruang Aktif
                </span>
              </div>

              <h3 className="text-lg font-serif text-white font-medium">Suite Ruang Studio</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Koleksi cyclorama, daylight loft, dan chiaroscuro studio yang disewakan untuk sesi foto & video.
              </p>

              {/* Mini spaces list */}
              <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                {spaces.slice(0, 3).map((space) => (
                  <div key={space.id} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-300 truncate max-w-[160px]">{space.name}</span>
                    <span className="text-zinc-500 text-[11px]">{space.hourlyRate}</span>
                  </div>
                ))}
                {spaces.length === 0 && (
                  <p className="text-xs text-zinc-500 font-mono italic">Memuat data ruang studio...</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              {isManager ? (
                <Link
                  href="/admin/spaces"
                  className="text-xs font-mono text-[#ff6169] group-hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <span>Buka CMS Ruang Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-[11px] font-mono text-zinc-500">Mode Lihat Saja (Read-Only)</span>
              )}
              <span className="text-[10px] font-mono text-zinc-500">{spaces.length} Ruang Total</span>
            </div>
          </div>

          {/* CMS Card 2: Profil & Tim Artistik */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {aboutData?.clientBrands?.length || 0} Mitra Brand
                </span>
              </div>

              <h3 className="text-lg font-serif text-white font-medium">Profil & Tim Seniman</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Cerita asal-usul, visi artistik, nilai kuratorial, dan roster fotografer resident Origine Studio.
              </p>

              {/* Mini Team list */}
              <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                {aboutData?.team?.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-200 font-medium truncate max-w-[150px]">{member.name}</span>
                    <span className="text-zinc-500 text-[11px] truncate max-w-[130px]">{member.role}</span>
                  </div>
                ))}
                {(!aboutData || !aboutData.team || aboutData.team.length === 0) && (
                  <p className="text-xs text-zinc-500 font-mono italic">Memuat daftar seniman & kru...</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              {isManager ? (
                <Link
                  href="/admin/about"
                  className="text-xs font-mono text-amber-300 group-hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <span>Buka CMS Profil & Tim</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-[11px] font-mono text-zinc-500">Mode Lihat Saja (Read-Only)</span>
              )}
              <span className="text-[10px] font-mono text-zinc-500">{aboutData?.team?.length || 0} Seniman Aktif</span>
            </div>
          </div>

          {/* CMS Card 3: Operasional & Concierge Hotline */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-sky-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Operasional Aktif
                </span>
              </div>

              <h3 className="text-lg font-serif text-white font-medium">Hotline & Operasional</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Pusat kontak hotline WhatsApp concierge, jam operasional layanan studio, dan peta lokasi resmi.
              </p>

              {/* Mini details list */}
              <div className="mt-4 space-y-2 border-t border-white/5 pt-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Jam Layanan:</span>
                  <span className="text-zinc-200 text-[11px] truncate max-w-[170px]">
                    {contactSettings?.operatingHours || "08:00 - 22:00 WIB"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">WhatsApp:</span>
                  <span className="text-emerald-400 text-[11px] font-semibold">
                    {contactSettings?.whatsappNumber || "0812-3456-7890"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Instagram:</span>
                  <span className="text-[#ff6169] text-[11px]">
                    {contactSettings?.instagramHandle || "@originestudio"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              {isManager ? (
                <Link
                  href="/admin/settings"
                  className="text-xs font-mono text-sky-300 group-hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <span>Ubah Kontak & Jam Buka</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-[11px] font-mono text-zinc-500">Mode Lihat Saja (Read-Only)</span>
              )}
              <span className="text-[10px] font-mono text-zinc-500">
                {contactSettings?.addressCity || "Malang, Jawa Timur"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTION TILES */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4 font-semibold">
          AKSI CEPAT SESUAI HAK AKSES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quick Action 1: Manage Staff */}
          {isManager ? (
            <Link
              href="/admin/users"
              className="p-5 rounded-2xl bg-white/[0.03] hover:bg-[#720C10]/15 border border-white/10 hover:border-[#720C10] transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300">
                  <Users className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white">Kelola User & Buat Akses Staf</h4>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Buat akun masuk kasir dan magang dengan username dan kode akses unik.
              </p>
            </Link>
          ) : (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 opacity-60">
              <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 w-fit mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-zinc-400">Kelola User & Staf</h4>
              <p className="text-xs text-zinc-500 mt-1">Dibatasi hanya untuk Owner & Admin.</p>
            </div>
          )}

          {/* Quick Action 2: Manage Bookings / Cashier */}
          {isManager || isCashier ? (
            <Link
              href="/admin/bookings"
              className="p-5 rounded-2xl bg-white/[0.03] hover:bg-[#720C10]/15 border border-white/10 hover:border-[#720C10] transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white">Kelola Transaksi & Booking</h4>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Konfirmasi pelunasan, periksa DP klien, dan update status jadwal pemotretan.
              </p>
            </Link>
          ) : (
            <Link
              href="/admin/calendar"
              className="p-5 rounded-2xl bg-white/[0.03] hover:bg-sky-950/20 border border-white/10 hover:border-sky-500/40 transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-300">
                  <Clock className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white">Lihat Jadwal Sesi Studio</h4>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Cek jadwal pemotretan hari ini dan checklist persiapan ruangan.
              </p>
            </Link>
          )}

          {/* Quick Action 3: Pricing & Spaces */}
          {isManager ? (
            <Link
              href="/admin/pricing"
              className="p-5 rounded-2xl bg-white/[0.03] hover:bg-[#720C10]/15 border border-white/10 hover:border-[#720C10] transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-300">
                  <DollarSign className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-white">Edit Tarif Studio & Add-on</h4>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Sesuaikan tarif sewa Studio 01, 02, 03 dan peralatan Broncolor/Phase One.
              </p>
            </Link>
          ) : (
            <Link
              href="/"
              className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/5 border border-white/10 transition-all group block shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white">Lihat Website Utama</h4>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Tampilan publik halaman depan Origine Studio Malang.
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* 5. RECENT BOOKINGS PREVIEW TABLE */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h3 className="text-base font-serif font-medium text-white">
              Reservasi Sesi Terbaru
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Pantau jadwal klien dan status pembayaran studio langsung.
            </p>
          </div>
          {(isManager || isCashier) && (
            <Link
              href="/admin/bookings"
              className="text-xs font-mono text-[#ff6169] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Kelola Semua Booking</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-zinc-500 uppercase tracking-wider border-b border-white/5 pb-2">
                <th className="py-2.5 px-3">Kode Booking</th>
                <th className="py-2.5 px-3">Nama Klien</th>
                <th className="py-2.5 px-3">Ruangan Studio</th>
                <th className="py-2.5 px-3">Tanggal & Sesi</th>
                <th className="py-2.5 px-3">Total Biaya</th>
                <th className="py-2.5 px-3">Status Bayar</th>
                <th className="py-2.5 px-3">Status Sesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{b.id}</td>
                  <td className="py-3 px-3 text-zinc-200">
                    <p className="font-medium text-white">{b.clientName}</p>
                    <p className="text-[10px] text-zinc-500">{b.clientPhone}</p>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{b.roomName.split(":")[0]}</td>
                  <td className="py-3 px-3 text-zinc-400">
                    <p className="text-white">{b.date}</p>
                    <p className="text-[10px] text-zinc-500">{b.timeSlot}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">
                    {formatRupiah(b.totalPrice)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
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
                        : "Belum Bayar"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.bookingStatus === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : b.bookingStatus === "completed"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
