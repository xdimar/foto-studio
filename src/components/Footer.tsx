"use client";

import React from "react";
import OrigineLogo from "./OrigineLogo";
import { ArrowUp, Instagram, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  onReplay?: () => void;
}

export default function Footer({ onReplay }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#080808] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Col 1 & 2: Brand & Atelier Narrative */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-white text-3xl">
              <OrigineLogo />
            </div>
            <p className="text-sm font-light text-zinc-400 max-w-sm leading-relaxed">
              Origine is a luxury photo studio and creative atelier designed for editorial fashion campaigns, fine-art portraiture, and high-impact commercial visual productions.
            </p>
            <div className="flex items-center gap-4 text-zinc-300">
              <span className="text-xs font-mono tracking-widest text-[#e03a42] uppercase">
                JAKARTA • BALI
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-xs font-mono text-zinc-500">EST. 2024</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
              EXPLORE
            </p>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  CURATED PORTFOLIO
                </a>
              </li>
              <li>
                <a href="#spaces" className="hover:text-white transition-colors">
                  STUDIO SUITES & CYC
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white transition-colors">
                  RATES & RESERVATIONS
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  ABOUT THE ATELIER
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Atelier Locations */}
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
              ATELIER ADDRESSES
            </p>
            <div className="space-y-3 text-xs font-mono text-zinc-400">
              <div>
                <p className="text-white font-medium">Origine Jakarta</p>
                <p className="text-zinc-500">Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan</p>
              </div>
              <div>
                <p className="text-white font-medium">Origine Bali Sanctuary</p>
                <p className="text-zinc-500">Jl. Pantai Batu Mejan, Canggu, Bali</p>
              </div>
            </div>
          </div>

          {/* Col 5: Production Concierge */}
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
              DIRECT DESK
            </p>
            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <p className="hover:text-white transition-colors">concierge@originestudio.com</p>
              <p className="hover:text-white transition-colors">+62 (21) 8089-2024</p>
              <p className="text-zinc-500">24/7 Access for Confirmed Sets</p>
            </div>

            {onReplay && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onReplay}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-[10px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#720C10] transition-colors"
                >
                  ↺ Replay Preloader Sequence
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} Origine Creative Studio. All Rights Reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <span className="uppercase tracking-wider text-[11px]">Return to Top</span>
            <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
