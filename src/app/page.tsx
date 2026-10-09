"use client";

import React, { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PortfolioGrid from "@/components/PortfolioGrid";
import StudioSpaces from "@/components/StudioSpaces";
import BookingEstimator from "@/components/BookingEstimator";
import AtelierAbout from "@/components/AtelierAbout";
import Footer from "@/components/Footer";
import { RotateCcw } from "lucide-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [replayKey, setReplayKey] = useState<number>(0);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const triggerReplay = useCallback(() => {
    setIsLoaded(false);
    // Scroll smoothly to top for perfect transition experience
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setReplayKey((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] text-[#F9F8F6]">
      {/* 1. CINEMATIC PRELOADER WITH PRECISION FLIP LOGO TRANSITION */}
      <Preloader
        key={replayKey}
        onComplete={handlePreloaderComplete}
        isReplaying={replayKey > 0}
      />

      {/* 2. FIXED NAVBAR WITH FLIP TARGET SLOT */}
      <Navbar isLoaded={isLoaded} onReplay={triggerReplay} />

      {/* 3. HERO EDITORIAL SECTION */}
      <main>
        <Hero isLoaded={isLoaded} />

        {/* 4. CURATED PORTFOLIO GRID WITH LIGHTBOX */}
        <PortfolioGrid />

        {/* 5. STUDIO ARCHITECTURE & SPACES */}
        <StudioSpaces />

        {/* 6. INTERACTIVE BOOKING ESTIMATOR & RESERVATION */}
        <BookingEstimator />

        {/* 7. ATELIER ABOUT & CLIENT ROSTER */}
        <AtelierAbout />
      </main>

      {/* 8. EDITORIAL FOOTER */}
      <Footer onReplay={triggerReplay} />

      {/* 9. FLOATING DEV / PRESENTATION REPLAY CONTROLLER */}
      {isLoaded && (
        <aside aria-label="Dev Controls" className="fixed bottom-6 right-6 z-40 animate-in fade-in duration-500">
          <button
            type="button"
            onClick={triggerReplay}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#161616]/90 hover:bg-[#720C10] text-zinc-300 hover:text-white border border-white/15 hover:border-[#720C10] shadow-2xl backdrop-blur-md text-xs font-mono tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95"
            title="Putar ulang animasi pembuka sinematik"
          >
            <RotateCcw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-rotate-180" />
            <span className="hidden sm:inline">Putar Ulang Intro</span>
          </button>
        </aside>
      )}
    </div>
  );
}
