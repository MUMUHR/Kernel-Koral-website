'use client';

import React, { useState } from 'react';

const TUX_QUOTES = [
  'Tux says: Try "uname -a"! 🐧',
  'Did you know? Linux powers Mars rovers! 🚀',
  'Penguin approved. Keep typing! ⭐',
  'I use Linux btw. 🐧',
  'sudo apt-get install coffee ☕',
];

export default function TuxPeeker({ onSayHello }: { onSayHello?: (msg: string) => void }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMsg = TUX_QUOTES[quoteIndex % TUX_QUOTES.length];
    setQuoteIndex((prev) => prev + 1);
    setShowBubble(true);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);
    onSayHello?.(nextMsg);
  };

  return (
    <div
      className="absolute -right-7 sm:-right-10 top-12 z-30 select-none group cursor-pointer"
      onClick={handleClick}
      title="Click Tux for a tip!"
    >
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute bottom-full right-0 mb-2 w-48 sm:w-56 p-2 bg-[#FFC500] text-black font-mono text-[11px] font-semibold rounded shadow-[3px_3px_0px_#000000] border border-black animate-in fade-in zoom-in-95 duration-150 z-40">
          <div className="relative">
            <span>{TUX_QUOTES[(quoteIndex - 1) % TUX_QUOTES.length]}</span>
            {/* Bubble arrow */}
            <div className="absolute -bottom-3.5 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-black" />
            <div className="absolute -bottom-3 right-6 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#FFC500]" />
          </div>
        </div>
      )}

      {/* Tux Penguin Graphic */}
      <div
        className={`relative transition-transform duration-300 ease-out origin-left ${
          isWaving
            ? 'rotate-[-8deg] translate-x-1 scale-105'
            : 'group-hover:translate-x-1 group-hover:rotate-[-4deg]'
        }`}
      >
        <svg
          width="58"
          height="75"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[-3px_4px_6px_rgba(0,0,0,0.4)]"
        >
          {/* Penguin Black Outer Body */}
          <path
            d="M8 88 C4 65, 8 25, 34 10 C58 0, 78 20, 76 50 C74 78, 68 95, 20 95 C12 95, 9 92, 8 88 Z"
            fill="#111111"
          />

          {/* White Belly / Face Area */}
          <ellipse cx="40" cy="58" rx="20" ry="28" fill="#FFFFFF" />
          <ellipse cx="36" cy="34" rx="14" ry="16" fill="#FFFFFF" />

          {/* Left Eye */}
          <ellipse cx="28" cy="28" rx="4.5" ry="6.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.2" />
          <ellipse cx="26.5" cy="28" rx="2.5" ry="3.5" fill="#111111" />
          <circle cx="25.5" cy="26" r="1.2" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="39" cy="27" rx="4.5" ry="6.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.2" />
          <ellipse cx="37.5" cy="27" rx="2.5" ry="3.5" fill="#111111" />
          <circle cx="36.5" cy="25" r="1.2" fill="#FFFFFF" />

          {/* Yellow Beak */}
          <path
            d="M20 37 Q32 34 40 37 Q31 46 20 37 Z"
            fill="#FFC500"
            stroke="#E09200"
            strokeWidth="1.2"
          />

          {/* Cheerful Blush */}
          <ellipse cx="22" cy="38" rx="3.5" ry="2" fill="#FF8080" opacity="0.6" />
          <ellipse cx="44" cy="36" rx="3.5" ry="2" fill="#FF8080" opacity="0.6" />

          {/* Front Flipper / Wing resting on terminal border */}
          <path
            d="M8 48 C4 54, 0 66, 2 74 C4 76, 12 72, 14 62 C16 54, 12 48, 8 48 Z"
            fill="#1A1A1A"
            stroke="#000000"
            strokeWidth="1"
          />
          {/* Flipper Tip Overlap Highlight */}
          <path
            d="M0 64 Q6 64 6 72 Q0 72 0 64 Z"
            fill="#FFC500"
            opacity="0.85"
          />

          {/* Yellow Webbed Foot peeking */}
          <path
            d="M6 90 Q-2 94 4 98 Q14 96 16 91 Z"
            fill="#FFC500"
            stroke="#D68000"
            strokeWidth="1"
          />
        </svg>

        {/* Small Easter Egg Badge */}
        <span className="absolute -bottom-1 right-1 font-mono text-[8px] bg-black text-[#FFC500] px-1 py-0.5 rounded border border-[#FFC500]/40 opacity-0 group-hover:opacity-100 transition-opacity">
          TUX
        </span>
      </div>
    </div>
  );
}