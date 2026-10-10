"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OrigineLogo from "@/components/OrigineLogo";
import {
  Users,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Crown,
  CreditCard,
  GraduationCap,
  User as UserIcon,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StudioRole, StaffSession } from "@/lib/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setSession(data.user);
        } else {
          router.push("/auth/login");
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  const role = session?.role || "user";

  const getRoleBadge = (r: StudioRole) => {
    switch (r) {
      case "owner":
        return {
          label: "OWNER STUDIO",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          icon: Crown,
        };
      case "admin":
        return {
          label: "STUDIO ADMIN",
          color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          icon: Shield,
        };
      case "kasir":
        return {
          label: "KASIR STUDIO",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          icon: CreditCard,
        };
      case "magang":
        return {
          label: "KRU MAGANG",
          color: "bg-sky-500/20 text-sky-300 border-sky-500/30",
          icon: GraduationCap,
        };
      case "user":
      default:
        return {
          label: "KLIEN PRODUSER",
          color: "bg-zinc-800 text-zinc-300 border-zinc-700",
          icon: UserIcon,
        };
    }
  };

  const badgeInfo = getRoleBadge(role);
  const BadgeIcon = badgeInfo.icon;

  // Role-based Nav items
  const navItems = [
    {
      name: "Ringkasan Overview",
      href: "/admin",
      icon: LayoutDashboard,
      allowed: ["owner", "admin", "kasir", "magang", "user"],
    },
    {
      name: "Kelola User & Staf",
      href: "/admin/users",
      icon: Users,
      allowed: ["owner", "admin"],
      badge: "CRUD",
    },
    {
      name: "Tarif & Layanan",
      href: "/admin/pricing",
      icon: DollarSign,
      allowed: ["owner", "admin"],
      badge: "Harga",
    },
    {
      name: "Paket & Menu Booking",
      href: "/admin/packages",
      icon: Clock,
      allowed: ["owner", "admin"],
      badge: "Menu",
    },
    {
      name: "Reservasi & Booking",
      href: "/admin/bookings",
      icon: Calendar,
      allowed: ["owner", "admin", "kasir"],
      badge: "Transaksi",
    },
    {
      name: "Karya & Galeri",
      href: "/admin/gallery",
      icon: ImageIcon,
      allowed: ["owner", "admin"],
      badge: "Portofolio",
    },
    {
      name: "Ruang Studio",
      href: "/admin/spaces",
      icon: Layers,
      allowed: ["owner", "admin"],
      badge: "Ruangan",
    },
    {
      name: "Tentang Kami & Tim",
      href: "/admin/about",
      icon: Sparkles,
      allowed: ["owner", "admin"],
      badge: "Profil",
    },
    {
      name: "Pengaturan & Kontak",
      href: "/admin/settings",
      icon: Sliders,
      allowed: ["owner", "admin"],
      badge: "Kontak",
    },
    {
      name: "Reservasi Saya",
      href: "/admin/my-bookings",
      icon: Calendar,
      allowed: ["user", "owner", "admin"],
      badge: "Klien",
    },
    {
      name: "Kalender & Jadwal Sesi",
      href: "/admin/calendar",
      icon: Clock,
      allowed: ["owner", "admin", "kasir", "magang"],
    },
  ];

  const visibleNav = navItems.filter((item) => item.allowed.includes(role));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F9F8F6] flex relative">
      {/* Top subtle loading indicator if session is being validated in background */}
      {loading && (
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#ff6169] to-transparent animate-pulse fixed top-0 left-0 right-0 z-50 pointer-events-none" />
      )}
      {/* 1. SIDEBAR (Desktop - Collapsible & Scrollable) */}
      <aside
        className={`hidden lg:flex flex-col border-white/10 bg-[#0e0e0e]/95 backdrop-blur-xl shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          desktopSidebarOpen
            ? "w-72 border-r opacity-100"
            : "w-0 border-r-0 overflow-hidden opacity-0 pointer-events-none p-0"
        }`}
      >
        <div className="flex flex-col h-full w-72">
          {/* A. Fixed Top Header in Sidebar */}
          <div className="p-4.5 border-b border-white/10 shrink-0 flex items-center justify-between">
            <div>
              <Link href="/" className="inline-block text-2xl">
                <OrigineLogo />
              </Link>
              <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1">
                PANEL ADMIN STUDIO
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
              title="Tutup Sidebar"
              aria-label="Tutup Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* B. Scrollable Middle Body: User Card & All Menu Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {/* Current User Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#720C10]/30 border border-[#720C10] text-[#ff6169] flex items-center justify-center font-bold text-sm shrink-0">
                {session?.name ? session.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{session?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${badgeInfo.color}`}
                  >
                    <BadgeIcon className="w-2.5 h-2.5" />
                    {badgeInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links List */}
            <nav className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-3 py-1 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                  MENU NAVIGASI
                </span>
                <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">
                  {visibleNav.length} MENU
                </span>
              </div>
              {visibleNav.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 ${
                      active
                        ? "bg-[#720C10] text-white shadow-lg shadow-[#720C10]/20 font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          active ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* C. Fixed Bottom Footer in Sidebar */}
          <div className="p-4 border-t border-white/10 shrink-0 bg-[#0e0e0e] flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors"
            >
              <span>Lihat Website Utama</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Akun (Logout)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar Header (Desktop, Tablet & Mobile) */}
        <header className="sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Responsive Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth >= 1024) {
                  setDesktopSidebarOpen(!desktopSidebarOpen);
                } else {
                  setMobileOpen(!mobileOpen);
                }
              }}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer flex items-center gap-2"
              title="Buka / Tutup Sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Brand Logo when Desktop Sidebar is closed or on mobile */}
            <div className={`text-xl ${desktopSidebarOpen ? "lg:hidden" : "block"}`}>
              <OrigineLogo />
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Origine Studio • Panel Kontrol Staf</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase border ${badgeInfo.color}`}
            >
              <BadgeIcon className="w-3 h-3" />
              <span>{badgeInfo.label}</span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-red-500/50 text-xs font-mono text-zinc-300 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* 3. Mobile Navigation Drawer (Full Height, Scrollable & Animated) */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-out Drawer Panel */}
            <div className="relative w-80 max-w-[85vw] bg-[#0e0e0e] border-r border-white/10 flex flex-col h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <OrigineLogo className="text-xl" />
                  <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mt-0.5">
                    PANEL ADMIN STUDIO
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Middle Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {/* User Card */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#720C10] flex items-center justify-center font-bold text-white shrink-0">
                    {session?.name ? session.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{session?.name}</p>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase mt-0.5 border ${badgeInfo.color}`}>
                      <BadgeIcon className="w-2.5 h-2.5" />
                      {badgeInfo.label}
                    </span>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-3 py-1 font-semibold">
                    MENU UTAMA ({visibleNav.length})
                  </p>
                  {visibleNav.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all ${
                          active
                            ? "bg-[#720C10] text-white font-semibold shadow-md"
                            : "text-zinc-300 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Footer */}
              <div className="p-4 border-t border-white/10 shrink-0 bg-[#0e0e0e] flex flex-col gap-2">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
                >
                  <span>Lihat Website Utama</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-950/60 text-xs font-mono uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Suspense
            fallback={
              <div className="py-24 flex flex-col items-center justify-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full border-2 border-[#720C10] border-t-white animate-spin" />
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  Memuat Ruang Kerja...
                </p>
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
