'use client';

import React, { useState, useRef, useEffect } from 'react';
import TuxPeeker from './TuxPeeker';

interface CommandEntry {
  id: string;
  command: string;
  output?: string;
  isError?: boolean;
}

const INITIAL_HISTORY: CommandEntry[] = [
  { id: '1', command: 'whoami', output: 'linux-explorer' },
  { id: '2', command: 'pwd', output: '/home/linux-explorer' },
  { id: '3', command: 'ls', output: 'Documents  Downloads  Projects  kernel.c' },
  { id: '4', command: 'echo "Hello Linux!"', output: 'Hello Linux!' }
  ,
];

const SUGGESTIONS = ['whoami', 'pwd', 'ls', 'uname', 'tux'];

export default function TerminalPreview() {
  const [history, setHistory] = useState<CommandEntry[]>(INITIAL_HISTORY);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    }

    let output = '';
    let isError = false;

    const lower = trimmed.toLowerCase();
    if (lower === 'whoami') {
      output = 'linux-explorer';
    } else if (lower === 'pwd') {
      output = '/home/linux-explorer';
    } else if (lower === 'ls' || lower.startsWith('ls ')) {
      output = 'Documents  Downloads  Projects  kernel.c  LICENSE';
    } else if (lower === 'uname' || lower === 'uname -s') {
      output = 'Linux';
    } else if (lower === 'uname -a') {
      output = 'Linux playground 6.8.0-koral #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    } else if (lower === 'tux') {
      output = "  (•ө•)  Tux says: 'Hello, explorer! Linux is built with love by millions.' 🐧";
    } else if (lower.startsWith('echo ')) {
      output = trimmed.slice(5).replace(/^["']|["']$/g, '');
    } else if (lower === 'date') {
      output = new Date().toUTCString();
    } else if (lower.startsWith('cat ')) {
      const file = trimmed.slice(4).trim();
      if (file === 'kernel.c') {
        output = '/* Linus Torvalds, 1991 */\nvoid main() { printk("Hello Kernel"); }';
      } else {
        output = `cat: ${file}: No such file or directory`;
        isError = true;
      }
    } else if (lower.startsWith('sudo')) {
      output = 'With great power comes great responsibility. (Simulated sudo)';
    } else if (lower === 'help') {
      output = 'Available commands: whoami, pwd, ls, uname, echo, cat, date, clear';
    } else {
      output = `bash: ${trimmed.split(' ')[0]}: command not found. Try 'help' or click suggestions.`;
      isError = true;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: trimmed,
        output,
        isError,
      },
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setHistory([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full flex flex-col gap-3 font-mono">
      {/* Tux Penguin Easter Egg Peeking from right border */}
      <TuxPeeker />

      {/* Terminal Window Box */}
      <div
        className="relative z-10 w-full bg-[#000000] text-[#F0F0F0] border border-[#F0F0F0]/30 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Toolbar */}
        <div className="h-10 px-4 bg-[#0D0D0D] border-b border-[#F0F0F0]/15 flex items-center justify-between select-none">
          {/* Sharp Industrial Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FFC500] inline-block" />
            <span className="w-2 h-2 bg-[#FFC500]/70 inline-block" />
            <span className="w-2 h-2 bg-[#FFC500]/40 inline-block" />
          </div>

          {/* Session Title */}
          <span className="text-[11px] text-[#A0A0A0] tracking-wide font-mono">
            linux-explorer@playground: ~ / bash
          </span>

          {/* Clear Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="text-[11px] text-[#FFC500] hover:text-white transition-colors flex items-center gap-1"
            title="Clear terminal history"
          >
            <span>CLEAR</span>
            <span className="text-xs">↺</span>
          </button>
        </div>

        {/* Command Body / History */}
        <div
          ref={scrollRef}
          className="p-5 max-h-[260px] sm:max-h-[290px] overflow-y-auto space-y-3 text-[13px] leading-relaxed scrollbar-thin scrollbar-thumb-white/20"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#FFC500] font-bold select-none">$</span>
                <span className="text-white">{item.command}</span>
              </div>
              {item.output && (
                <div
                  className={`pl-4 whitespace-pre-wrap ${
                    item.isError ? 'text-red-400' : 'text-[#B0B0B0]'
                  }`}
                >
                  {item.output}
                </div>
              )}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[#FFC500] font-bold select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type command (e.g. uname, ls)..."
              className="flex-1 bg-transparent border-none outline-none text-white text-[13px] font-mono placeholder:text-neutral-600 focus:ring-0"
            />
          </div>
        </div>

        {/* Suggested Command Chips */}
        <div className="px-5 py-3 bg-[#0A0A0A] border-t border-[#F0F0F0]/10 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-[#707070] uppercase tracking-wider mr-1 select-none">
            TRY:
          </span>
          {SUGGESTIONS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSuggestionClick(cmd);
              }}
              className="px-2.5 py-1 text-[11px] text-[#F0F0F0] border border-[#F0F0F0]/40 rounded hover:border-[#FFC500] hover:bg-[#FFC500] hover:text-black transition-all font-mono active:scale-95"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Annotation subtext */}
      <p className="text-[11px] text-neutral-500 font-mono tracking-wider">
        SAFE SIMULATION / Try commands without changing anything on your device.
      </p>
    </div>
  );
}
