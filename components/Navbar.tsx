'use client';

import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onStartQuiz?: () => void;
}

export default function Navbar({ onStartQuiz }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const transitionEl = document.getElementById('transition');
      const playgroundEl = document.getElementById('playground');

      const transRect = transitionEl ? transitionEl.getBoundingClientRect() : null;
      const playRect = playgroundEl ? playgroundEl.getBoundingClientRect() : null;

      // In Section 4 (Playground)
      if (playRect && playRect.top <= 100) {
        setIsDarkTheme(true);
        setIsHidden(false);
      }
      // In Section 3 (Transition Pinning Area)
      else if (transRect && transRect.top <= 100) {
        setIsHidden(true);
        setIsDarkTheme(false);
      }
      // In Section 1 & 2 (Light World)
      else {
        setIsHidden(false);
        setIsDarkTheme(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isHidden
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      } ${
        isDarkTheme
          ? 'bg-[#000000]/85 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : isScrolled
          ? 'bg-[#F0F0F0]/90 backdrop-blur-md border-b border-black/10 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Linux Wordmark */}
        <a
          href="#"
          className={`font-display font-bold text-2xl lg:text-[28px] tracking-tight transition-colors ${
            isDarkTheme
              ? 'text-white hover:text-[#FFC500]'
              : 'text-black hover:opacity-80'
          }`}
        >
          KORAL-LINUX
        </a>

        {/* Main Navigation */}
        <nav
          className={`hidden md:flex items-center gap-8 text-[12px] font-sans transition-colors ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}
        >
          <a
            href="#home"
            className="relative py-2 font-medium tracking-wide flex flex-col items-center"
          >
            <span className={isDarkTheme ? 'text-white/70 hover:text-white' : 'text-black'}>
              Home
            </span>
            {!isDarkTheme && (
              <span className="absolute bottom-0 w-full h-[2px] bg-[#FFC500]" />
            )}
          </a>
          <a
            href="#about"
            className={`py-2 tracking-wide transition-colors ${
              isDarkTheme
                ? 'text-white/70 hover:text-white'
                : 'text-black/70 hover:text-black'
            }`}
          >
            About Linux
          </a>
          <a
            href="#explore"
            className={`py-2 tracking-wide transition-colors ${
              isDarkTheme
                ? 'text-white/70 hover:text-white'
                : 'text-black/70 hover:text-black'
            }`}
          >
            Explore
          </a>
          <a
            href="#playground"
            className="relative py-2 font-medium tracking-wide flex flex-col items-center"
          >
            <span
              className={
                isDarkTheme
                  ? 'text-white'
                  : 'text-black/70 hover:text-black'
              }
            >
              Playground
            </span>
            {isDarkTheme && (
              <span className="absolute bottom-0 w-full h-[2px] bg-[#FFC500]" />
            )}
          </a>
          <a
            href="#distributions"
            className={`py-2 tracking-wide transition-colors ${
              isDarkTheme
                ? 'text-white/70 hover:text-white'
                : 'text-black/70 hover:text-black'
            }`}
          >
            Distributions
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <a
            href="#quiz"
            onClick={onStartQuiz}
            className={`inline-flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-[11px] tracking-wider uppercase border transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              isDarkTheme
                ? 'bg-[#FFC500] hover:bg-white text-black border-[#FFC500] shadow-[2px_2px_0px_rgba(255,197,0,0.5)]'
                : 'bg-[#FFC500] hover:bg-black hover:text-[#FFC500] text-black border-black shadow-[2px_2px_0px_#000000]'
            }`}
          >
            <span>START QUIZ</span>
            <span className="text-base leading-none">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
