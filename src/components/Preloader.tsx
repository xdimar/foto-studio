"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import OrigineLogo from "./OrigineLogo";

interface PreloaderProps {
  onComplete: () => void;
  isReplaying?: boolean;
}

export default function Preloader({ onComplete, isReplaying = false }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const symbolElRef = useRef<HTMLDivElement | null>(null);
  const textGroupElRef = useRef<HTMLDivElement | null>(null);
  const lettersElRef = useRef<HTMLSpanElement | null>(null);
  const scriptEElRef = useRef<HTMLSpanElement | null>(null);
  const subtextElRef = useRef<HTMLDivElement | null>(null);

  const progressContainerRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  const statusMessageRef = useRef<HTMLParagraphElement | null>(null);

  const [preloaderActive, setPreloaderActive] = useState(true);

  useEffect(() => {
    // Lock body scrolling during preloader
    document.body.style.overflow = "hidden";

    // Ensure elements are present
    if (
      !overlayRef.current ||
      !logoWrapperRef.current ||
      !symbolElRef.current ||
      !textGroupElRef.current ||
      !progressContainerRef.current ||
      !progressFillRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. INITIAL SETUP
      gsap.set(overlayRef.current, {
        opacity: 1,
        yPercent: 0,
        display: "flex",
      });

      // Target slot initially hidden
      const navSlot = document.getElementById("nav-logo-slot");
      if (navSlot) {
        navSlot.style.opacity = "0";
      }

      // Hide and center the logo
      gsap.set(logoWrapperRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        clearProps: "transform",
      });

      // Phase 1 Initial State: Symbol scaled down and invisible
      gsap.set(symbolElRef.current, {
        scale: 0.3,
        opacity: 0,
        transformOrigin: "center center",
      });

      // Phase 2 Initial State: Text container collapsed and elements offset
      gsap.set(textGroupElRef.current, {
        width: 0,
        opacity: 0,
        overflow: "hidden",
      });

      gsap.set([lettersElRef.current, scriptEElRef.current, subtextElRef.current], {
        opacity: 0,
        x: -25,
      });

      // Phase 3 Initial State: Progress bar hidden
      gsap.set(progressContainerRef.current, {
        opacity: 0,
        y: 15,
      });

      // Measure natural width of the text group
      // Temporarily expand to calculate exact scrollWidth
      const currentWidth = textGroupElRef.current.style.width;
      textGroupElRef.current.style.width = "auto";
      const naturalTextWidth = textGroupElRef.current.scrollWidth || 220;
      textGroupElRef.current.style.width = currentWidth;

      // MASTER TIMELINE
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // ==========================================
      // FASE 1 — Center Inisiasi:
      // Symbol "O" appears at exact center (50vw, 50vh)
      // ==========================================
      tl.to(symbolElRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.95,
        ease: "power3.out",
      });

      // Short cinematic pause to absorb the aperture symbol
      tl.to({}, { duration: 0.25 });

      // ==========================================
      // FASE 2 — Expansion & Stagger Reveal:
      // Symbol "O" moves left as text container expands
      // "rigin", "e" cursive, and "CREATIVE STUDIO" stagger in
      // ==========================================
      tl.to(
        textGroupElRef.current,
        {
          width: naturalTextWidth,
          opacity: 1,
          duration: 0.9,
          ease: "power3.inOut",
        },
        "-=0.1"
      );

      // Staggered letters
      tl.to(
        lettersElRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.7"
      );

      tl.to(
        scriptEElRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        "-=0.45"
      );

      tl.to(
        subtextElRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.35"
      );

      // Fix width to auto so it stays responsive
      tl.add(() => {
        if (textGroupElRef.current) {
          textGroupElRef.current.style.width = "auto";
        }
      });

      // ==========================================
      // FASE 3 — Progress Bar (0% → 100%):
      // Counter 0% to 100% with dynamic status messages
      // ==========================================
      tl.to(progressContainerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      });

      const progressObj = { value: 0 };
      const statusSteps = [
        { max: 28, text: "Calibrating Optical Sensors..." },
        { max: 62, text: "Balancing Studio Illumination..." },
        { max: 88, text: "Curating Portfolio Archive..." },
        { max: 100, text: "Atelier Ready." },
      ];

      tl.to(progressObj, {
        value: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          const currentVal = Math.round(progressObj.value);
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${currentVal}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.innerText = `${currentVal}%`;
          }
          if (statusMessageRef.current) {
            const step = statusSteps.find((s) => currentVal <= s.max) || statusSteps[statusSteps.length - 1];
            statusMessageRef.current.innerText = step.text;
          }
        },
      });

      // Brief hold at 100%
      tl.to({}, { duration: 0.2 });

      // ==========================================
      // FASE 4 — Transisi FLIP Logo ke Navbar (Krusial):
      // Fade-out progress bar, measure getBoundingClientRect,
      // and translate/scale logo directly to #nav-logo-slot
      // ==========================================
      tl.to(progressContainerRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: "power2.in",
      });

      tl.add(() => {
        const targetSlot = document.getElementById("nav-logo-slot");
        const movingLogo = logoWrapperRef.current;

        if (!targetSlot || !movingLogo) {
          finishSequence();
          return;
        }

        // Exact Coordinate Calculations for FLIP
        const sourceRect = movingLogo.getBoundingClientRect();
        const targetRect = targetSlot.getBoundingClientRect();

        const deltaX = targetRect.left - sourceRect.left;
        const deltaY = targetRect.top - sourceRect.top;
        const scaleRatio = targetRect.width / (sourceRect.width || 1);

        // Perform Glide & Shrink FLIP animation
        gsap.to(movingLogo, {
          x: deltaX,
          y: deltaY,
          scale: scaleRatio,
          transformOrigin: "0 0",
          duration: 1.05,
          ease: "power3.inOut",
          onComplete: () => {
            // Seamless Handover: reveal target slot logo and hide moving preloader logo
            targetSlot.style.opacity = "1";
            movingLogo.style.opacity = "0";
          },
        });

        // ==========================================
        // FASE 5 — Page Cascade & Reveal:
        // Curtain slide-up and trigger page content reveal
        // ==========================================
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.95,
          delay: 0.35, // Starts as logo is gliding towards navbar
          ease: "power3.inOut",
          onComplete: () => {
            finishSequence();
          },
        });
      });

      function finishSequence() {
        document.body.style.overflow = "";
        setPreloaderActive(false);
        onComplete();
      }
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [onComplete, isReplaying]);

  if (!preloaderActive) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-[#720C10] flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Background Subtle Gradient & Grid Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#720C10] to-[#480609] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />

      {/* Decorative Atelier Header Mark */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-12 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-white/60 animate-ping" />
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-white/50">
          ORIGINE ATELIER • EST. 2024
        </span>
      </div>

      {/* Decorative Viewport Frame Markers (Editorial Camera Aesthetic) */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-12 font-mono text-[10px] text-white/40 tracking-widest hidden sm:block">
        [50mm f/1.2 • 1/250s • ISO 100]
      </div>
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-12 font-mono text-[10px] text-white/40 tracking-widest hidden sm:block">
        GRID: 3x3 • STUDIO ILLUMINATION ACTIVE
      </div>

      {/* CENTER LOGO WRAPPER (Target of FLIP glide & shrink) */}
      <div
        ref={logoWrapperRef}
        className="relative z-10 flex items-center justify-center"
        style={{
          fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
          willChange: "transform",
        }}
      >
        <OrigineLogo
          isAnimatedMode={true}
          onSymbolRef={(el) => (symbolElRef.current = el)}
          onTextGroupRef={(el) => (textGroupElRef.current = el)}
          onLettersRef={(el) => (lettersElRef.current = el)}
          onScriptERef={(el) => (scriptEElRef.current = el)}
          onSubtextRef={(el) => (subtextElRef.current = el)}
        />
      </div>

      {/* PROGRESS BAR & DYNAMIC STATUS (Fase 3) */}
      <div
        ref={progressContainerRef}
        className="relative z-10 mt-10 sm:mt-12 flex flex-col items-center w-[220px] sm:w-[280px]"
      >
        {/* Progress Track */}
        <div className="w-full h-[1.5px] sm:h-[2px] bg-white/20 rounded-full overflow-hidden relative">
          <div
            ref={progressFillRef}
            className="h-full bg-white transition-all duration-75 ease-linear rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: "0%" }}
          />
        </div>

        {/* Counter & Status Message */}
        <div className="w-full flex items-center justify-between mt-3 text-white/80 font-mono text-[11px] sm:text-xs">
          <p
            ref={statusMessageRef}
            className="tracking-wider uppercase text-[10px] sm:text-[11px] text-white/70 truncate max-w-[190px]"
          >
            Calibrating Optical Sensors...
          </p>
          <span
            ref={progressTextRef}
            className="font-semibold tabular-nums text-white"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
