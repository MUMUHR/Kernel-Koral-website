'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

declare global {
  interface Window {
    __KORAL_SPLASH_DONE__?: boolean;
  }
}

const SPLASH_STORAGE_KEY = 'koral_splash_seen';
const BOOT_CMD = './discover --linux';

export default function SplashScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const blackPanelRef = useRef<HTMLDivElement>(null);
  const yellowPanelRef = useRef<HTMLDivElement>(null);
  const typedCmdRef = useRef<HTMLSpanElement>(null);
  const tuxWrapRef = useRef<HTMLDivElement>(null);
  const yellowTextRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasTriggeredHeroRef = useRef(false);

  const [isDone, setIsDone] = useState(false);

  const triggerHeroEntrance = () => {
    if (hasTriggeredHeroRef.current) return;
    hasTriggeredHeroRef.current = true;
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, '1');
    } catch {
      // Ignore storage errors in restricted contexts
    }
    window.__KORAL_SPLASH_DONE__ = true;
    window.dispatchEvent(new CustomEvent('koral:splash-done'));
  };

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SPLASH_STORAGE_KEY) === '1';
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen) {
      triggerHeroEntrance();
      const raf = requestAnimationFrame(() => setIsDone(true));
      return () => cancelAnimationFrame(raf);
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let ctx: gsap.Context | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const docWithPrerender = document as Document & {
      prerendering?: boolean;
    };

    const startAnimation = () => {
      if (cancelled) return;
      rafId = requestAnimationFrame(() => {
        if (cancelled) return;

        // Prevent SmoothScroll's lagSmoothing(0) from fast-forwarding splash in 1 frame
        gsap.ticker.lagSmoothing(500, 33);

        const typeState = { chars: 0 };
        const countState = { val: 0 };

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              triggerHeroEntrance();
              gsap.ticker.lagSmoothing(0);
              document.body.style.overflow = prevOverflow;
              setIsDone(true);
            },
          });
          tlRef.current = tl;

          // 1. Minimal CMD typing + bottom progress counter (00% -> 100%)
          tl.to(
            typeState,
            {
              chars: BOOT_CMD.length,
              duration: 0.62,
              ease: 'none',
              onUpdate: () => {
                if (typedCmdRef.current) {
                  typedCmdRef.current.textContent = BOOT_CMD.slice(
                    0,
                    Math.round(typeState.chars)
                  );
                }
              },
            },
            0.1
          )
            .to(
              countState,
              {
                val: 100,
                duration: 1.15,
                ease: 'power2.inOut',
                onUpdate: () => {
                  const pct = Math.round(countState.val);
                  if (counterRef.current) {
                    counterRef.current.textContent = `${String(pct).padStart(2, '0')}%`;
                  }
                },
              },
              0.05
            )
            .fromTo(
              progressLineRef.current,
              { scaleX: 0 },
              { scaleX: 1, duration: 1.15, ease: 'power2.inOut' },
              0.05
            )
            // 2. Two clean CMD response lines
            .fromTo(
              '.cmd-resp-line',
              { opacity: 0, y: 6 },
              {
                opacity: 1,
                y: 0,
                duration: 0.2,
                stagger: 0.16,
                ease: 'power2.out',
              },
              0.74
            )
            // 3. Black panel wipes up -> reveals bright #FFC500 panel
            .to(
              blackPanelRef.current,
              {
                yPercent: -100,
                duration: 0.56,
                ease: 'power4.inOut',
              },
              1.25
            )
            // 4. Brief yellow Tux moment
            .fromTo(
              tuxWrapRef.current,
              { y: 36, scale: 0.88, opacity: 0 },
              {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.42,
                ease: 'back.out(1.6)',
              },
              1.48
            )
            .fromTo(
              yellowTextRef.current,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.34, ease: 'power3.out' },
              1.56
            )
            // 5. Yellow panel + Tux zoom/expand and fade into Hero
            .to(
              tuxWrapRef.current,
              {
                scale: 2.2,
                opacity: 0,
                duration: 0.58,
                ease: 'power3.in',
              },
              2.05
            )
            .to(
              yellowTextRef.current,
              {
                scale: 1.35,
                opacity: 0,
                duration: 0.45,
                ease: 'power3.in',
              },
              2.05
            )
            .to(
              yellowPanelRef.current,
              {
                scale: 1.15,
                opacity: 0,
                duration: 0.58,
                ease: 'power3.inOut',
              },
              2.12
            )
            .call(triggerHeroEntrance, undefined, 2.34);
        }, rootRef);
      });
    };

    const onBecomeVisible = () => {
      if (!docWithPrerender.prerendering && document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', onBecomeVisible);
        document.removeEventListener('prerenderingchange', onBecomeVisible);
        startAnimation();
      }
    };

    if (!docWithPrerender.prerendering && document.visibilityState === 'visible') {
      startAnimation();
    } else {
      document.addEventListener('visibilitychange', onBecomeVisible);
      document.addEventListener('prerenderingchange', onBecomeVisible);
    }

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onBecomeVisible);
      document.removeEventListener('prerenderingchange', onBecomeVisible);
      if (rafId !== null) cancelAnimationFrame(rafId);
      ctx?.revert();
      gsap.ticker.lagSmoothing(0);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSkip = () => {
    if (tlRef.current) {
      tlRef.current.kill();
    }
    gsap.ticker.lagSmoothing(0);
    triggerHeroEntrance();
    gsap.to(rootRef.current, {
      scale: 1.08,
      opacity: 0,
      duration: 0.38,
      ease: 'power3.inOut',
      onComplete: () => {
        document.body.style.overflow = '';
        setIsDone(true);
      },
    });
  };

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      aria-label="Loading Koral Linux"
      className="fixed inset-0 z-[100] select-none overflow-hidden pointer-events-auto"
    >
      {/* Layer 2 (Behind): Yellow Swiss Panel + Tux Moment */}
      <div
        ref={yellowPanelRef}
        className="absolute inset-0 bg-[#FFC500] text-[#000000] flex flex-col justify-between p-6 lg:p-12"
      >
        <div className="max-w-[1776px] mx-auto w-full flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-bold">
          <span>KORAL-LINUX</span>
          <span>TUX // READY</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div
            ref={tuxWrapRef}
            className="w-40 h-44 sm:w-48 sm:h-56 relative opacity-0 will-change-transform"
          >
            <Image
              src="/aset/linux-pinguin.png"
              alt="Tux Linux Mascot"
              width={220}
              height={260}
              priority
              className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
            />
          </div>

          <div ref={yellowTextRef} className="text-center opacity-0">
            <p className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#000000]">
              DISCOVER LINUX
            </p>
          </div>
        </div>

        <div className="max-w-[1776px] mx-auto w-full flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-[#000000]/70">
          <span>EST. 1991</span>
          <span>OPEN SOURCE. OPEN POSSIBILITIES.</span>
        </div>
      </div>

      {/* Layer 1 (Front): Clean Black CMD Typing + Swiss Counter */}
      <div
        ref={blackPanelRef}
        className="absolute inset-0 bg-[#000000] text-[#F0F0F0] flex flex-col justify-between p-6 lg:p-12"
      >
        {/* Top Bar */}
        <div className="max-w-[1776px] mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#FFC500] inline-block" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-[#F0F0F0]/80">
              KORAL-LINUX // TTY1
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-[#F0F0F0]/60 hover:text-[#FFC500] transition-colors cursor-pointer"
          >
            [SKIP ↗]
          </button>
        </div>

        {/* Center Clean CMD Prompt (no box, ultra-minimal) */}
        <div className="max-w-[680px] mx-auto w-full flex flex-col gap-3">
          <div className="font-mono text-base sm:text-xl flex items-center flex-wrap gap-2">
            <span className="text-[#FFC500] font-bold">koral@linux:~$</span>
            <span ref={typedCmdRef} className="text-[#F0F0F0]" />
            <span className="inline-block w-2.5 h-5 sm:h-6 bg-[#FFC500] animate-pulse" />
          </div>

          <div className="flex flex-col gap-1 font-mono text-xs sm:text-sm text-[#F0F0F0]/55 pl-0.5">
            <div className="cmd-resp-line opacity-0">
              &gt; initializing kernel &amp; userland...{' '}
              <span className="text-emerald-400">ok</span>
            </div>
            <div className="cmd-resp-line opacity-0">
              &gt; waking up tux...{' '}
              <span className="text-[#FFC500]">ready</span>
            </div>
          </div>
        </div>

        {/* Bottom Swiss Counter + Hairline Progress */}
        <div className="max-w-[1776px] mx-auto w-full flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#F0F0F0]/50">
              BOOTING SESSION
            </span>
            <span
              ref={counterRef}
              className="font-display font-bold text-5xl sm:text-7xl leading-none tracking-tighter text-[#FFC500] tabular-nums"
            >
              00%
            </span>
          </div>

          <div className="w-full h-[2px] bg-white/15 overflow-hidden">
            <div
              ref={progressLineRef}
              className="w-full h-full bg-[#FFC500] origin-left scale-x-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
