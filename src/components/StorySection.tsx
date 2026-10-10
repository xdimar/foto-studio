"use client";

import React, { useRef, useState, useEffect } from "react";

export type StoryVariant =
  | "hero"
  | "portfolio"
  | "spaces"
  | "rates"
  | "about"
  | "contact"
  | "footer";

export type AnimationState = "enter" | "exit-up" | "exit-down";

interface StorySectionProps {
  id?: string;
  variant: StoryVariant;
  className?: string;
  children: (state: {
    animState: AnimationState;
    leftClass: string;
    rightClass: string;
    containerClass: string;
    headerClass: string;
  }) => React.ReactNode;
}

export default function StorySection({
  id,
  variant,
  className = "",
  children,
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // Default hero to 'enter' immediately for perfect LCP, others initialize to exit-down
  const [animState, setAnimState] = useState<AnimationState>(
    variant === "hero" ? "enter" : "exit-down"
  );

  useEffect(() => {
    let ticking = false;

    const handleScrollCheck = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      let nextState: AnimationState = "enter";

      if (variant === "hero") {
        // Hero is at the very top of the page.
        // It exits upwards when user scrolls down past it (top scrolled up or bottom in upper screen).
        if (rect.top < -120 || rect.bottom < vh * 0.65) {
          nextState = "exit-up";
        } else {
          nextState = "enter";
        }
      } else if (variant === "footer") {
        // Footer is at the very bottom.
        if (rect.top > vh * 0.9) {
          nextState = "exit-down";
        } else {
          nextState = "enter";
        }
      } else {
        // Standard interactive sections (portfolio, spaces, rates, about, contact)
        // 1. Below viewport: not entered yet from bottom, or exiting downwards
        if (rect.top > vh * 0.82) {
          nextState = "exit-down";
        }
        // 2. Exiting upwards: user has scrolled down past this section
        // (bottom is in upper viewport zone)
        else if (rect.bottom < Math.min(vh * 0.35, 300)) {
          nextState = "exit-up";
        }
        // 3. Fully in active view
        else {
          nextState = "enter";
        }
      }

      setAnimState((prev) => (prev !== nextState ? nextState : prev));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScrollCheck);
        ticking = true;
      }
    };

    // Run check immediately on mount and on scroll / resize
    handleScrollCheck();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [variant]);

  // Compute CSS classes based on variant and animation state
  let leftClass = "story-anim-container duration-700 ease-out ";
  let rightClass = "story-anim-container duration-700 ease-out ";
  let containerClass = "story-anim-container duration-700 ease-out ";
  let headerClass = "transition-all duration-700 ease-out ";

  if (animState === "enter") {
    headerClass += "opacity-100 translate-y-0 filter-none";
  } else if (animState === "exit-up") {
    headerClass += "opacity-0 -translate-y-8 blur-sm";
  } else {
    headerClass += "opacity-0 translate-y-8 blur-sm";
  }

  switch (variant) {
    case "hero":
      if (animState === "enter") {
        leftClass += "hero-left-enter";
        rightClass += "hero-right-enter";
        containerClass += "opacity-100";
      } else if (animState === "exit-up") {
        leftClass += "hero-left-exit-up";
        rightClass += "hero-right-exit-up";
        containerClass += "opacity-40";
      } else {
        leftClass += "hero-left-exit-down";
        rightClass += "hero-right-exit-down";
        containerClass += "opacity-0";
      }
      break;

    case "portfolio":
      if (animState === "enter") {
        leftClass += "port-left-enter";
        rightClass += "port-right-enter";
        containerClass += "opacity-100";
      } else if (animState === "exit-up") {
        leftClass += "port-left-exit-up";
        rightClass += "port-right-exit-up";
        containerClass += "opacity-30";
      } else {
        leftClass += "port-left-exit-down";
        rightClass += "port-right-exit-down";
        containerClass += "opacity-0";
      }
      break;

    case "spaces":
      if (animState === "enter") {
        leftClass += "space-left-enter";
        rightClass += "space-right-enter";
        containerClass += "opacity-100";
      } else if (animState === "exit-up") {
        leftClass += "space-left-exit-up";
        rightClass += "space-right-exit-up";
        containerClass += "opacity-30";
      } else {
        leftClass += "space-left-exit-down";
        rightClass += "space-right-exit-down";
        containerClass += "opacity-0";
      }
      break;

    case "rates":
      if (animState === "enter") {
        leftClass += "rates-left-enter";
        rightClass += "rates-right-enter";
        containerClass += "opacity-100";
      } else if (animState === "exit-up") {
        leftClass += "rates-left-exit-up";
        rightClass += "rates-right-exit-up";
        containerClass += "opacity-30";
      } else {
        leftClass += "rates-left-exit-down";
        rightClass += "rates-right-exit-down";
        containerClass += "opacity-0";
      }
      break;

    case "about":
      if (animState === "enter") {
        leftClass += "about-left-enter";
        rightClass += "about-right-enter";
        containerClass += "opacity-100";
      } else if (animState === "exit-up") {
        leftClass += "about-left-exit-up";
        rightClass += "about-right-exit-up";
        containerClass += "opacity-30";
      } else {
        leftClass += "about-left-exit-down";
        rightClass += "about-right-exit-down";
        containerClass += "opacity-0";
      }
      break;

    case "contact":
      if (animState === "enter") {
        leftClass += "contact-left-enter";
        rightClass += "contact-right-enter";
        containerClass += "opacity-100";
      } else if (animState === "exit-up") {
        leftClass += "contact-left-exit-up";
        rightClass += "contact-right-exit-up";
        containerClass += "opacity-30";
      } else {
        leftClass += "contact-left-exit-down";
        rightClass += "contact-right-exit-down";
        containerClass += "opacity-0";
      }
      break;

    case "footer":
      if (animState === "enter") {
        containerClass += "footer-enter";
      } else {
        containerClass += "footer-exit-down";
      }
      break;
  }

  return (
    <section id={id} ref={sectionRef} className={`relative ${className}`}>
      {children({ animState, leftClass, rightClass, containerClass, headerClass })}
    </section>
  );
}
