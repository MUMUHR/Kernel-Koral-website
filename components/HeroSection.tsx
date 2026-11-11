'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const headingWords = 'Discover the World of Linux.'.split(' ');

  useGSAP(
    () => {
      // 1. Initial page load entrance animation (synced with SplashScreen)
      const tlIntro = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      });

      tlIntro
        .from(cloudBgRef.current, {
          opacity: 0,
          scale: 1.08,
          duration: 1.2,
        })
        .from(
          '.hero-char',
          {
            yPercent: -115,
            opacity: 0,
            duration: 0.65,
            stagger: 0.022,
            ease: 'power4.out',
            clearProps: 'transform,opacity',
          },
          '-=0.9'
        )
        .from(
          '.hero-reveal',
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            clearProps: 'transform,opacity',
          },
          '-=0.85'
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

      const startHeroIntro = () => {
        if (tlIntro.progress() === 0 && !tlIntro.isActive()) {
          tlIntro.play(0);
        }
      };

      const win = window as Window & { __KORAL_SPLASH_DONE__?: boolean };
      const hasSplashNode = Boolean(
        document.querySelector('[aria-label="Loading Koral Linux"]')
      );

      let fallbackTimer: number | null = null;
      const docWithPrerender = document as Document & {
        prerendering?: boolean;
      };

      const armFallback = () => {
        if (
          fallbackTimer === null &&
          !docWithPrerender.prerendering &&
          document.visibilityState === 'visible'
        ) {
          fallbackTimer = window.setTimeout(startHeroIntro, 4000);
        }
      };

      if (win.__KORAL_SPLASH_DONE__ || !hasSplashNode) {
        startHeroIntro();
      } else {
        window.addEventListener('koral:splash-done', startHeroIntro, { once: true });
        if (!docWithPrerender.prerendering && document.visibilityState === 'visible') {
          armFallback();
        } else {
          document.addEventListener('visibilitychange', armFallback, { once: true });
          document.addEventListener('prerenderingchange', armFallback, { once: true });
        }
      }

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

          const getUntransformedTop = () => {
            const el = terminalMoveRef.current;
            const container = containerRef.current;
            if (!el || !container) return 420;
            let top = 0;
            let cur: HTMLElement | null = el;
            while (cur && cur !== container) {
              top += cur.offsetTop;
              cur = cur.offsetParent as HTMLElement | null;
            }
            return top;
          };

          const pinTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=1800',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
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
                y: () => {
                  const el = terminalMoveRef.current;
                  if (!el) return isDesktop ? -220 : -140;
                  const top = getUntransformedTop();
                  const navH = 72;
                  const stageH = stageHeaderRef.current?.offsetHeight || 88;
                  const stageGap = isDesktop ? 16 : 12;
                  const visualTotalH = stageH + stageGap + el.offsetHeight;
                  const availableH = Math.max(window.innerHeight - navH, visualTotalH + 24);
                  const targetVisualTop = navH + (availableH - visualTotalH) / 2;
                  const targetTerminalTop = targetVisualTop + stageH + stageGap;
                  return targetTerminalTop - top;
                },
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
                y: () => {
                  const el = terminalMoveRef.current;
                  if (!el) return isDesktop ? -450 : -320;
                  return -(getUntransformedTop() + el.offsetHeight + 100);
                },
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
      return () => {
        window.removeEventListener('koral:splash-done', startHeroIntro);
        document.removeEventListener('visibilitychange', armFallback);
        document.removeEventListener('prerenderingchange', armFallback);
        if (fallbackTimer !== null) {
          window.clearTimeout(fallbackTimer);
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#F0F0F0] text-black overflow-hidden pt-24 sm:pt-28 lg:pt-[clamp(6.25rem,10vh,8.5rem)] pb-8 lg:pb-10 flex flex-col justify-center"
    >
      {/* Background Cloud Layer with Parallax (extra bottom bleed prevents seam on y-scroll) */}
      <div
        ref={cloudBgRef}
        className="absolute -top-10 -bottom-48 left-0 right-0 pointer-events-none select-none z-0 opacity-55 mix-blend-multiply"
      >
        <Image
          src="/aset/desktop-hero-cloud-background.png"
          alt="Cloud Background"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="relative z-10 max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-4 sm:gap-5 lg:gap-[clamp(1rem,2.2vh,2rem)]">
        {/* Header Group: Chapter Label + Headline + Supporting Content */}
        <div ref={headerGroupRef} className="flex flex-col gap-3 sm:gap-4 lg:gap-[clamp(0.75rem,2vh,1.75rem)]">
          {/* 1. Chapter Label */}
          <div className="hero-reveal flex items-center gap-3 pt-1">
            <span className="w-2.5 h-2.5 bg-[#FFC500] inline-block shadow-sm" />
            <span className="font-mono text-[11px] tracking-[0.2em] font-semibold text-black uppercase">
              AN OPEN WORLD. AN OPEN MIND.
            </span>
          </div>

          {/* 2. Full-Width Hero Headline — Masked Per-Character Drop-In */}
          <div>
            <h1
              aria-label="Discover the World of Linux."
              className="font-display font-medium text-[clamp(2.5rem,10vw,4.5rem)] sm:text-[clamp(3.25rem,8vw,6rem)] lg:text-[min(7.8vw,11vh)] xl:text-[min(7.4vw,11.5vh)] 2xl:text-[min(7.3vw,136px)] leading-[0.92] tracking-tighter text-black"
            >
              {headingWords.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span className="inline-block whitespace-nowrap">
                    {word.split('').map((char, cIdx) => (
                      <span
                        key={cIdx}
                        aria-hidden="true"
                        className="inline-block overflow-hidden align-top py-[0.08em] -my-[0.08em]"
                      >
                        <span className="hero-char inline-block will-change-transform">
                          {char}
                        </span>
                      </span>
                    ))}
                  </span>
                  {wIdx < headingWords.length - 1 && ' '}
                </React.Fragment>
              ))}
            </h1>
          </div>

          {/* 3. Hero Supporting Content: Description (Left) + Annotations (Right) */}
          <div className="hero-reveal grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end pt-1 pb-3 lg:pb-5 border-b border-black/10">
            {/* Left: Introduction Description & Action Buttons */}
            <div className="lg:col-span-7 space-y-3 lg:space-y-4">
              <p className="font-sans text-sm sm:text-base lg:text-[clamp(0.95rem,1.25vw,1.2rem)] text-black/85 leading-relaxed max-w-2xl">
                An open-source world that powers technology, innovation, and freedom.
                Explore Linux, experiment with commands, and discover the technology behind
                the digital world.
              </p>

              <div className="flex flex-wrap items-center gap-3 lg:gap-4 pt-0.5">
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-[#FFC500] hover:bg-black hover:text-[#FFC500] text-black font-mono font-bold text-xs tracking-wider uppercase border border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span>START EXPLORING</span>
                  <span className="text-base leading-none">↗</span>
                </a>

                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-transparent hover:bg-black hover:text-white text-black font-mono font-bold text-xs tracking-wider uppercase border border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span>TAKE THE QUIZ</span>
                  <span className="text-base leading-none">↗</span>
                </Link>
              </div>
            </div>

            {/* Right: Exhibition Annotation */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-2 lg:gap-3 font-mono text-[11px] text-black/60">
              <span>EST. 1991 / BUILT TO BE OPEN</span>
              <div className="flex items-center gap-2 font-bold text-black animate-pulse">
                <span>SCROLL TO GO DEEPER</span>
                <span>↓</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Floating Terminal Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-start pt-1">
          {/* Left: Terminal Introduction */}
          <div ref={terminalIntroRef} className="lg:col-span-3 space-y-2 lg:space-y-3 pt-1">
            <div className="font-display text-5xl sm:text-6xl lg:text-[clamp(3.75rem,5.5vw,5.5rem)] font-bold leading-none text-black select-none">
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
          <div ref={terminalMoveRef} className="relative lg:col-span-9 w-full">
            {/* Contextual Header that fades in when terminal centers (zero flow push on all screens) */}
            <div
              ref={stageHeaderRef}
              className="opacity-0 pointer-events-none absolute bottom-full left-0 right-0 mb-3 lg:mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 border-b border-black pb-2.5 lg:pb-3"
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
