'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.refresh();

      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1500',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // 1. Initial coordinates fade in
      pinTimeline.fromTo(
        coordRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
        0
      );

      // 2. Cloud parallax movement and fade into darkness
      pinTimeline.fromTo(
        cloudRef.current,
        { y: 0, opacity: 0.65 },
        { y: -120, opacity: 0.15, duration: 0.7, ease: 'none' },
        0
      );

      // 3. Headline Line 1: "Less interface."
      pinTimeline.fromTo(
        headlineLine1Ref.current,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        },
        0.15
      );

      // 4. Headline Line 2: "More possibility."
      pinTimeline.fromTo(
        headlineLine2Ref.current,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        },
        0.28
      );

      // 5. Boot sequence prompt in yellow
      pinTimeline.fromTo(
        bootRef.current,
        { opacity: 0, x: -25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
        0.42
      );

      // 6. Hold stage (0.50 -> 0.75) for user to absorb the transition
      pinTimeline.to({}, { duration: 0.25 });

      // 7. Exit transition towards Section 4
      pinTimeline.to(
        [headlineLine1Ref.current, headlineLine2Ref.current, bootRef.current, coordRef.current],
        {
          y: -40,
          opacity: 0.1,
          duration: 0.25,
          ease: 'power2.in',
        },
        0.75
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="transition"
      ref={containerRef}
      className="relative w-full h-screen bg-[#000000] text-[#F0F0F0] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Top light world gradient mask connecting seamlessly from Section 2 */}
      <div className="absolute top-0 left-0 right-0 h-64 sm:h-80 bg-gradient-to-b from-[#F0F0F0] via-[#F0F0F0]/60 to-transparent z-10 pointer-events-none" />

      {/* Receding Cloud Layers */}
      <div
        ref={cloudRef}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <Image
          src="/aset/desktop-transition-clouds.png"
          alt="Transition clouds"
          fill
          priority
          className="object-cover object-center mix-blend-screen opacity-50"
        />
      </div>

      {/* Dark world bottom gradient mask */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#000000] to-transparent z-10 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-[1776px] mx-auto px-6 lg:px-12 w-full h-full flex flex-col justify-between pt-20 pb-16">
        {/* Top: Transition Coordinates */}
        <div
          ref={coordRef}
          className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-neutral-400 tracking-wider uppercase border-b border-white/10 pb-4"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FFC500] inline-block shadow-sm" />
            <span>SURFACE → SYSTEM</span>
          </span>
          <span>DEPTH / 002</span>
        </div>

        {/* Center / Bottom: Chapter Reveal */}
        <div className="space-y-8 max-w-5xl my-auto">
          <h2 className="font-display font-medium text-5xl sm:text-7xl md:text-8xl lg:text-[116px] xl:text-[128px] leading-[0.92] tracking-tighter text-[#F0F0F0] flex flex-col">
            <span ref={headlineLine1Ref} className="inline-block">
              Less interface.
            </span>
            <span ref={headlineLine2Ref} className="inline-block text-[#FFC500]">
              More possibility.
            </span>
          </h2>

          {/* Boot sequence indicator */}
          <div
            ref={bootRef}
            className="flex items-center gap-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#FFC500]"
          >
            <span className="w-2 h-2 bg-[#FFC500] inline-block animate-pulse" />
            <span>INITIALIZING YOUR NEXT CHAPTER</span>
            <span className="inline-block animate-pulse font-mono font-bold text-base">_</span>
          </div>
        </div>

        {/* Bottom space balance */}
        <div className="h-6" />
      </div>
    </section>
  );
}