'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TerminalPreview from './TerminalPreview';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudBgRef = useRef<HTMLDivElement>(null);
  const headerGroupRef = useRef<HTMLDivElement>(null);
  const terminalIntroRef = useRef<HTMLDivElement>(null);
  const terminalMoveRef = useRef<HTMLDivElement>(null);
  const stageHeaderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial page load entrance animation
      const tlIntro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tlIntro
        .from(cloudBgRef.current, {
          opacity: 0,
          scale: 1.08,
          duration: 1.2,
        })
        .from(
          '.hero-reveal',
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
          },
          '-=0.8'
        )
        .from(
          '.terminal-entrance',
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.05)',
            clearProps: 'all',
          },
          '-=0.5'
        );

      // 2. Responsive Scroll Pinning Timeline:
      // Phase 1: Scroll down -> Headline/intro fade, terminal glides to center.
      // Phase 2: Terminal stays centered in focal stage ("untuk coba coba").
      // Phase 3: Scroll further -> Terminal floats up and fades out into Section 2.
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
          };

          const pinTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=1800',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          // [0.0 - 0.40] Phase 1: Header recedes, terminal moves to center
          pinTimeline
            .to(
              headerGroupRef.current,
              {
                opacity: 0,
                y: -60,
                duration: 0.4,
                ease: 'power2.inOut',
              },
              0
            )
            .to(
              terminalIntroRef.current,
              {
                opacity: 0,
                x: -30,
                duration: 0.35,
                ease: 'power2.inOut',
              },
              0
            )
            .to(
              terminalMoveRef.current,
              {
                xPercent: isDesktop ? -16.66 : 0,
                y: isDesktop ? -260 : -160,
                scale: isDesktop ? 1.04 : 1.01,
                duration: 0.4,
                ease: 'power2.inOut',
              },
              0
            )
            .fromTo(
              stageHeaderRef.current,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: 'power2.out',
              },
              0.15
            )
            .to(
              cloudBgRef.current,
              {
                y: -50,
                scale: 1.04,
                duration: 0.4,
                ease: 'none',
              },
              0
            );

          // [0.40 - 0.70] Phase 2: Hold stage in center for exploration ("coba coba")
          pinTimeline.to({}, { duration: 0.3 });

          // [0.70 - 1.00] Phase 3: Terminal glides upward and exits into Section 2
          pinTimeline
            .to(
              terminalMoveRef.current,
              {
                y: isDesktop ? -450 : -320,
                opacity: 0,
                scale: 0.94,
                duration: 0.3,
                ease: 'power2.in',
              },
              0.7
            )
            .to(
              cloudBgRef.current,
              {
                y: -110,
                opacity: 0.15,
                duration: 0.3,
                ease: 'power2.in',
              },
              0.7
            );
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#F0F0F0] text-black overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-16 flex flex-col justify-start"
    >
      {/* Background Cloud Layer with Parallax */}
      <div
        ref={cloudBgRef}
        className="absolute inset-0 pointer-events-none select-none z-0 opacity-55 mix-blend-multiply"
      >
        <Image
          src="/aset/desktop-hero-cloud-background.png"
          alt="Cloud Background"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="relative z-10 max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-8">
        {/* Header Group: Chapter Label + Headline + Supporting Content */}
        <div ref={headerGroupRef} className="flex flex-col gap-8">
          {/* 1. Chapter Label */}
          <div className="hero-reveal flex items-center gap-3 pt-2">
            <span className="w-2.5 h-2.5 bg-[#FFC500] inline-block shadow-sm" />
            <span className="font-mono text-[11px] tracking-[0.2em] font-semibold text-black uppercase">
              AN OPEN WORLD. AN OPEN MIND.
            </span>
          </div>

          {/* 2. Full-Width Hero Headline */}
          <div className="hero-reveal">
            <h1 className="font-display font-medium text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[132px] 2xl:text-[140px] leading-[0.92] tracking-tighter text-black">
              Discover the World of Linux.
            </h1>
          </div>

          {/* 3. Hero Supporting Content: Description (Left) + Annotations (Right) */}
          <div className="hero-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-2 pb-6 border-b border-black/10">
            {/* Left: Introduction Description & Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <p className="font-sans text-base sm:text-lg lg:text-xl text-black/85 leading-relaxed max-w-2xl">
                An open-source world that powers technology, innovation, and freedom.
                Explore Linux, experiment with commands, and discover the technology behind
                the digital world.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFC500] hover:bg-black hover:text-[#FFC500] text-black font-mono font-bold text-xs tracking-wider uppercase border border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span>START EXPLORING</span>
                  <span className="text-base leading-none">↗</span>
                </a>

                <a
                  href="#quiz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent hover:bg-black hover:text-white text-black font-mono font-bold text-xs tracking-wider uppercase border border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span>TAKE THE QUIZ</span>
                  <span className="text-base leading-none">↗</span>
                </a>
              </div>
            </div>

            {/* Right: Exhibition Annotation */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 font-mono text-[11px] text-black/60">
              <span>EST. 1991 / BUILT TO BE OPEN</span>
              <div className="flex items-center gap-2 font-bold text-black animate-pulse">
                <span>SCROLL TO GO DEEPER</span>
                <span>↓</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Floating Terminal Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
          {/* Left: Terminal Introduction */}
          <div ref={terminalIntroRef} className="lg:col-span-3 space-y-4 pt-2">
            <div className="font-display text-6xl lg:text-[88px] font-bold leading-none text-black select-none">
              {'>_'}
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold tracking-wider text-black uppercase leading-tight">
                YOUR FIRST CONVERSATION WITH THE MACHINE.
              </div>
              <p className="font-sans text-xs text-black/70">
                A few words. A world of possibilities.
              </p>
            </div>
          </div>

          {/* Right: Terminal Moving Wrapper */}
          <div ref={terminalMoveRef} className="lg:col-span-9 w-full">
            {/* Contextual Header that fades in when terminal centers */}
            <div
              ref={stageHeaderRef}
              className="opacity-0 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-black pb-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FFC500] inline-block shadow-sm" />
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-black">
                    INTERACTIVE TERMINAL / PLAYGROUND 01
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-black">
                  Talk directly to the kernel.
                </h3>
              </div>
              <p className="font-mono text-xs text-black/70 max-w-sm sm:text-right">
                Type commands or click quick chips below to explore Linux.
              </p>
            </div>

            <div className="terminal-entrance w-full">
              <TerminalPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
