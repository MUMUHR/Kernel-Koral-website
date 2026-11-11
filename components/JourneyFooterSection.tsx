'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EXPLORE_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Linux', href: '#about' },
  { label: 'Explore', href: '#explore' },
  { label: 'Playground', href: '#playground' },
  { label: 'Distributions', href: '#distributions' },
  { label: 'Ecosystem', href: '#ecosystem' },
];

const KEEP_LEARNING_LINKS = [
  { label: 'Linux Documentation', href: 'https://www.kernel.org/doc/html/latest/' },
  { label: 'The Linux Kernel Archives', href: 'https://www.kernel.org/' },
  { label: 'The Linux Foundation', href: 'https://www.linuxfoundation.org/' },
  { label: 'GNU Learning Resources', href: 'https://www.gnu.org/manual/' },
];

const COMMUNITY_LINKS = [
  { label: 'Kernel.org Community', href: 'https://www.kernel.org/category/about.html' },
  { label: 'Distribution Communities', href: '#distributions' },
  { label: 'Linux User Groups', href: '#playground' },
  { label: 'Official Project Resources', href: 'https://docs.kernel.org/' },
];

export default function JourneyFooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingWords = 'Your Linux Journey Starts Here.'.split(' ');

  useGSAP(
    () => {
      // 1. Yellow CTA Editorial Reveal (Top coords & bottom copy)
      gsap.from('.cta-reveal-anim', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-banner-wrap',
          start: 'top 80%',
          once: true,
        },
      });

      // 1b. Masked Per-Character Kinetic Drop-In for Giant CTA Heading
      gsap.from('.cta-char', {
        yPercent: -115,
        opacity: 0,
        duration: 0.65,
        stagger: 0.022,
        ease: 'power4.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.cta-banner-wrap',
          start: 'top 80%',
          once: true,
        },
      });

      // 2. Subtle Parallax Float on Closing Arrow & Heading
      gsap.fromTo(
        '.cta-parallax-arrow',
        { y: 12 },
        {
          y: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cta-banner-wrap',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // 3. Footer Columns Stagger + Editorial Rule Draw
      gsap.from('.footer-col-anim', {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer-wrap',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('.footer-rule-anim', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-wrap',
          start: 'top 82%',
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full bg-[#000000]">
      {/* Final Invitation CTA Banner (#FFC500) */}
      <section
        id="cta"
        className="cta-banner-wrap w-full bg-[#FFC500] text-[#000000] py-20 sm:py-24 lg:py-[104px]"
      >
        <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-9">
          {/* Closing Coordinates Row */}
          <div className="cta-reveal-anim flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] leading-[13.2px] uppercase text-[#000000]">
              THE NEXT CHAPTER IS YOURS.
            </span>
            <span className="cta-parallax-arrow font-sans text-[24px] leading-[29px] text-[#000000] select-none">
              ↗
            </span>
          </div>

          {/* Giant Display Heading — Masked Per-Character Drop-In */}
          <h2
            aria-label="Your Linux Journey Starts Here."
            className="font-display font-medium text-5xl sm:text-7xl lg:text-[96px] xl:text-[116px] leading-[1.04] tracking-[-0.04em] text-[#000000]"
          >
            {headingWords.map((word, wIdx) => (
              <React.Fragment key={wIdx}>
                <span className="inline-block whitespace-nowrap">
                  {word.split('').map((char, cIdx) => (
                    <span
                      key={cIdx}
                      aria-hidden="true"
                      className="inline-block overflow-hidden align-top py-[0.06em] -my-[0.06em]"
                    >
                      <span className="cta-char inline-block will-change-transform">
                        {char}
                      </span>
                    </span>
                  ))}
                </span>
                {wIdx < headingWords.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h2>

          {/* Description + Action Button to /quiz */}
          <div className="cta-reveal-anim flex flex-col md:flex-row md:items-center justify-between gap-8 pt-1">
            <p className="font-sans text-[17px] leading-[27.2px] text-[#000000] max-w-[920px]">
              Explore the open-source world, learn new commands, and discover the possibilities of Linux.
            </p>

            <Link
              href="/quiz"
              className="group shrink-0 inline-flex items-center justify-between gap-8 px-5 py-5 bg-[#000000] text-[#FFC500] hover:bg-[#141414] transition-all duration-150"
            >
              <span className="font-mono text-[11px] leading-[14.52px] uppercase">
                START EXPLORING
              </span>
              <span className="font-sans text-[20px] leading-none transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (#000000) */}
      <footer
        id="footer"
        className="footer-wrap w-full bg-[#000000] text-[#F0F0F0] pt-16 pb-8"
      >
        <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-12">
          {/* Footer Directory */}
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Brand Statement */}
            <div className="footer-col-anim w-full lg:w-[340px] shrink-0 flex flex-col gap-5">
              <div className="font-display font-bold text-[52px] leading-[1.15] tracking-[-0.06em] text-[#F0F0F0]">
                LINUX
              </div>
              <p className="font-sans text-[14px] leading-[22.4px] text-[#F0F0F0]/85">
                An independent educational journey into Linux, the command line, and the open-source world. Built for curious minds.
              </p>
              <span className="font-mono text-[10px] leading-[16px] uppercase text-[#F0F0F0]">
                OPEN SOURCE. OPEN POSSIBILITIES.
              </span>
            </div>

            {/* Footer Resource Groups */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-10">
              {/* Group 1: EXPLORE */}
              <div className="footer-col-anim flex flex-col gap-5">
                <h3 className="font-mono text-[10px] leading-[13.2px] uppercase text-[#FFC500]">
                  EXPLORE
                </h3>
                <ul className="flex flex-col gap-3">
                  {EXPLORE_LINKS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="font-sans text-[12px] leading-[18px] text-[#F0F0F0]/85 hover:text-[#FFC500] transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 2: KEEP LEARNING */}
              <div className="footer-col-anim flex flex-col gap-5">
                <h3 className="font-mono text-[10px] leading-[13.2px] uppercase text-[#FFC500]">
                  KEEP LEARNING
                </h3>
                <ul className="flex flex-col gap-3">
                  {KEEP_LEARNING_LINKS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[12px] leading-[18px] text-[#F0F0F0]/85 hover:text-[#FFC500] transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 3: THE COMMUNITY */}
              <div className="footer-col-anim flex flex-col gap-5">
                <h3 className="font-mono text-[10px] leading-[13.2px] uppercase text-[#FFC500]">
                  THE COMMUNITY
                </h3>
                <ul className="flex flex-col gap-3">
                  {COMMUNITY_LINKS.map((item) => {
                    const isExternal = item.href.startsWith('http');
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          {...(isExternal
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="font-sans text-[12px] leading-[18px] text-[#F0F0F0]/85 hover:text-[#FFC500] transition-colors"
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Editorial Rule */}
          <div className="footer-rule-anim w-full h-[1px] bg-[#F0F0F0]" />

          {/* Legal Information */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="font-mono text-[9px] leading-[11.88px] uppercase text-[#F0F0F0]">
              © 2026 LINUX EXPLORER. EDUCATIONAL PROJECT.
            </span>
            <span className="font-mono text-[9px] leading-[13.5px] text-[#F0F0F0]/80">
              Linux® is the registered trademark of Linus Torvalds.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
