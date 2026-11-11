'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface DistroItem {
  id: string;
  index: string;
  name: string;
  logo: string;
  tagline: string;
  headline: string;
  description: string;
  subNote: string;
  characteristics: string;
  base: string;
  packageManager: string;
  releaseModel: string;
  difficulty: string;
  highlights: string[];
  sampleCommand: string;
  officialUrl: string;
}

const ALL_DISTROS: DistroItem[] = [
  {
    id: 'ubuntu',
    index: '01',
    name: 'Ubuntu',
    logo: '/aset/distro/ubuntu.svg',
    tagline: 'FEATURED / A PLACE TO BEGIN',
    headline: 'Your first desktop.\nYour next server.',
    description:
      'A beginner-friendly Debian-based distribution for desktops and servers. Ubuntu combines a broad software ecosystem, regular releases, and long-term support options.',
    subNote:
      'A distribution packages the Linux kernel with tools and apps into a complete operating system. Start with your needs, then explore the differences.',
    characteristics: 'BEST FOR / GETTING STARTED · DESKTOP · SERVER',
    base: 'Debian',
    packageManager: 'APT / Snap',
    releaseModel: 'Fixed LTS (5 yrs)',
    difficulty: 'Beginner Friendly',
    highlights: [
      'Backed by Canonical with predictable Long Term Support (LTS) releases every 2 years.',
      'Huge community documentation, beginner tutorials, and hardware driver support out of the box.',
      'Dominant image across cloud providers (AWS, GCP, Azure) and container environments.',
    ],
    sampleCommand: 'apt update',
    officialUrl: 'https://ubuntu.com',
  },
  {
    id: 'debian',
    index: '02',
    name: 'Debian',
    logo: '/aset/distro/debian.svg',
    tagline: 'THE STEADY FOUNDATION',
    headline: 'Rock-solid bedrock.\nBuilt to outlast.',
    description:
      'Known for stability and an extensive package repository. A community project that forms the foundation of many other distributions.',
    subNote:
      'Community-governed since 1993, Debian powers production servers worldwide and serves as the upstream base for Ubuntu, Mint, and Kali.',
    characteristics: 'COMMUNITY / STABILITY',
    base: 'Independent',
    packageManager: 'APT (.deb)',
    releaseModel: 'Stable / Testing',
    difficulty: 'Intermediate',
    highlights: [
      'One of the oldest and purest community-governed Linux distributions since 1993.',
      'Serves as the upstream bedrock for Ubuntu, Linux Mint, Kali Linux, and Raspberry Pi OS.',
      'Thoroughly tested packages make it a top choice for production servers that rarely reboot.',
    ],
    sampleCommand: 'uname -a',
    officialUrl: 'https://www.debian.org',
  },
  {
    id: 'fedora',
    index: '03',
    name: 'Fedora',
    logo: '/aset/distro/fedora.svg',
    tagline: 'FOR WHAT COMES NEXT',
    headline: 'Leading-edge craft.\nDeveloper ready.',
    description:
      'A modern, developer-friendly distribution sponsored by Red Hat. Brings current open-source technologies to workstations and servers.',
    subNote:
      'Ships clean GNOME defaults, fresh Linux kernels, and modern tooling ahead of Red Hat Enterprise Linux.',
    characteristics: 'MODERN / DEVELOPMENT',
    base: 'Independent (RPM)',
    packageManager: 'DNF (.rpm)',
    releaseModel: 'Semi-Rolling (6 mos)',
    difficulty: 'Beginner – Intermediate',
    highlights: [
      'Ships fresh Linux kernels, GNOME desktop, PipeWire, and Wayland innovations early.',
      'Upstream testing ground for Red Hat Enterprise Linux (RHEL).',
      'Clean vanilla desktop experience favored by software engineers and Linus Torvalds himself.',
    ],
    sampleCommand: 'cat /etc/os-release',
    officialUrl: 'https://fedoraproject.org',
  },
  {
    id: 'arch',
    index: '04',
    name: 'Arch Linux',
    logo: '/aset/distro/archlinux.svg',
    tagline: 'BUILD IT YOUR WAY',
    headline: 'Minimal core.\nTotal control.',
    description:
      'A highly customizable rolling-release distribution. Gives experienced users more control over installation, components, and updates.',
    subNote:
      'Follows the KISS principle—start from a bare terminal, configure every layer yourself, and stay up to date with rolling releases.',
    characteristics: 'ROLLING / USER CONTROL',
    base: 'Independent',
    packageManager: 'Pacman + AUR',
    releaseModel: 'Rolling Release',
    difficulty: 'Advanced',
    highlights: [
      'Follows the KISS principle (Keep It Simple, Stupid) — install only what you explicitly want.',
      'Access to the Arch User Repository (AUR) and the world-renowned Arch Wiki.',
      'Continuous rolling updates mean you install once and stay current indefinitely.',
    ],
    sampleCommand: 'ls -la',
    officialUrl: 'https://archlinux.org',
  },
  {
    id: 'mint',
    index: '05',
    name: 'Linux Mint',
    logo: '/aset/distro/linuxmint.svg',
    tagline: 'A FAMILIAR DESKTOP',
    headline: 'Comfort on day one.\nZero friction.',
    description:
      'A beginner-friendly desktop with a familiar interface. Primarily Ubuntu-based, with Linux Mint Debian Edition also available.',
    subNote:
      'Designed for people switching from Windows or macOS, complete with multimedia codecs, Update Manager, and Timeshift snapshots.',
    characteristics: 'DESKTOP / APPROACHABLE',
    base: 'Ubuntu / Debian',
    packageManager: 'APT + Flatpak',
    releaseModel: 'Fixed LTS',
    difficulty: 'Beginner Friendly',
    highlights: [
      'Cinnamon desktop layout feels immediately comfortable for users migrating from Windows.',
      'Pre-loaded with everyday media codecs, Update Manager, and Timeshift system snapshots.',
      'Focuses on polish, low resource usage, and zero forced telemetry or clutter.',
    ],
    sampleCommand: 'free',
    officialUrl: 'https://linuxmint.com',
  },
  {
    id: 'kali',
    index: '06',
    name: 'Kali Linux',
    logo: '/aset/distro/kalilinux.svg',
    tagline: 'SECURITY WITH PURPOSE',
    headline: 'Built for auditing.\nTrained for defense.',
    description:
      'Tools for cybersecurity, authorized penetration testing, and digital forensics. Use only on systems you own or have permission to test.',
    subNote:
      'Pre-loaded with 600+ security auditing utilities for lab sandboxes, CTFs, and authorized security assessments.',
    characteristics: 'SECURITY / AUTHORIZED USE',
    base: 'Debian Testing',
    packageManager: 'APT (.deb)',
    releaseModel: 'Rolling',
    difficulty: 'Intermediate – Advanced',
    highlights: [
      'Pre-packaged with 600+ security auditing tools like Nmap, Wireshark, Metasploit, and John the Ripper.',
      'Maintained by Offensive Security for red teaming, forensics, and CTF competitions.',
      'Best run inside a VM, live USB, or sandboxed lab environment—not as a general daily desktop.',
    ],
    sampleCommand: '/bblug',
    officialUrl: 'https://www.kali.org',
  },
  {
    id: 'opensuse',
    index: '07',
    name: 'openSUSE',
    logo: '/aset/distro/opensuse.svg',
    tagline: 'FLEXIBLE BY DESIGN',
    headline: 'Stable Leap or\nrolling Tumbleweed.',
    description:
      'Versatile desktop and server options with powerful administration tools. Choose Leap or the rolling-release Tumbleweed.',
    subNote:
      'Features YaST system administration and automated openQA testing with Btrfs snapshots for reliable rollbacks.',
    characteristics: 'ADMINISTRATION / CHOICE',
    base: 'Independent (RPM)',
    packageManager: 'Zypper (.rpm)',
    releaseModel: 'Leap / Tumbleweed',
    difficulty: 'Intermediate',
    highlights: [
      'Includes YaST — an all-in-one graphical & CLI system administration control center.',
      'Tumbleweed offers rigorously automated-tested (openQA) rolling updates with Btrfs rollbacks.',
      'Leap provides rock-solid enterprise stability closely aligned with SUSE Linux Enterprise.',
    ],
    sampleCommand: 'ip addr',
    officialUrl: 'https://www.opensuse.org',
  },
];

export default function DistributionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [featuredId, setFeaturedId] = useState<string>('ubuntu');
  const [activeDistro, setActiveDistro] = useState<DistroItem | null>(null);

  const featuredDistro =
    ALL_DISTROS.find((d) => d.id === featuredId) ?? ALL_DISTROS[0];
  const gridDistros = ALL_DISTROS.filter((d) => d.id !== featuredDistro.id);

  // Close modal on ESC and navigate with ArrowLeft / ArrowRight
  useEffect(() => {
    if (!activeDistro) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDistro(null);
      } else if (e.key === 'ArrowRight') {
        const idx = ALL_DISTROS.findIndex((d) => d.id === activeDistro.id);
        setActiveDistro(ALL_DISTROS[(idx + 1) % ALL_DISTROS.length]);
      } else if (e.key === 'ArrowLeft') {
        const idx = ALL_DISTROS.findIndex((d) => d.id === activeDistro.id);
        setActiveDistro(ALL_DISTROS[(idx - 1 + ALL_DISTROS.length) % ALL_DISTROS.length]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeDistro]);

  useGSAP(
    () => {
      // 1. Header stagger reveal
      gsap.from('.dist-header-anim', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      // 2. Featured editorial rule draw & split reveal on initial scroll
      gsap.from('.dist-featured-rule', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      gsap.from('.dist-featured-left', {
        x: -26,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.dist-featured-right', {
        x: 26,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // 3. Collection cards stagger reveal
      gsap.from('.dist-card-item', {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dist-grid-wrap',
          start: 'top 82%',
          once: true,
        },
      });

      // 4. Subtle parallax drift on collection count tag
      gsap.to('.dist-count-parallax', {
        y: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  // Animate Featured slot swap whenever user promotes a card
  const handleSelectDistro = (id: string) => {
    if (id === featuredId) return;
    setFeaturedId(id);

    if (featuredRef.current) {
      const rect = featuredRef.current.getBoundingClientRect();
      if (rect.top < 84 || rect.top > window.innerHeight * 0.55) {
        const targetY = window.scrollY + rect.top - 104;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }

    requestAnimationFrame(() => {
      if (!featuredRef.current) return;
      const leftEl = featuredRef.current.querySelector('.dist-featured-left');
      const rightEl = featuredRef.current.querySelector('.dist-featured-right');
      const ruleEl = featuredRef.current.querySelector('.dist-featured-rule');

      if (leftEl) {
        gsap.fromTo(
          leftEl,
          { x: -24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }
      if (rightEl) {
        gsap.fromTo(
          rightEl,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }
      if (ruleEl) {
        gsap.fromTo(
          ruleEl,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform' }
        );
      }
    });
  };

  const handleTestInPlayground = (cmd: string) => {
    setActiveDistro(null);
    const playgroundEl = document.getElementById('playground');
    if (playgroundEl) {
      playgroundEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('koral:try-command', { detail: { command: cmd } })
      );
    }, 350);
  };

  const activeIndex = activeDistro
    ? ALL_DISTROS.findIndex((d) => d.id === activeDistro.id)
    : -1;

  return (
    <section
      id="distributions"
      ref={containerRef}
      className="relative w-full bg-[#F0F0F0] text-black py-20 sm:py-24 lg:py-28 overflow-hidden"
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-10">
        {/* 1. Chapter Label */}
        <div className="dist-header-anim flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
          <span className="font-mono text-[11px] leading-[14.52px] tracking-[0.06em] uppercase text-black">
            04 / FIND YOUR FLAVOR
          </span>
        </div>

        {/* 2. Section Heading */}
        <h2 className="dist-header-anim font-display font-medium text-5xl sm:text-7xl lg:text-[88px] leading-[1.04] tracking-[-0.04em] text-black">
          One Kernel.
          <br />
          Many Possibilities.
        </h2>

        {/* 3. Distro Introduction Row */}
        <div className="dist-header-anim flex flex-col md:flex-row md:items-start justify-between gap-4">
          <p className="font-sans text-base lg:text-[18px] leading-[28.8px] text-black max-w-[630px]">
            Explore the diverse world of Linux distributions, each designed for different
            needs, workflows, and experiences. Select any distribution below to inspect it
            in the spotlight.
          </p>
          <span className="dist-count-parallax font-mono text-[11px] leading-[14.52px] uppercase text-black shrink-0 md:pt-1">
            07 DISTRIBUTIONS / ONE SHARED CORE
          </span>
        </div>

        {/* 4. Featured Distribution Spotlight (Active Switcher) */}
        <div
          ref={featuredRef}
          className="dist-featured-wrap border-t-2 border-b border-black py-10 lg:py-12 flex flex-col lg:flex-row items-start gap-10 lg:gap-16"
        >
          {/* Left Column: Identity */}
          <div className="dist-featured-left w-full lg:w-[360px] shrink-0 flex flex-col gap-5 lg:gap-6">
            <div className="flex items-center justify-between">
              <div className="w-24 h-24 flex items-center justify-start">
                <Image
                  src={featuredDistro.logo}
                  alt={featuredDistro.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>

              <span className="font-mono text-[11px] px-2.5 py-1 bg-[#FFC500] border border-black font-bold uppercase">
                ACTIVE #{featuredDistro.index}
              </span>
            </div>

            <h3 className="font-display font-normal text-5xl sm:text-[64px] lg:text-[72px] leading-[1.12] tracking-[-0.05em] text-black">
              {featuredDistro.name}
            </h3>

            <span className="font-mono text-[10px] leading-[13.2px] uppercase text-black">
              {featuredDistro.tagline}
            </span>
          </div>

          {/* Right Column: Featured Detail */}
          <div className="dist-featured-right flex-1 w-full flex flex-col gap-6">
            <h4 className="font-display font-normal text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] tracking-[-0.03em] text-black whitespace-pre-line">
              {featuredDistro.headline}
            </h4>

            <p className="font-sans text-[15px] lg:text-[16px] leading-[25.6px] text-black">
              {featuredDistro.description}
            </p>

            <div className="dist-featured-rule h-[1px] w-full bg-black" />

            {/* Spec Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-black px-3 py-2.5 flex flex-col gap-0.5">
                <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                  BASE
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  {featuredDistro.base}
                </span>
              </div>
              <div className="bg-white border border-black px-3 py-2.5 flex flex-col gap-0.5">
                <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                  PACKAGES
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  {featuredDistro.packageManager}
                </span>
              </div>
              <div className="bg-white border border-black px-3 py-2.5 flex flex-col gap-0.5">
                <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                  RELEASE
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  {featuredDistro.releaseModel}
                </span>
              </div>
              <div className="bg-white border border-black px-3 py-2.5 flex flex-col gap-0.5">
                <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                  LEVEL
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  {featuredDistro.difficulty}
                </span>
              </div>
            </div>

            <span className="font-mono text-[11px] leading-[17.6px] uppercase text-black">
              {featuredDistro.characteristics}
            </span>

            <p className="font-sans text-[14px] leading-[22.4px] text-black/85">
              {featuredDistro.subNote}
            </p>

            {/* Featured Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveDistro(featuredDistro)}
                className="h-[50px] px-5 inline-flex items-center gap-4 border border-black bg-transparent hover:bg-[#FFC500] text-black font-mono font-bold text-[11px] leading-[14.52px] uppercase transition-colors cursor-pointer"
              >
                <span>EXPLORE MORE</span>
                <span className="text-[18px] leading-none font-sans">↗</span>
              </button>

              <button
                type="button"
                onClick={() => handleTestInPlayground(featuredDistro.sampleCommand)}
                className="h-[50px] px-5 inline-flex items-center gap-3 border border-black bg-[#FFC500] hover:bg-black hover:text-[#FFC500] text-black font-mono font-bold text-[11px] leading-[14.52px] uppercase shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <span>TRY &apos;{featuredDistro.sampleCommand}&apos; IN TERMINAL</span>
                <span>↗</span>
              </button>

              {featuredDistro.id !== 'ubuntu' && (
                <button
                  type="button"
                  onClick={() => handleSelectDistro('ubuntu')}
                  className="h-[50px] px-4 inline-flex items-center gap-2 border border-black/40 hover:border-black bg-white/70 hover:bg-white text-black font-mono text-[10px] uppercase transition-colors cursor-pointer"
                >
                  ↺ RESET FEATURED
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Distribution Collection (6 Remaining Cards, 2-Column Grid) */}
        <div className="dist-grid-wrap grid grid-cols-1 lg:grid-cols-2 gap-x-10 xl:gap-x-14">
          {gridDistros.map((distro) => (
            <article
              key={distro.id}
              onClick={() => handleSelectDistro(distro.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectDistro(distro.id);
                }
              }}
              className="dist-card-item group border-t border-black py-8 lg:py-9 flex flex-col gap-6 cursor-pointer transition-colors hover:bg-white/55 px-3 -mx-3"
            >
              {/* Distribution Identity */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white shrink-0 flex items-center justify-center p-4 border border-black/10 transition-all duration-200 group-hover:border-black group-hover:shadow-[3px_3px_0px_#FFC500]">
                    <Image
                      src={distro.logo}
                      alt={distro.name}
                      width={64}
                      height={64}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display font-normal text-3xl lg:text-[36px] leading-[1.2] tracking-[-0.04em] text-black">
                      {distro.name}
                    </h3>
                    <span className="font-mono text-[9px] leading-[11.88px] uppercase text-black">
                      {distro.tagline}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[10px] text-black/45 group-hover:text-black transition-colors shrink-0">
                  #{distro.index}
                </span>
              </div>

              {/* Description */}
              <p className="font-sans text-[15px] leading-[24px] text-black">
                {distro.description}
              </p>

              {/* Profile Footer */}
              <div className="mt-auto flex items-center justify-between gap-4 pt-1">
                <span className="font-mono text-[9px] leading-[11.88px] uppercase text-black/85">
                  {distro.characteristics}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] leading-[13.2px] uppercase text-black px-2 py-1 transition-colors group-hover:bg-[#FFC500] group-hover:font-bold">
                    <span>FOCUS</span>
                    <span className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
                      ↑
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDistro(distro);
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[10px] leading-[13.2px] uppercase text-black px-2 py-1 border border-black/25 hover:border-black hover:bg-black hover:text-[#FFC500] transition-colors cursor-pointer"
                  >
                    <span>DETAILS</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Distro Detail Drawer / Modal */}
      {activeDistro && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
          onClick={() => setActiveDistro(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeDistro.name} details`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#F0F0F0] text-black border-2 border-black shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top Modal Bar */}
            <div className="bg-black text-white px-5 py-3 flex items-center justify-between border-b border-black">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-[#FFC500] inline-block" />
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase">
                  DISTRO PROFILE / {activeDistro.index} — {activeDistro.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDistro(null)}
                className="font-mono text-[11px] tracking-wider uppercase text-white/80 hover:text-[#FFC500] cursor-pointer"
              >
                CLOSE [ESC]
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex flex-col gap-6">
              {/* Identity */}
              <div className="flex items-center gap-5 border-b border-black pb-6">
                <div className="w-20 h-20 bg-white border border-black flex items-center justify-center p-3 shrink-0 shadow-[3px_3px_0px_#000000]">
                  <Image
                    src={activeDistro.logo}
                    alt={activeDistro.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-black/65">
                    {activeDistro.tagline}
                  </span>
                  <h3 className="font-display font-medium text-4xl sm:text-5xl tracking-[-0.04em] text-black leading-none">
                    {activeDistro.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase text-black/75 pt-1">
                    {activeDistro.characteristics}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-[15px] leading-[24px] text-black/90">
                {activeDistro.description}
              </p>

              {/* Spec Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-black p-3 flex flex-col gap-1">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                    BASE
                  </span>
                  <span className="font-mono text-xs font-bold text-black">
                    {activeDistro.base}
                  </span>
                </div>
                <div className="bg-white border border-black p-3 flex flex-col gap-1">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                    PACKAGES
                  </span>
                  <span className="font-mono text-xs font-bold text-black">
                    {activeDistro.packageManager}
                  </span>
                </div>
                <div className="bg-white border border-black p-3 flex flex-col gap-1">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                    RELEASE
                  </span>
                  <span className="font-mono text-xs font-bold text-black">
                    {activeDistro.releaseModel}
                  </span>
                </div>
                <div className="bg-white border border-black p-3 flex flex-col gap-1">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-black/55">
                    LEVEL
                  </span>
                  <span className="font-mono text-xs font-bold text-black">
                    {activeDistro.difficulty}
                  </span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-black/65 font-bold">
                  WHY CHOOSE {activeDistro.name.toUpperCase()}
                </span>
                <ul className="flex flex-col gap-2">
                  {activeDistro.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-black/85"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FFC500] border border-black mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black">
                <button
                  type="button"
                  onClick={() => handleTestInPlayground(activeDistro.sampleCommand)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#FFC500] hover:bg-black hover:text-[#FFC500] text-black font-mono font-bold text-[11px] tracking-wider uppercase border border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>TRY &apos;{activeDistro.sampleCommand}&apos; IN PLAYGROUND</span>
                  <span>↗</span>
                </button>

                <a
                  href={activeDistro.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-black hover:text-white text-black font-mono font-bold text-[11px] tracking-wider uppercase border border-black transition-colors"
                >
                  <span>OFFICIAL SITE</span>
                  <span>↗</span>
                </a>

                {activeDistro.id !== featuredDistro.id && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectDistro(activeDistro.id);
                      setActiveDistro(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-transparent hover:bg-[#FFC500] text-black font-mono font-bold text-[11px] tracking-wider uppercase border border-black transition-colors cursor-pointer"
                  >
                    <span>SET FEATURED</span>
                    <span>↑</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer Prev / Next */}
            <div className="px-6 py-3 bg-white border-t border-black flex items-center justify-between font-mono text-[11px] uppercase">
              <button
                type="button"
                onClick={() =>
                  setActiveDistro(
                    ALL_DISTROS[(activeIndex - 1 + ALL_DISTROS.length) % ALL_DISTROS.length]
                  )
                }
                className="hover:text-[#FFC500] hover:bg-black px-2 py-1 transition-colors cursor-pointer"
              >
                ← PREV DISTRO
              </button>
              <span className="text-black/55">
                {activeIndex + 1} / {ALL_DISTROS.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveDistro(ALL_DISTROS[(activeIndex + 1) % ALL_DISTROS.length])
                }
                className="hover:text-[#FFC500] hover:bg-black px-2 py-1 transition-colors cursor-pointer"
              >
                NEXT DISTRO →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
