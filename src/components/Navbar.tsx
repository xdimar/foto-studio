"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OrigineLogo from "./OrigineLogo";
import { Menu, X, ArrowUpRight, MessageCircle, User } from "lucide-react";

interface NavbarProps {
  isLoaded?: boolean;
  onReplay?: () => void;
}

export default function Navbar({ isLoaded = true, onReplay }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waNumber, setWaNumber] = useState("6285196671398");
  const [hours, setHours] = useState("08:00 - 22:00 WIB");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.settings.whatsappNumber) setWaNumber(data.settings.whatsappNumber.replace(/[^0-9]/g, ""));
          if (data.settings.operatingHours) setHours(data.settings.operatingHours);
        }
      } catch (_) {}
    }
    loadSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer and release scroll lock whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, [pathname]);

  // Lock scroll only when mobile menu is open, release on close
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { num: "01", name: "Portofolio", href: "/portfolio" },
    { num: "02", name: "Ruang Studio", href: "/spaces" },
    { num: "03", name: "Tarif & Paket", href: "/booking" },
    { num: "04", name: "Tentang Kami", href: "/about" },
    { num: "05", name: "Kontak & Lokasi", href: "/#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Smooth scroll only if clicking contact anchor while already on the home page
    if (href === "/#contact" && pathname === "/") {
      e.preventDefault();
      const element = document.querySelector("#contact");
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - navHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${
          scrolled
            ? "bg-[#0d0d0d]/92 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/80"
            : "bg-[#0d0d0d]/45 backdrop-blur-md border-b border-white/[0.08] py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* 1. LEFT: BRAND LOGO WITH FLIP SLOT */}
            <div className="flex items-center gap-3 shrink-0">
              <div
                id="nav-logo-slot"
                className="relative flex items-center cursor-pointer transition-opacity duration-300"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  fontSize: "clamp(1.4rem, 2vw, 1.95rem)",
                }}
                onClick={handleLogoClick}
                title="Origine Studio Malang — Beranda"
              >
                <OrigineLogo className="text-white hover:opacity-90 transition-opacity" />
              </div>
              <span className="hidden 2xl:inline-flex items-center gap-1.5 pl-3 border-l border-white/15 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MALANG
              </span>
            </div>

            {/* 2. CENTER: DESKTOP NAVIGATION MENU PILLS */}
            <nav
              className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner transition-opacity duration-500"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(-10px)",
                transition: "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
              }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-3.5 py-1.5 rounded-full text-[11px] lg:text-xs font-mono uppercase tracking-[0.14em] transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#720C10] text-white font-semibold shadow-md shadow-[#720C10]/40"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT ACTIONS: PORTAL LOGIN & CTA BOOK */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 shrink-0 transition-opacity duration-500"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(-10px)",
                transition: "opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s",
              }}
            >
              {/* Portal Login Link */}
              <Link
                href="/auth/login"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-mono tracking-wider uppercase text-zinc-400 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/[0.04] transition-all"
                title="Masuk ke portal klien"
              >
                <User className="w-3.5 h-3.5" />
                <span>Portal Masuk</span>
              </Link>

              {/* Primary Booking CTA */}
              <Link
                href="/booking"
                className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#720C10]/30 hover:shadow-[#720C10]/50 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Pesan Sesi</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4. MOBILE DRAWER WITH RICH EDITORIAL ARCHITECTURE */}
      <div
        className={`fixed inset-0 z-50 bg-[#0d0d0d]/98 backdrop-blur-2xl md:hidden transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-6"
        }`}
      >
        {/* Top Bar inside Drawer */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <OrigineLogo className="text-white text-2xl" />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/15 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
          >
            <span>Tutup</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Navigation Links */}
        <div className="flex flex-col gap-2.5 py-6 my-auto">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500 mb-2">
            NAVIGASI ORIGINE STUDIO
          </p>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? "bg-[#720C10]/25 border-[#720C10] text-white font-medium"
                    : "bg-white/[0.02] border-white/5 text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#ff6169]">{link.num}</span>
                  <span className="text-base font-serif font-light">{link.name}</span>
                </div>
                <ArrowUpRight className={`w-4 h-4 ${isActive ? "text-[#ff6169]" : "text-zinc-500"}`} />
              </Link>
            );
          })}
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1">
            <span>PONCOKUSUMO, MALANG</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {hours}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-3 rounded-xl border border-white/15 bg-white/[0.03] text-center text-xs font-mono uppercase tracking-wider text-zinc-200 hover:text-white"
            >
              Portal Klien
            </Link>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3.5 rounded-full bg-[#720C10] text-white font-mono font-semibold uppercase tracking-wider text-xs text-center shadow-lg shadow-[#720C10]/40 flex items-center justify-center gap-2"
          >
            <span>Reservasi Sesi Sekarang</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {onReplay && pathname === "/" && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onReplay();
              }}
              className="text-[11px] font-mono text-zinc-500 hover:text-white tracking-widest uppercase pt-2 cursor-pointer"
            >
              ↺ Putar Ulang Animasi Intro
            </button>
          )}
        </div>
      </div>
    </>
  );
}
