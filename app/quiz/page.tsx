'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface QuizQuestion {
    id: number;
    category: string;
    question: string;
    choices: { letter: string; text: string }[];
    correctIndex: number;
    explanation: string;
}

const CATEGORIES = [
    'Fundamentals',
    'History',
    'Commands',
    'Distributions',
    'Architecture',
    'Security',
] as const;

const QUIZ_QUESTIONS: QuizQuestion[] = [
    // ── Fundamentals ──
    {
        id: 1,
        category: 'Fundamentals',
        question: 'What is the core component of the Linux operating system that manages hardware resources?',
        choices: [
            { letter: 'A', text: 'Shell' },
            { letter: 'B', text: 'Kernel' },
            { letter: 'C', text: 'Desktop Environment' },
            { letter: 'D', text: 'Package Manager' },
        ],
        correctIndex: 1,
        explanation:
            'The Linux kernel is the core of the OS. It directly manages CPU, memory, devices, and system calls — everything else (shell, DE, apps) runs on top of it.',
    },
    {
        id: 2,
        category: 'Fundamentals',
        question: 'In Linux, everything is treated as a:',
        choices: [
            { letter: 'A', text: 'Process' },
            { letter: 'B', text: 'Thread' },
            { letter: 'C', text: 'File' },
            { letter: 'D', text: 'Socket' },
        ],
        correctIndex: 2,
        explanation:
            '"Everything is a file" is a foundational Unix/Linux philosophy. Devices, directories, sockets, and even processes (via /proc) are represented as files.',
    },
    {
        id: 3,
        category: 'Fundamentals',
        question: 'Which file system is most commonly used as the default on modern Linux distributions?',
        choices: [
            { letter: 'A', text: 'NTFS' },
            { letter: 'B', text: 'FAT32' },
            { letter: 'C', text: 'ext4' },
            { letter: 'D', text: 'HFS+' },
        ],
        correctIndex: 2,
        explanation:
            'ext4 (fourth extended filesystem) is the default filesystem for most major Linux distributions. It supports large volumes, journaling, and backward compatibility with ext3/ext2.',
    },
    // ── History ──
    {
        id: 4,
        category: 'History',
        question: 'Who created the Linux kernel?',
        choices: [
            { letter: 'A', text: 'Richard Stallman' },
            { letter: 'B', text: 'Linus Torvalds' },
            { letter: 'C', text: 'Dennis Ritchie' },
            { letter: 'D', text: 'Ken Thompson' },
        ],
        correctIndex: 1,
        explanation:
            'Linus Torvalds created the Linux kernel in 1991 as a free, open-source alternative while studying at the University of Helsinki. Richard Stallman started the GNU Project.',
    },
    {
        id: 5,
        category: 'History',
        question: 'In what year was the first Linux kernel (version 0.01) released?',
        choices: [
            { letter: 'A', text: '1985' },
            { letter: 'B', text: '1989' },
            { letter: 'C', text: '1991' },
            { letter: 'D', text: '1993' },
        ],
        correctIndex: 2,
        explanation:
            'Linus Torvalds released the first version of the Linux kernel (0.01) on September 17, 1991. It started as a personal project inspired by MINIX.',
    },
    {
        id: 6,
        category: 'History',
        question: 'Which operating system heavily inspired the creation of Linux?',
        choices: [
            { letter: 'A', text: 'Windows NT' },
            { letter: 'B', text: 'MINIX' },
            { letter: 'C', text: 'macOS' },
            { letter: 'D', text: 'MS-DOS' },
        ],
        correctIndex: 1,
        explanation:
            'MINIX, a small Unix-like OS created by Andrew Tanenbaum for educational purposes, directly inspired Linus Torvalds to build the Linux kernel.',
    },
    // ── Commands ──
    {
        id: 7,
        category: 'Commands',
        question: 'Which command is used to change file permissions in Linux?',
        choices: [
            { letter: 'A', text: 'chown' },
            { letter: 'B', text: 'chmod' },
            { letter: 'C', text: 'chgrp' },
            { letter: 'D', text: 'chattr' },
        ],
        correctIndex: 1,
        explanation:
            'chmod (change mode) modifies file permissions. For example, chmod 755 script.sh gives the owner full access and others read + execute.',
    },
    {
        id: 8,
        category: 'Commands',
        question: 'What does the command `grep -r "error" /var/log/` do?',
        choices: [
            { letter: 'A', text: 'Deletes all lines containing "error"' },
            { letter: 'B', text: 'Recursively searches for "error" in /var/log/' },
            { letter: 'C', text: 'Replaces "error" with empty text' },
            { letter: 'D', text: 'Counts the number of log files' },
        ],
        correctIndex: 1,
        explanation:
            'grep -r performs a recursive search through all files in the specified directory. The -r flag means it descends into subdirectories.',
    },
    {
        id: 9,
        category: 'Commands',
        question: 'Which command displays the last 20 lines of a file?',
        choices: [
            { letter: 'A', text: 'head -20 file.txt' },
            { letter: 'B', text: 'cat -20 file.txt' },
            { letter: 'C', text: 'tail -20 file.txt' },
            { letter: 'D', text: 'less -20 file.txt' },
        ],
        correctIndex: 2,
        explanation:
            'tail displays the end of a file. The -20 (or -n 20) flag specifies showing the last 20 lines. head does the opposite — showing the first N lines.',
    },
    // ── Distributions ──
    {
        id: 10,
        category: 'Distributions',
        question: 'Which Linux distribution is Debian-based and widely recommended for beginners?',
        choices: [
            { letter: 'A', text: 'Arch Linux' },
            { letter: 'B', text: 'Ubuntu' },
            { letter: 'C', text: 'Gentoo' },
            { letter: 'D', text: 'Slackware' },
        ],
        correctIndex: 1,
        explanation:
            'Ubuntu is a Debian-based distribution known for its user-friendly experience, extensive documentation, and large community — making it ideal for newcomers.',
    },
    {
        id: 11,
        category: 'Distributions',
        question: 'Which package manager does Fedora use by default?',
        choices: [
            { letter: 'A', text: 'apt' },
            { letter: 'B', text: 'pacman' },
            { letter: 'C', text: 'dnf' },
            { letter: 'D', text: 'zypper' },
        ],
        correctIndex: 2,
        explanation:
            'Fedora uses dnf (Dandified YUM) as its default package manager. apt is Debian/Ubuntu, pacman is Arch, and zypper is openSUSE.',
    },
    {
        id: 12,
        category: 'Distributions',
        question: 'Which distro follows a "rolling release" model?',
        choices: [
            { letter: 'A', text: 'Ubuntu LTS' },
            { letter: 'B', text: 'Debian Stable' },
            { letter: 'C', text: 'CentOS' },
            { letter: 'D', text: 'Arch Linux' },
        ],
        correctIndex: 3,
        explanation:
            'Arch Linux uses a rolling release model — you get the latest packages continuously without waiting for major version releases. "Install once, update forever."',
    },
    // ── Architecture ──
    {
        id: 13,
        category: 'Architecture',
        question: 'What is the process with PID 1 in a Linux system?',
        choices: [
            { letter: 'A', text: 'bash' },
            { letter: 'B', text: 'kernel' },
            { letter: 'C', text: 'init / systemd' },
            { letter: 'D', text: 'cron' },
        ],
        correctIndex: 2,
        explanation:
            'PID 1 is the init process (or systemd on modern distros). It is the first user-space process started by the kernel and the ancestor of all other processes.',
    },
    {
        id: 14,
        category: 'Architecture',
        question: 'Which directory contains device files in Linux?',
        choices: [
            { letter: 'A', text: '/etc' },
            { letter: 'B', text: '/dev' },
            { letter: 'C', text: '/opt' },
            { letter: 'D', text: '/usr' },
        ],
        correctIndex: 1,
        explanation:
            '/dev contains device files that represent hardware (e.g., /dev/sda for disks, /dev/null for the null device). These special files bridge user-space and kernel device drivers.',
    },
    {
        id: 15,
        category: 'Architecture',
        question: 'What does the Linux kernel use to switch between user mode and kernel mode?',
        choices: [
            { letter: 'A', text: 'API calls' },
            { letter: 'B', text: 'System calls' },
            { letter: 'C', text: 'Library functions' },
            { letter: 'D', text: 'Shell scripts' },
        ],
        correctIndex: 1,
        explanation:
            'System calls (syscalls) are the interface between user-space programs and the kernel. When a program needs hardware access or a privileged operation, it makes a syscall (e.g., open, read, write, fork).',
    },
    // ── Security ──
    {
        id: 16,
        category: 'Security',
        question: 'Which command is used to switch to the root (superuser) account?',
        choices: [
            { letter: 'A', text: 'su' },
            { letter: 'B', text: 'root' },
            { letter: 'C', text: 'admin' },
            { letter: 'D', text: 'login' },
        ],
        correctIndex: 0,
        explanation:
            'su (substitute user) switches to another user account — when used without arguments, it defaults to root. sudo runs a single command with elevated privileges instead.',
    },
    {
        id: 17,
        category: 'Security',
        question: 'What does the permission string `rwxr-xr--` represent?',
        choices: [
            { letter: 'A', text: 'Owner: read/write, Group: read, Others: none' },
            { letter: 'B', text: 'Owner: all, Group: read/execute, Others: read' },
            { letter: 'C', text: 'Owner: read, Group: write, Others: execute' },
            { letter: 'D', text: 'Full access for everyone' },
        ],
        correctIndex: 1,
        explanation:
            'rwx = owner has read+write+execute (7), r-x = group has read+execute (5), r-- = others have read only (4). Numeric equivalent: 754.',
    },
    {
        id: 18,
        category: 'Security',
        question: 'Which file stores hashed passwords on modern Linux systems?',
        choices: [
            { letter: 'A', text: '/etc/passwd' },
            { letter: 'B', text: '/etc/shadow' },
            { letter: 'C', text: '/etc/security' },
            { letter: 'D', text: '/etc/login.defs' },
        ],
        correctIndex: 1,
        explanation:
            '/etc/shadow stores hashed passwords with restricted access (readable only by root). /etc/passwd is world-readable and no longer stores actual passwords on modern systems.',
    },
];

/* ──────────────────────────── Component ──────────────────────────── */
export default function QuizPage() {
    const [started, setStarted] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [finished, setFinished] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const filteredQuestions = useMemo(() => {
        if (!activeFilter) return QUIZ_QUESTIONS;
        return QUIZ_QUESTIONS.filter((q) => q.category === activeFilter);
    }, [activeFilter]);

    const totalQuestions = filteredQuestions.length;
    const currentQuestion = filteredQuestions[currentIdx];

    const score = useMemo(() => {
        let correct = 0;
        filteredQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) correct++;
        });
        return correct;
    }, [answers, filteredQuestions]);

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const handleStart = useCallback((category?: string) => {
        setActiveFilter(category ?? null);
        setStarted(true);
        setCurrentIdx(0);
        setSelectedAnswer(null);
        setIsRevealed(false);
        setAnswers({});
        setFinished(false);
    }, []);

    const handleSelectAnswer = useCallback((idx: number) => {
        if (!isRevealed) setSelectedAnswer(idx);
    }, [isRevealed]);

    const handleConfirm = useCallback(() => {
        if (selectedAnswer === null) return;
        setAnswers((prev) => ({ ...prev, [currentIdx]: selectedAnswer }));
        setIsRevealed(true);
    }, [selectedAnswer, currentIdx]);

    const handleNext = useCallback(() => {
        if (currentIdx < totalQuestions - 1) {
            setCurrentIdx((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsRevealed(false);
        } else {
            setFinished(true);
        }
    }, [currentIdx, totalQuestions]);

    const handleRestart = useCallback(() => {
        setStarted(false);
        setCurrentIdx(0);
        setSelectedAnswer(null);
        setIsRevealed(false);
        setAnswers({});
        setFinished(false);
        setActiveFilter(null);
    }, []);

    const getGrade = (pct: number) => {
        if (pct >= 90) return { label: 'LINUX MASTER', color: '#FFC500' };
        if (pct >= 70) return { label: 'PROFICIENT', color: '#FFC500' };
        if (pct >= 50) return { label: 'INTERMEDIATE', color: '#FFC500' };
        return { label: 'KEEP LEARNING', color: '#FFC500' };
    };

    /* ──────────── Landing / Category Select ──────────── */
    if (!started) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#0A0A0A] text-white pt-20">
                    <div className="max-w-[1776px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
                            <span className="font-mono text-[11px] leading-[14.52px] tracking-[0.06em] uppercase text-white/60">
                                KNOWLEDGE TEST / LINUX FUNDAMENTALS
                            </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                            {/* Left */}
                            <div className="flex-1 flex flex-col gap-8">
                                <h1 className="font-display font-medium text-5xl sm:text-6xl lg:text-[80px] leading-[1.02] tracking-[-0.04em] text-white max-w-[800px]">
                                    Linux
                                    <br />
                                    Knowledge
                                    <br />
                                    <span className="text-[#FFC500]">Quiz</span>
                                </h1>

                                <p className="font-sans text-[17px] sm:text-[18px] leading-[1.65] text-white/70 max-w-[600px]">
                                    18 carefully crafted questions across 6 categories. Test your understanding of
                                    Linux fundamentals, history, CLI commands, distributions, system architecture, and
                                    security.
                                </p>

                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#FFC500] inline-block" />
                                            <span className="font-mono text-[11px] uppercase text-white/50">
                                                18 Questions
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#FFC500] inline-block" />
                                            <span className="font-mono text-[11px] uppercase text-white/50">
                                                6 Categories
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#FFC500] inline-block" />
                                            <span className="font-mono text-[11px] uppercase text-white/50">
                                                Instant Feedback
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Start All button */}
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={() => handleStart()}
                                        className="inline-flex items-center gap-5 px-7 h-[56px] bg-[#FFC500] border border-[#FFC500] rounded-[2px] font-mono font-bold text-[12px] leading-[14.52px] text-[#000000] uppercase transition-all duration-150 hover:bg-white hover:border-white cursor-pointer shadow-[3px_3px_0px_rgba(255,197,0,0.3)]"
                                    >
                                        <span>START ALL QUESTIONS</span>
                                        <span className="font-sans font-normal text-[20px] leading-none">↗</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right — Category Cards */}
                            <div className="w-full lg:w-[520px] shrink-0 flex flex-col gap-3">
                                <span className="font-mono text-[10px] uppercase text-white/40 mb-2">
                                    OR PICK A CATEGORY
                                </span>
                                {CATEGORIES.map((cat) => {
                                    const count = QUIZ_QUESTIONS.filter((q) => q.category === cat).length;
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleStart(cat)}
                                            className="group w-full border border-white/10 hover:border-[#FFC500] p-5 flex items-center justify-between transition-all duration-200 cursor-pointer bg-white/[0.02] hover:bg-[#FFC500]/[0.05]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="w-2 h-2 bg-[#FFC500] group-hover:scale-125 transition-transform inline-block shrink-0" />
                                                <span className="font-display font-medium text-[20px] sm:text-[22px] tracking-[-0.02em] text-white group-hover:text-[#FFC500] transition-colors">
                                                    {cat}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-[11px] uppercase text-white/40">
                                                    {count} Q
                                                </span>
                                                <span className="font-sans text-[18px] text-white/30 group-hover:text-[#FFC500] transition-colors">
                                                    →
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}

                                {/* Back to main site */}
                                <div className="pt-4">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase text-white/40 hover:text-[#FFC500] transition-colors"
                                    >
                                        <span>←</span>
                                        <span>BACK TO MAIN SITE</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    /* ──────────── Finished / Results ──────────── */
    if (finished) {
        const grade = getGrade(percentage);
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#0A0A0A] text-white pt-20">
                    <div className="max-w-[960px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                        {/* Label */}
                        <div className="flex items-center gap-3 mb-10">
                            <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
                            <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-white/60">
                                QUIZ COMPLETE{activeFilter ? ` / ${activeFilter.toUpperCase()}` : ''}
                            </span>
                        </div>

                        {/* Score Card */}
                        <div className="border border-white/10 p-8 sm:p-12 flex flex-col gap-8 bg-white/[0.02]">
                            {/* Progress — all filled */}
                            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${totalQuestions}, 1fr)` }}>
                                {filteredQuestions.map((q, idx) => {
                                    const isCorrect = answers[idx] === q.correctIndex;
                                    return (
                                        <div
                                            key={idx}
                                            className={`h-[5px] ${isCorrect ? 'bg-[#FFC500]' : 'bg-red-500/70'}`}
                                        />
                                    );
                                })}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">
                                {/* Big Score */}
                                <div className="flex flex-col">
                                    <span className="font-display font-medium text-[96px] sm:text-[120px] leading-[0.9] tracking-[-0.06em] text-[#FFC500]">
                                        {percentage}%
                                    </span>
                                    <span className="font-mono text-[11px] uppercase text-white/50 mt-2">
                                        {score} / {totalQuestions} CORRECT
                                    </span>
                                </div>

                                {/* Grade Badge */}
                                <div className="flex flex-col gap-2 pb-2">
                                    <span
                                        className="inline-block px-3 py-1.5 border font-mono font-bold text-[11px] uppercase tracking-wider"
                                        style={{ borderColor: grade.color, color: grade.color }}
                                    >
                                        {grade.label}
                                    </span>
                                </div>
                            </div>

                            {/* Per-question review */}
                            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                                <span className="font-mono text-[10px] uppercase text-white/40 mb-2">
                                    ANSWER REVIEW
                                </span>
                                {filteredQuestions.map((q, idx) => {
                                    const userAnswer = answers[idx];
                                    const isCorrect = userAnswer === q.correctIndex;
                                    return (
                                        <div
                                            key={q.id}
                                            className={`flex items-start gap-3 p-3 border ${isCorrect
                                                    ? 'border-[#FFC500]/20 bg-[#FFC500]/[0.03]'
                                                    : 'border-red-500/20 bg-red-500/[0.03]'
                                                }`}
                                        >
                                            <span
                                                className={`font-mono text-[11px] shrink-0 mt-0.5 ${isCorrect ? 'text-[#FFC500]' : 'text-red-400'
                                                    }`}
                                            >
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                <span className="font-mono text-[12px] text-white/80 leading-[1.4]">
                                                    Q{idx + 1}. {q.question}
                                                </span>
                                                {!isCorrect && (
                                                    <span className="font-sans text-[12px] text-white/50 leading-[1.5]">
                                                        Your answer: {q.choices[userAnswer]?.text} → Correct:{' '}
                                                        <span className="text-[#FFC500]">
                                                            {q.choices[q.correctIndex].text}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleRestart}
                                    className="inline-flex items-center gap-4 px-5 h-[50px] bg-[#FFC500] border border-[#FFC500] rounded-[2px] font-mono font-bold text-[11px] text-[#000000] uppercase transition-all duration-150 hover:bg-white hover:border-white cursor-pointer"
                                >
                                    <span>RETAKE QUIZ</span>
                                    <span className="font-sans text-[18px] leading-none">↗</span>
                                </button>

                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-5 h-[50px] border border-white/20 font-mono font-bold text-[11px] text-white uppercase hover:bg-white/10 transition-colors"
                                >
                                    ← BACK TO SITE
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    /* ──────────── Active Quiz ──────────── */
    const isCorrect = isRevealed && selectedAnswer === currentQuestion.correctIndex;
    const isWrong = isRevealed && selectedAnswer !== currentQuestion.correctIndex;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#0A0A0A] text-white pt-20">
                <div className="max-w-[960px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
                    {/* Top bar */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
                            <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-white/60">
                                {currentQuestion.category.toUpperCase()}
                                {activeFilter ? '' : ' · ALL CATEGORIES'}
                            </span>
                        </div>
                        <span className="font-mono text-[11px] uppercase text-white/40">
                            QUESTION {String(currentIdx + 1).padStart(2, '0')} /{' '}
                            {String(totalQuestions).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                        className="grid gap-1 mb-10"
                        style={{ gridTemplateColumns: `repeat(${totalQuestions}, 1fr)` }}
                    >
                        {filteredQuestions.map((_, idx) => {
                            let barColor = 'bg-white/10';
                            if (idx < currentIdx) {
                                barColor =
                                    answers[idx] === filteredQuestions[idx].correctIndex
                                        ? 'bg-[#FFC500]'
                                        : 'bg-red-500/70';
                            } else if (idx === currentIdx && isRevealed) {
                                barColor = isCorrect ? 'bg-[#FFC500]' : 'bg-red-500/70';
                            } else if (idx === currentIdx) {
                                barColor = 'bg-white/30';
                            }
                            return <div key={idx} className={`h-[4px] transition-colors duration-300 ${barColor}`} />;
                        })}
                    </div>

                    {/* Question Card */}
                    <div className="border border-white/10 p-6 sm:p-10 flex flex-col gap-8 bg-white/[0.02]">
                        {/* Question */}
                        <h2 className="font-display font-normal text-2xl sm:text-[32px] leading-[1.2] tracking-[-0.025em] text-white">
                            {currentQuestion.question}
                        </h2>

                        {/* Choices */}
                        <div className="flex flex-col gap-3">
                            {currentQuestion.choices.map((choice, cIdx) => {
                                const isSelected = selectedAnswer === cIdx;
                                const isAnswer = cIdx === currentQuestion.correctIndex;

                                let borderStyle = 'border-white/10';
                                let bgStyle = 'bg-transparent hover:bg-white/[0.04]';
                                let textStyle = 'text-white/80';
                                let letterBg = '';

                                if (isRevealed) {
                                    if (isAnswer) {
                                        borderStyle = 'border-[#FFC500]/60';
                                        bgStyle = 'bg-[#FFC500]/[0.08]';
                                        textStyle = 'text-[#FFC500]';
                                        letterBg = 'bg-[#FFC500] text-black';
                                    } else if (isSelected && !isAnswer) {
                                        borderStyle = 'border-red-500/40';
                                        bgStyle = 'bg-red-500/[0.06]';
                                        textStyle = 'text-red-400';
                                        letterBg = 'bg-red-500 text-white';
                                    } else {
                                        textStyle = 'text-white/30';
                                    }
                                } else if (isSelected) {
                                    borderStyle = 'border-[#FFC500]';
                                    bgStyle = 'bg-[#FFC500]/[0.06]';
                                    textStyle = 'text-white';
                                    letterBg = 'bg-[#FFC500] text-black';
                                }

                                return (
                                    <button
                                        key={choice.letter}
                                        type="button"
                                        onClick={() => handleSelectAnswer(cIdx)}
                                        disabled={isRevealed}
                                        className={`w-full p-4 sm:p-5 border ${borderStyle} ${bgStyle} flex items-center gap-4 text-left transition-all duration-200 ${isRevealed ? 'cursor-default' : 'cursor-pointer'
                                            }`}
                                    >
                                        <span
                                            className={`font-mono text-[11px] w-7 h-7 flex items-center justify-center shrink-0 border ${letterBg
                                                    ? letterBg + ' border-transparent'
                                                    : 'border-white/20 text-white/50'
                                                } transition-all duration-200`}
                                        >
                                            {choice.letter}
                                        </span>
                                        <span className={`font-sans text-[14px] sm:text-[15px] leading-[1.5] flex-1 ${textStyle} transition-colors duration-200`}>
                                            {choice.text}
                                        </span>
                                        {isRevealed && isAnswer && (
                                            <span className="font-mono text-[11px] text-[#FFC500] shrink-0">✓</span>
                                        )}
                                        {isRevealed && isSelected && !isAnswer && (
                                            <span className="font-mono text-[11px] text-red-400 shrink-0">✗</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation (after reveal) */}
                        {isRevealed && (
                            <div
                                className={`border-l-[3px] pl-5 py-1 flex flex-col gap-2 ${isCorrect ? 'border-[#FFC500]' : 'border-red-500'
                                    }`}
                            >
                                <p className={`font-sans font-semibold text-[14px] ${isCorrect ? 'text-[#FFC500]' : 'text-red-400'}`}>
                                    {isCorrect ? 'Correct!' : 'Not quite.'}
                                </p>
                                <p className="font-sans text-[13px] leading-[1.65] text-white/70">
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-4 pt-2">
                            {!isRevealed ? (
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={selectedAnswer === null}
                                    className={`inline-flex items-center gap-4 px-5 h-[50px] rounded-[2px] font-mono font-bold text-[11px] uppercase transition-all duration-150 ${selectedAnswer !== null
                                            ? 'bg-[#FFC500] border border-[#FFC500] text-[#000000] hover:bg-white hover:border-white cursor-pointer'
                                            : 'bg-white/10 border border-white/10 text-white/30 cursor-not-allowed'
                                        }`}
                                >
                                    <span>CONFIRM ANSWER</span>
                                    <span className="font-sans font-normal text-[18px] leading-none">↗</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="inline-flex items-center gap-4 px-5 h-[50px] bg-[#FFC500] border border-[#FFC500] rounded-[2px] font-mono font-bold text-[11px] text-[#000000] uppercase transition-all duration-150 hover:bg-white hover:border-white cursor-pointer"
                                >
                                    <span>
                                        {currentIdx < totalQuestions - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}
                                    </span>
                                    <span className="font-sans font-normal text-[18px] leading-none">↗</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleRestart}
                                className="font-mono text-[11px] uppercase text-white/30 hover:text-[#FFC500] transition-colors cursor-pointer"
                            >
                                EXIT QUIZ
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
