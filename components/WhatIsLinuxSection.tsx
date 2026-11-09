'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhatIsLinuxSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.refresh();

      // Animate each row: line expands, left col enters from left, right col enters from right
      const rows = gsap.utils.toArray<HTMLElement>('.swiss-row');

      rows.forEach((row) => {
        const line = row.querySelector('.swiss-line');
        const leftCol = row.querySelector('.swiss-col-left');
        const rightCol = row.querySelector('.swiss-col-right');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // 1. Divider line draws across from left to right
        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.7,
              ease: 'power2.out',
              clearProps: 'transformOrigin',
            },
            0
          );
        }

        // 2. Left column slides in from left
        if (leftCol) {
          tl.fromTo(
            leftCol,
            { x: -50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
            0.1
          );
        }

        // 3. Right column slides in from right
        if (rightCol) {
          tl.fromTo(
            rightCol,
            { x: 50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
            0.15
          );
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#F0F0F0] text-black pt-16 pb-28 border-t border-black overflow-hidden"
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-12 sm:gap-14">
        {/* ROW 1: Definition (Headline Left + Copy Right) */}
        <div className="swiss-row flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-12">
            {/* Left Column: Heading & Sub-label (from left) */}
            <div className="swiss-col-left lg:col-span-5 space-y-4">
              <h2 className="font-display font-medium text-5xl sm:text-7xl lg:text-[88px] leading-[0.98] tracking-tighter text-black whitespace-pre-line">
                {'What Exactly\nIs Linux?'}
              </h2>
              <div className="font-mono text-[10px] tracking-wider text-black uppercase font-semibold">
                A KERNEL. A MOVEMENT. A FOUNDATION.
              </div>
            </div>

            {/* Right Column: Description Paragraphs (from right) */}
            <div className="swiss-col-right lg:col-span-7 space-y-6 pt-2">
              <p className="font-sans text-xl sm:text-2xl text-black leading-relaxed font-normal">
                Linux is an open-source operating system kernel that powers a wide
                range of devices, from personal computers and servers to
                smartphones and supercomputers.
              </p>
              <p className="font-sans text-base sm:text-lg text-black/75 leading-relaxed font-normal">
                Linux was originally created by Linus Torvalds in 1991. Today, it
                has become one of the most important foundations of modern
                computing.
              </p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="swiss-line w-full h-[1px] bg-black" />
        </div>

        {/* ROW 2: Architecture Section (Core Explanation Left + Boxed Diagram Right) */}
        <div className="swiss-row flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center pb-12">
            {/* Left Column: Explanation (from left) */}
            <div className="swiss-col-left lg:col-span-5 space-y-3">
              <h3 className="font-sans font-semibold text-2xl sm:text-3xl text-black leading-snug">
                The core is only the beginning.
              </h3>
              <p className="font-sans text-base text-black/75 leading-relaxed max-w-lg">
                The kernel connects software to hardware. A complete distribution
                adds system tools, applications, and a package manager.
              </p>
            </div>

            {/* Right Column: Boxed Architecture Diagram (from right) */}
            <div className="swiss-col-right lg:col-span-7">
              <div className="border border-black flex flex-col bg-[#F0F0F0]">
                {/* Layer 1: Applications + Tools */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-black">
                  <span className="font-mono text-xs sm:text-sm text-black tracking-wide font-medium">
                    APPLICATIONS + TOOLS
                  </span>
                  <span className="font-mono text-[11px] text-black uppercase">
                    USER SPACE
                  </span>
                </div>

                {/* Layer 2: Linux Kernel (Solid Yellow #FFC500) */}
                <div className="px-6 py-5 bg-[#FFC500] flex items-center justify-between border-b border-black">
                  <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-black">
                    LINUX KERNEL
                  </span>
                  <span className="font-mono text-[11px] font-bold text-black uppercase tracking-wider">
                    CORE
                  </span>
                </div>

                {/* Layer 3: Hardware */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="font-mono text-xs sm:text-sm text-black tracking-wide font-medium">
                    HARDWARE / CPU · MEMORY · DEVICES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="swiss-line w-full h-[1px] bg-black" />
        </div>

        {/* ROW 3: Principles Pair 1 (01 Open Source & 02 Free & Flexible) */}
        <div className="swiss-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Card 01: Open Source (border-y only) */}
          <div className="swiss-col-left lg:col-span-4 border-y border-black py-7 px-3 sm:px-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between font-mono pb-4 text-xs text-black">
              <span className="font-bold">01</span>
              <span className="text-[10px] text-black/60 tracking-wider">
                CODE / SHARED
              </span>
            </div>
            <div className="space-y-3 my-auto py-2">
              <h4 className="font-display text-3xl sm:text-4xl text-black font-normal tracking-tight">
                Open Source
              </h4>
              <p className="font-sans text-sm sm:text-base text-black/80 leading-relaxed">
                The source is public. Study, modify, and distribute it under
                the applicable licenses.
              </p>
            </div>
          </div>

          {/* Card 02: Free & Flexible (border-y only) */}
          <div className="swiss-col-right lg:col-span-8 border-y border-black py-7 px-3 sm:px-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between font-mono pb-4 text-xs text-black">
              <span className="font-bold">02</span>
              <span className="text-[10px] text-black/60 tracking-wider">
                CHOICE / PERSONAL
              </span>
            </div>
            <div className="space-y-3 my-auto py-2">
              <h4 className="font-display text-3xl sm:text-4xl text-black font-normal tracking-tight">
                Free & Flexible
              </h4>
              <p className="font-sans text-sm sm:text-base text-black/80 leading-relaxed max-w-2xl">
                Many distributions are available without licensing fees. Shape
                your desktop, tools, and workflow.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 4: Principles Pair 2 (03 Security & 04 Stability) */}
        <div className="swiss-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Card 03: Security (border-y only) */}
          <div className="swiss-col-left lg:col-span-5 border-y border-black py-7 px-3 sm:px-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between font-mono pb-4 text-xs text-black">
              <span className="font-bold">03</span>
              <span className="text-[10px] text-black/60 tracking-wider">
                ACCESS / CONTROLLED
              </span>
            </div>
            <div className="space-y-3 my-auto py-2">
              <h4 className="font-display text-3xl sm:text-4xl text-black font-normal tracking-tight">
                Security
              </h4>
              <p className="font-sans text-sm sm:text-base text-black/80 leading-relaxed">
                User permissions, access controls, and security mechanisms
                help protect systems. No system is invulnerable.
              </p>
            </div>
          </div>

          {/* Card 04: Stability (border-y only) */}
          <div className="swiss-col-right lg:col-span-7 border-y border-black py-7 px-3 sm:px-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between font-mono pb-4 text-xs text-black">
              <span className="font-bold">04</span>
              <span className="text-[10px] text-black/60 tracking-wider">
                UPTIME / CONSISTENT
              </span>
            </div>
            <div className="space-y-3 my-auto py-2">
              <h4 className="font-display text-3xl sm:text-4xl text-black font-normal tracking-tight">
                Stability
              </h4>
              <p className="font-sans text-sm sm:text-base text-black/80 leading-relaxed max-w-2xl">
                Reliable, consistent operation makes Linux a trusted
                foundation for long-running systems.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 5: Principles Pair 3 (05 Community Driven & 06 Developer Friendly) */}
        <div className="swiss-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Card 05: Community Driven (border-y only) */}
          <div className="swiss-col-left lg:col-span-4 border-y border-black py-7 px-3 sm:px-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between font-mono pb-4 text-xs text-black">
              <span className="font-bold">05</span>
              <span className="text-[10px] text-black/60 tracking-wider">
                PROGRESS / COLLECTIVE
              </span>
            </div>
            <div className="space-y-3 my-auto py-2">
              <h4 className="font-display text-3xl sm:text-4xl text-black font-normal tracking-tight">
                Community Driven
              </h4>
              <p className="font-sans text-sm sm:text-base text-black/80 leading-relaxed">
                Individuals, communities, and organizations build, maintain,
                and improve Linux together.
              </p>
            </div>
          </div>

          {/* Card 06: Developer Friendly (border-y only) */}
          <div className="swiss-col-right lg:col-span-8 border-y border-black py-7 px-3 sm:px-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between font-mono pb-4 text-xs text-black">
              <span className="font-bold">06</span>
              <span className="text-[10px] text-black/60 tracking-wider">
                TOOLS / READY
              </span>
            </div>
            <div className="space-y-3 my-auto py-2">
              <h4 className="font-display text-3xl sm:text-4xl text-black font-normal tracking-tight">
                Developer Friendly
              </h4>
              <p className="font-sans text-sm sm:text-base text-black/80 leading-relaxed max-w-2xl">
                Languages, tools, the command line, and deployment workflows
                put powerful building blocks at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
