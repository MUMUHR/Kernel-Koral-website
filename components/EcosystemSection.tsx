'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface EcosystemStory {
  number: string;
  title: string;
  description: string;
}

const ECOSYSTEM_STORIES: EcosystemStory[] = [
  {
    number: '01',
    title: 'Cloud Computing',
    description:
      'The infrastructure behind virtual machines, hosting, and services at scale.',
  },
  {
    number: '02',
    title: 'Web Servers',
    description:
      'A widely used foundation for the servers that keep internet infrastructure running.',
  },
  {
    number: '03',
    title: 'Cybersecurity',
    description:
      'Research, digital forensics, and tools for authorized penetration testing.',
  },
  {
    number: '04',
    title: 'Software Development',
    description:
      'Programming, version control, automation, and deployment — from idea to production.',
  },
  {
    number: '05',
    title: 'Internet of Things',
    description:
      'Embedded systems and connected devices that sense, communicate, and respond.',
  },
  {
    number: '06',
    title: 'Supercomputing',
    description:
      'High-performance computing for research, simulation, and complex scientific workloads.',
  },
  {
    number: '07',
    title: 'Android',
    description:
      'Android uses a modified Linux kernel as part of its operating-system architecture.',
  },
];

export default function EcosystemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useGSAP(
    () => {
      // 1. Header reveal
      gsap.from('.eco-header-anim', {
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

      // 2. Portrait frame reveal
      gsap.from('.eco-portrait-anim', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.eco-storytelling-wrap',
          start: 'top 80%',
          once: true,
        },
      });

      // 3. Subtle parallax on portrait background image
      gsap.fromTo(
        '.eco-portrait-img',
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: '.eco-storytelling-wrap',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // 4. Story items stagger reveal + line draw
      const items = gsap.utils.toArray<HTMLElement>('.eco-story-item');
      items.forEach((item, idx) => {
        const rule = item.querySelector('.eco-story-rule');

        gsap.from(item, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          delay: idx * 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            once: true,
          },
        });

        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              once: true,
            },
          });
        }

        // Active Story Highlight as each row crosses middle viewport
        ScrollTrigger.create({
          trigger: item,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx),
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="ecosystem"
      ref={containerRef}
      className="relative w-full bg-[#000000] text-[#F0F0F0] py-20 sm:py-24 lg:py-28 overflow-x-clip"
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-10">
        {/* 1. Chapter Label */}
        <div className="eco-header-anim flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
          <span className="font-mono text-[11px] leading-[14.52px] tracking-[0.06em] uppercase text-[#F0F0F0]">
            05 / THE INVISIBLE FOUNDATION
          </span>
        </div>

        {/* 2. Section Heading */}
        <h2 className="eco-header-anim font-display font-medium text-5xl sm:text-7xl lg:text-[88px] leading-[1.04] tracking-[-0.04em] text-[#F0F0F0]">
          Linux Is Everywhere.
        </h2>

        {/* 3. Ecosystem Storytelling (Sticky Left Portrait + Right 01–07 Stack) */}
        <div className="eco-storytelling-wrap flex flex-col lg:flex-row items-start gap-12 lg:gap-20 pt-2">
          {/* Left Column: Infrastructure Portrait (Sticky on Desktop) */}
          <div className="eco-portrait-anim w-full lg:w-[470px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-6">
            <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden p-6 flex flex-col justify-between bg-[#090909]">
              <div className="eco-portrait-img absolute -inset-y-8 inset-x-0 pointer-events-none">
                <Image
                  src="/aset/tablet-transition-clouds.png"
                  alt="Technological landscape powered by Linux"
                  fill
                  sizes="(max-width: 1024px) 100vw, 470px"
                  className="object-cover"
                />
              </div>

              {/* Subtle gradient scrim for crisp Figma text legibility */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.72) 100%)',
                }}
              />

              {/* Top Coordinate + Active Story Tag */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] leading-[13.2px] uppercase text-[#F0F0F0]">
                  SYSTEMS / CONNECTED
                </span>
                <span className="font-mono text-[10px] leading-[13.2px] uppercase text-[#FFC500]">
                  {ECOSYSTEM_STORIES[activeIndex]?.number} / 07
                </span>
              </div>

              {/* Bottom Statement */}
              <h3 className="relative z-10 font-display font-normal text-4xl sm:text-5xl lg:text-[60px] leading-[1.05] tracking-[-0.04em] text-[#F0F0F0]">
                Often unseen.
                <br />
                Always at work.
              </h3>
            </div>

            <p className="font-mono text-[10px] leading-[16px] uppercase text-[#F0F0F0]">
              FROM A DEVICE IN YOUR POCKET TO A MACHINE EXPLORING THE UNIVERSE.
            </p>
          </div>

          {/* Right Column: Ecosystem Applications (01–07) */}
          <div className="flex-1 w-full flex flex-col">
            {ECOSYSTEM_STORIES.map((story, idx) => {
              const isActive = activeIndex === idx;
              return (
                <article
                  key={story.number}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="eco-story-item relative py-6 lg:py-7 flex items-start gap-6 transition-colors duration-300"
                >
                  {/* Animated Top Editorial Rule */}
                  <div
                    className={`eco-story-rule absolute top-0 left-0 right-0 h-[1px] transition-colors duration-300 ${
                      isActive ? 'bg-[#FFC500]' : 'bg-[#F0F0F0]/75'
                    }`}
                  />

                  {/* Number */}
                  <span
                    className={`font-mono text-[10px] leading-[13.2px] pt-2 shrink-0 transition-transform duration-300 ${
                      isActive ? 'text-[#FFC500] font-bold translate-x-0.5' : 'text-[#FFC500]/70'
                    }`}
                  >
                    {story.number}
                  </span>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={`font-display font-normal text-2xl sm:text-[30px] leading-[1.27] tracking-[-0.03em] transition-colors duration-300 ${
                          isActive ? 'text-[#FFC500]' : 'text-[#F0F0F0]'
                        }`}
                      >
                        {story.title}
                      </h3>

                      <span
                        className={`w-1.5 h-1.5 rounded-none transition-all duration-300 shrink-0 ${
                          isActive ? 'bg-[#FFC500] scale-100 opacity-100' : 'bg-[#F0F0F0] scale-0 opacity-0'
                        }`}
                      />
                    </div>

                    <p
                      className={`font-sans text-[14px] leading-[22.4px] transition-colors duration-300 ${
                        isActive ? 'text-[#F0F0F0]' : 'text-[#F0F0F0]/75'
                      }`}
                    >
                      {story.description}
                    </p>
                  </div>
                </article>
              );
            })}

            {/* Closing Bottom Rule */}
            <div className="h-[1px] w-full bg-[#F0F0F0]/35" />
          </div>
        </div>
      </div>
    </section>
  );
}
