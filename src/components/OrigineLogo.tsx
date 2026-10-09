"use client";

import React, { useId } from "react";

interface OrigineLogoProps {
  className?: string;
  isAnimatedMode?: boolean;
  onSymbolRef?: (el: HTMLDivElement | null) => void;
  onTextGroupRef?: (el: HTMLDivElement | null) => void;
  onLettersRef?: (el: HTMLSpanElement | null) => void;
  onScriptERef?: (el: HTMLSpanElement | null) => void;
  onSubtextRef?: (el: HTMLDivElement | null) => void;
  variant?: "full" | "symbol-only";
  scaleSize?: number; // default multiplier
}

export default function OrigineLogo({
  className = "",
  isAnimatedMode = false,
  onSymbolRef,
  onTextGroupRef,
  onLettersRef,
  onScriptERef,
  onSubtextRef,
  variant = "full",
}: OrigineLogoProps) {
  const uniqueId = useId().replace(/:/g, "_");

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ willChange: "transform" }}
    >
      {/* 1. SYMBOL "O" (SVG with vertical slit aperture cutout) */}
      <div
        ref={onSymbolRef}
        className="relative shrink-0 flex items-center justify-center aspect-square"
        style={{
          width: "1.25em",
          height: "1.25em",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id={`mask-slit-${uniqueId}`}>
              <rect width="100" height="100" fill="white" />
              {/* Vertical slit in center */}
              <rect
                x="47.5"
                y="20"
                width="5"
                height="60"
                rx="2.5"
                fill="black"
              />
            </mask>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="#FFFFFF"
            mask={`url(#mask-slit-${uniqueId})`}
          />
        </svg>
      </div>

      {/* 2. TEXT GROUP: "rigin" + cursive "e" + subtext "CREATIVE STUDIO" */}
      {variant === "full" && (
        <div
          ref={onTextGroupRef}
          className="relative flex flex-col justify-center ml-[0.1em]"
          style={{ overflow: isAnimatedMode ? "hidden" : "visible" }}
        >
          <div className="flex items-baseline leading-none">
            {/* Geometric Sans "rigin" */}
            <span
              ref={onLettersRef}
              className="font-syne font-black tracking-[-0.04em] text-white lowercase inline-block"
              style={{
                fontSize: "1.05em",
                lineHeight: "0.85",
                letterSpacing: "-0.04em",
              }}
            >
              rigine
            </span>

            {/* Cursive / script flowing italic "e" */}
            
          </div>

          {/* Subtext "STUDIO KREATIF" aligned under right side */}
          <div
            ref={onSubtextRef}
            className="flex items-center tracking-[0.24em] font-sans font-bold text-white/90 uppercase"
            style={{
              fontSize: "0.28em",
              marginTop: "0.26em",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
            }}
          >
            STUDIO KREATIF
          </div>
        </div>
      )}
    </div>
  );
}
