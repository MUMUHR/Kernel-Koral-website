'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MiniQuizQuestion {
  topic: string;
  categoryLabel: string;
  question: string;
  choices: {
    letter: string;
    label: string;
    feedbackTitle: string;
    feedbackBody: string;
  }[];
}

const TOPIC_PILLS = [
  'Fundamentals',
  'History',
  'Commands',
  'Distributions',
  'Architecture',
  'Security',
] as const;

const MINI_QUIZ_QUESTIONS: MiniQuizQuestion[] = [
  {
    topic: 'Fundamentals',
    categoryLabel: 'IMPRESSION',
    question: 'Do you enjoy exploring this Linux website so far?',
    choices: [
      {
        letter: 'A',
        label: 'Yes, love the Swiss grid layout',
        feedbackTitle: 'Glad it resonates with you.',
        feedbackBody:
          'We designed every contrast, rule, and #FFC500 accent to feel like a clean technical manual.',
      },
      {
        letter: 'B',
        label: 'The terminal playground is cool',
        feedbackTitle: 'Nothing beats typing real commands.',
        feedbackBody:
          'Head back to Playground anytime if you want to explore the /bblug challenge or test pipes.',
      },
      {
        letter: 'C',
        label: 'Still exploring section by section',
        feedbackTitle: 'Take your time.',
        feedbackBody:
          'Each chapter builds from Linux origins to distros and global infrastructure at your pace.',
      },
      {
        letter: 'D',
        label: 'Want even more hands-on tasks',
        feedbackTitle: 'Full quiz & deeper challenges are next.',
        feedbackBody:
          'Click START LINUX QUIZ whenever you are ready for the real knowledge test.',
      },
    ],
  },
  {
    topic: 'History',
    categoryLabel: 'EXPERIENCE',
    question: 'Which section of the site caught your attention most?',
    choices: [
      {
        letter: 'A',
        label: 'Hero & Terminal Preview',
        feedbackTitle: 'First impressions matter.',
        feedbackBody:
          'Live terminal typing right at the top sets the tone for learning by doing.',
      },
      {
        letter: 'B',
        label: 'Interactive /bblug CTF Challenge',
        feedbackTitle: 'A true explorer choice.',
        feedbackBody:
          'Decoding layers inside a simulated shell mirrors real Linux troubleshooting workflows.',
      },
      {
        letter: 'C',
        label: 'Command Explorer & Filters',
        feedbackTitle: 'Built for quick recall.',
        feedbackBody:
          'Clicking any command sends it straight into the interactive terminal so nothing stays abstract.',
      },
      {
        letter: 'D',
        label: 'Distributions & Ecosystem',
        feedbackTitle: 'Seeing the bigger picture.',
        feedbackBody:
          'From desktop flavors to supercomputers, Linux adapts to almost every hardware form.',
      },
    ],
  },
  {
    topic: 'Commands',
    categoryLabel: 'PLAYGROUND',
    question: 'How did the interactive Linux terminal feel to use?',
    choices: [
      {
        letter: 'A',
        label: 'Feels like a real shell prompt',
        feedbackTitle: 'Authentic CLI energy.',
        feedbackBody:
          'Real file paths, stdin/pipes, and clear command responses help build terminal muscle memory.',
      },
      {
        letter: 'B',
        label: 'Easy to follow for beginners',
        feedbackTitle: 'Zero setup, zero fear of breaking things.',
        feedbackBody:
          'Practicing in a safe virtual filesystem lets you experiment freely before installing Linux.',
      },
      {
        letter: 'C',
        label: 'Liked the /bblug cipher stages',
        feedbackTitle: 'Base64, reverse, and ROT13 unlocked.',
        feedbackBody:
          'Classic Unix text tools like cat, rev, base64, and tr combine cleanly in pipelines.',
      },
      {
        letter: 'D',
        label: 'Haven’t tried all commands yet',
        feedbackTitle: 'Plenty left to test.',
        feedbackBody:
          'Try ls -la, pwd, uname -a, or grep back in the Command Explorer.',
      },
    ],
  },
  {
    topic: 'Distributions',
    categoryLabel: 'DESIGN',
    question: 'How do you rate the typography and visual hierarchy?',
    choices: [
      {
        letter: 'A',
        label: 'Sharp, readable, and balanced',
        feedbackTitle: 'Typography as structure.',
        feedbackBody:
          'Space Grotesk, Inter, and JetBrains Mono separate headings, prose, and terminal syntax cleanly.',
      },
      {
        letter: 'B',
        label: 'High-contrast yellow pops nicely',
        feedbackTitle: 'Signal over decoration.',
        feedbackBody:
          '#FFC500 highlights active states, coordinates, and primary actions without visual clutter.',
      },
      {
        letter: 'C',
        label: 'Smooth transitions between chapters',
        feedbackTitle: 'Storytelling in motion.',
        feedbackBody:
          'Alternating light and dark canvases mark each shift from theory to hands-on practice.',
      },
      {
        letter: 'D',
        label: 'Unique compared to usual docs',
        feedbackTitle: 'Editorial learning beats dry walls of text.',
        feedbackBody:
          'Our goal was making open-source fundamentals feel crisp, modern, and memorable.',
      },
    ],
  },
  {
    topic: 'Architecture',
    categoryLabel: 'CURIOSITY',
    question: 'What Linux area makes you most curious to explore next?',
    choices: [
      {
        letter: 'A',
        label: 'Shell scripting & pipelines',
        feedbackTitle: 'Automation starts in the shell.',
        feedbackBody:
          'Chaining small single-purpose tools is one of Unix and Linux’s greatest superpowers.',
      },
      {
        letter: 'B',
        label: 'Picking my first Linux distro',
        feedbackTitle: 'Ubuntu, Mint, or Fedora are great starts.',
        feedbackBody:
          'You can always switch later—core Linux concepts carry across every distribution.',
      },
      {
        letter: 'C',
        label: 'How the Linux kernel operates',
        feedbackTitle: 'Under the hood.',
        feedbackBody:
          'Processes, memory, drivers, and permissions are what turn hardware into a reliable system.',
      },
      {
        letter: 'D',
        label: 'Servers, cloud & security',
        feedbackTitle: 'The backbone of modern infrastructure.',
        feedbackBody:
          'Most cloud workloads and security toolkits rely directly on Linux fundamentals.',
      },
    ],
  },
  {
    topic: 'Security',
    categoryLabel: 'READY CHECK',
    question: 'Ready to jump into the full Linux Knowledge Quiz?',
    choices: [
      {
        letter: 'A',
        label: 'Yes, bring on the real questions',
        feedbackTitle: 'Confidence unlocked.',
        feedbackBody:
          'Hit START LINUX QUIZ on the left or the CTA below when the full quiz page opens.',
      },
      {
        letter: 'B',
        label: 'Let me review a few commands first',
        feedbackTitle: 'Smart preparation.',
        feedbackBody:
          'Command Explorer is right above if you want a quick refresher on navigation and permissions.',
      },
      {
        letter: 'C',
        label: 'Curious how high I can score',
        feedbackTitle: 'Every question teaches something new.',
        feedbackBody:
          'Expect fundamentals, history, CLI tricks, distros, architecture, and security.',
      },
      {
        letter: 'D',
        label: 'Liked this site—ready for more!',
        feedbackTitle: 'Thank you for exploring with us.',
        feedbackBody:
          'Open source grows through curious learners like you. Keep building and experimenting.',
      },
    ],
  },
];

export default function QuizSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({
    0: 0,
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const activeQuestion = MINI_QUIZ_QUESTIONS[currentIdx];
  const selectedChoiceIdx = selectedChoices[currentIdx] ?? 0;
  const currentChoice = activeQuestion.choices[selectedChoiceIdx];

  const animateCardSwap = () => {
    if (!cardInnerRef.current) return;
    gsap.fromTo(
      cardInnerRef.current,
      { y: 12, opacity: 0.45 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
  };

  useGSAP(
    () => {
      gsap.from('.quiz-left-anim', {
        y: 28,
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

      gsap.from('.quiz-card-anim', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 74%',
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  const handleSelectTopic = (idx: number) => {
    setIsCompleted(false);
    setCurrentIdx(idx);
    if (selectedChoices[idx] === undefined) {
      setSelectedChoices((prev) => ({ ...prev, [idx]: 0 }));
    }
    animateCardSwap();
  };

  const handleSelectChoice = (choiceIdx: number) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [currentIdx]: choiceIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < MINI_QUIZ_QUESTIONS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (selectedChoices[nextIdx] === undefined) {
        setSelectedChoices((prev) => ({ ...prev, [nextIdx]: 0 }));
      }
      animateCardSwap();
    } else {
      setIsCompleted(true);
      animateCardSwap();
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setCurrentIdx(0);
    setSelectedChoices({ 0: 0 });
    animateCardSwap();
  };

  return (
    <section
      id="quiz"
      ref={containerRef}
      className="relative w-full bg-[#F0F0F0] text-[#000000] py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-10">
        {/* Chapter Label */}
        <div className="quiz-left-anim flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
          <span className="font-mono text-[11px] leading-[14.52px] tracking-[0.06em] uppercase text-[#000000]">
            06 / PUT YOUR KNOWLEDGE TO WORK
          </span>
        </div>

        {/* Invitation + Interactive Quick Feedback Quiz Preview */}
        <div className="flex flex-col xl:flex-row items-start gap-12 xl:gap-20">
          {/* Left Column */}
          <div className="flex-1 w-full flex flex-col gap-8">
            <h2 className="quiz-left-anim font-display font-medium text-5xl sm:text-6xl lg:text-[76px] leading-[1.04] tracking-[-0.04em] text-[#000000] max-w-[960px]">
              How Much Do You Know About Linux?
            </h2>

            <p className="quiz-left-anim font-sans text-[17px] sm:text-[18px] leading-[1.6] text-[#000000] max-w-[780px]">
              Think you understand Linux? Challenge yourself and discover how much you really know.
            </p>

            {/* Quiz Topics Pills */}
            <div className="quiz-left-anim flex flex-wrap items-center gap-2">
              {TOPIC_PILLS.map((topic, idx) => {
                const isActive = !isCompleted && currentIdx === idx;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleSelectTopic(idx)}
                    className={`px-3 py-2 border border-[#000000] font-mono text-[11px] leading-[14.52px] transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#FFC500] text-[#000000] font-bold'
                        : 'bg-transparent text-[#000000] hover:bg-[#000000] hover:text-[#F0F0F0]'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* Primary CTA Button */}
            <div className="quiz-left-anim">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-5 px-5 h-[50px] bg-[#FFC500] border border-[#FFC500] rounded-[2px] font-mono font-bold text-[11px] leading-[14.52px] text-[#000000] uppercase transition-all duration-150 hover:bg-[#000000] hover:text-[#FFC500] hover:border-[#000000]"
              >
                <span>START LINUX QUIZ</span>
                <span className="font-sans font-normal text-[18px] leading-none">↗</span>
              </Link>
            </div>

            {/* Subtext */}
            <div className="quiz-left-anim flex flex-col gap-2 pt-1">
              <span className="font-mono text-[10px] leading-[16px] uppercase text-[#000000]">
                6 QUESTIONS / ONE OPEN MIND
              </span>
              <span className="font-sans text-[12px] leading-[19.2px] text-[#000000]/80">
                Quick site pulse check · select an option on the right to preview instant feedback.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Quick Quiz Box (560px desktop) */}
          <div className="quiz-card-anim w-full xl:w-[560px] shrink-0 border border-[#000000] p-6 sm:p-9 bg-[#F0F0F0]">
            <div ref={cardInnerRef} className="flex flex-col gap-7">
              {!isCompleted ? (
                <>
                  {/* Question Metadata */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] leading-[13.2px] uppercase text-[#000000]">
                      {activeQuestion.categoryLabel} · {activeQuestion.topic.toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] leading-[13.2px] uppercase text-[#000000]">
                      QUESTION 0{currentIdx + 1} / 0{MINI_QUIZ_QUESTIONS.length}
                    </span>
                  </div>

                  {/* 6-Segment Progress Bar */}
                  <div className="grid grid-cols-6 gap-1">
                    {MINI_QUIZ_QUESTIONS.map((_, idx) => {
                      const isFilled = idx <= currentIdx;
                      return (
                        <div
                          key={idx}
                          className={`h-[4px] transition-colors duration-300 ${
                            isFilled ? 'bg-[#FFC500]' : 'bg-[#000000]'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Question Prompt */}
                  <h3 className="font-display font-normal text-2xl sm:text-[34px] leading-[1.15] tracking-[-0.03em] text-[#000000]">
                    {activeQuestion.question}
                  </h3>

                  {/* Choices A-D */}
                  <div className="flex flex-col gap-[10px]">
                    {activeQuestion.choices.map((choice, cIdx) => {
                      const isSelected = selectedChoiceIdx === cIdx;
                      return (
                        <button
                          key={choice.letter}
                          type="button"
                          onClick={() => handleSelectChoice(cIdx)}
                          className={`w-full p-4 border border-[#000000] flex items-center gap-4 text-left transition-colors duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFC500] text-[#000000]'
                              : 'bg-[#F0F0F0] text-[#000000] hover:bg-black/5'
                          }`}
                        >
                          <span className="font-mono text-[10px] leading-[13.2px] shrink-0">
                            {choice.letter}
                          </span>
                          <span className="font-mono text-[13px] sm:text-[14px] leading-[18.48px] flex-1">
                            {choice.label}
                          </span>
                          <span className="font-sans text-[16px] leading-none shrink-0">
                            {isSelected ? '●' : '○'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Feedback */}
                  <div className="border-l-[3px] border-[#FFC500] pl-4 flex flex-col gap-2">
                    <p className="font-sans font-semibold text-[15px] leading-[24px] text-[#000000]">
                      {currentChoice.feedbackTitle}
                    </p>
                    <p className="font-sans text-[13px] leading-[20.8px] text-[#000000]/85">
                      {currentChoice.feedbackBody}
                    </p>
                  </div>

                  {/* Next Action */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-5 px-5 h-[50px] bg-[#FFC500] border border-[#FFC500] rounded-[2px] font-mono font-bold text-[11px] leading-[14.52px] text-[#000000] uppercase transition-all duration-150 hover:bg-[#000000] hover:text-[#FFC500] hover:border-[#000000] cursor-pointer"
                    >
                      <span>
                        {currentIdx < MINI_QUIZ_QUESTIONS.length - 1
                          ? 'NEXT QUESTION'
                          : 'FINISH CHECK-IN'}
                      </span>
                      <span className="font-sans font-normal text-[18px] leading-none">↗</span>
                    </button>

                    <span className="font-mono text-[10px] uppercase text-[#000000]/60">
                      QUICK FEEDBACK MODE
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#000000]">
                      CHECK-IN COMPLETE
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#000000]">
                      06 / 06 ANSWERED
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1">
                    {MINI_QUIZ_QUESTIONS.map((_, idx) => (
                      <div key={idx} className="h-[4px] bg-[#FFC500]" />
                    ))}
                  </div>

                  <h3 className="font-display font-normal text-3xl sm:text-[34px] leading-[1.15] tracking-[-0.03em] text-[#000000]">
                    Thanks for sharing your experience!
                  </h3>

                  <div className="border-l-[3px] border-[#FFC500] pl-4 flex flex-col gap-2">
                    <p className="font-sans font-semibold text-[15px] leading-[24px] text-[#000000]">
                      You’ve completed the quick site pulse check.
                    </p>
                    <p className="font-sans text-[13px] leading-[20.8px] text-[#000000]/85">
                      Ready to test your real Linux fundamentals, CLI commands, and kernel knowledge? Jump to the full quiz page when ready.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/quiz"
                      className="inline-flex items-center gap-4 px-5 h-[50px] bg-[#FFC500] border border-[#FFC500] rounded-[2px] font-mono font-bold text-[11px] text-[#000000] uppercase transition-all duration-150 hover:bg-[#000000] hover:text-[#FFC500] hover:border-[#000000]"
                    >
                      <span>OPEN FULL QUIZ</span>
                      <span className="font-sans text-[18px] leading-none">↗</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-4 h-[50px] border border-[#000000] font-mono font-bold text-[11px] text-[#000000] uppercase hover:bg-[#000000] hover:text-[#F0F0F0] transition-colors cursor-pointer"
                    >
                      ↺ RETAKE PREVIEW
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
