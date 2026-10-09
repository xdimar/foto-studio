"use client";

import React, { useState, useEffect } from "react";
import OrigineLogo from "./OrigineLogo";
import { Sparkles, Calendar, Menu, X, ArrowUpRight, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  isLoaded: boolean;
  onReplay?: () => void;
}

export default function Navbar({ isLoaded, onReplay }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Portfolio", href: "#portfolio" },
    { name: "Studio Spaces", href: "#spaces" },
    { name: "Curated Series", href: "#series" },
    { name: "Rates & Booking", href: "#booking" },
    { name: "About Atelier", href: "#about" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl shadow-black/60"
            : "bg-transparent py-5 sm:py-7 border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* 1. LOGO SLOT (Target for FLIP transition) */}
            <div
              id="nav-logo-slot"
              className="relative flex items-center cursor-pointer transition-opacity duration-300"
              style={{
                opacity: isLoaded ? 1 : 0,
                fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <OrigineLogo className="text-white" />
            </div>

            {/* 2. DESKTOP NAVIGATION MENU (Cascade Reveal) */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="nav-item group relative text-[0.8rem] lg:text-[0.85rem] tracking-[0.16em] uppercase text-zinc-300 hover:text-white transition-colors duration-200 font-medium py-1"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? "translateY(0)" : "translateY(-15px)",
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s`,
                  }}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#720C10] group-hover:w-full transition-all duration-300 ease-out" />
                </a>
              ))}
            </nav>

            {/* 3. RIGHT ACTIONS: Sound toggle & CTA Book */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Subtle Ambient Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs tracking-wider uppercase text-zinc-400 hover:text-white hover:border-white/30 transition-all duration-200"
                title={soundEnabled ? "Mute Studio Ambient" : "Enable Studio Ambient"}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: "opacity 0.6s ease-out 0.4s",
                }}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#e03a42] animate-pulse" />
                    <span className="text-[10px]">Audio ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-[10px]">Mute</span>
                  </>
                )}
              </button>

              {/* Client Portal Link */}
              <a
                href="/auth/login"
                className="hidden lg:inline-flex items-center text-xs tracking-wider uppercase text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: "opacity 0.6s ease-out 0.45s",
                }}
              >
                Producer Sign In
              </a>

              {/* CTA Book Session Button */}
              <a
                href="#booking"
                onClick={(e) => scrollToSection(e, "#booking")}
                className="nav-cta group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#720C10] hover:bg-[#8e1015] text-white text-xs sm:text-[0.8rem] font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#720C10]/30 hover:shadow-[#720C10]/50 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? "translateY(0)" : "translateY(-15px)",
                  transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                }}
              >
                <span>Book Session</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white border border-white/10"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-xl md:hidden transition-all duration-500 flex flex-col justify-center px-8 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-6"
        }`}
      >
        <div className="flex flex-col gap-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#720C10] font-bold">Origine Atelier</p>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-2xl font-serif font-light text-white hover:text-[#720C10] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, "#booking")}
              className="w-full py-3.5 rounded-full bg-[#720C10] text-white font-medium uppercase tracking-wider text-sm text-center"
            >
              Reserve Studio
            </a>
            {onReplay && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplay();
                }}
                className="text-xs text-zinc-400 hover:text-white tracking-widest uppercase py-2"
              >
                ↺ Replay Preloader Sequence
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
