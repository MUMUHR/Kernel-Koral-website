'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BBLUG_ASCII } from './bblugAscii';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FSNode {
  name: string;
  type: 'dir' | 'file';
  content?: string;
  children?: { [name: string]: FSNode };
}

interface CommandEntry {
  id: string;
  command: string;
  path?: string;
  output?: string;
  postOutput?: string;
  isError?: boolean;
  isEasterEgg?: boolean;
  asciiArt?: string;
}

const CTF_STAGES = [
  {
    stage: 1,
    layer: 'LAYER 01 — ENCODED PAYLOAD',
    ciphertext: 'dGFubG5mX3FyeHBieWFoX3RoeW9v',
    hint: 'Tidak semua teks yang terlihat acak merupakan hasil enkripsi. Identifikasi encoding-nya terlebih dahulu.',
    answer: 'tanlnf_qrxpbyah_thyoo',
  },
  {
    stage: 2,
    layer: 'LAYER 02 — SHIFT CIPHER',
    ciphertext: 'tanlnf_qrxpbyah_thyoo',
    hint: 'Setiap huruf mengalami pergeseran sebanyak 13 posisi.',
    answer: 'gnayas_dekcolnu_gulbb',
  },
  {
    stage: 3,
    layer: 'LAYER 03 — MIRRORED TEXT',
    ciphertext: 'gnayas_dekcolnu_gulbb',
    hint: 'Terkadang rahasia hanya perlu dibaca dari arah sebaliknya.',
    answer: 'bblug_unlocked_sayang',
  },
];

function evaluatePipeline(cmd: string): string | null {
  const trimmed = cmd.trim();

  // Handle echo '...' | <pipe>
  const echoMatch = trimmed.match(/^echo\s+['"]?(.*?)['"]?\s*\|\s*(.*)$/i);
  if (echoMatch) {
    const rawText = echoMatch[1];
    const pipeTarget = echoMatch[2].trim().toLowerCase();

    if (pipeTarget.startsWith('base64 -d') || pipeTarget.startsWith('base64 --decode')) {
      try {
        if (typeof window !== 'undefined') {
          return atob(rawText.trim());
        }
      } catch {
        return 'base64: invalid input';
      }
    }

    if (pipeTarget.startsWith('tr')) {
      return rawText.replace(/[a-zA-Z]/g, (c) => {
        const code = c.charCodeAt(0);
        const base = code >= 97 ? 97 : 65;
        return String.fromCharCode(((code - base + 13) % 26) + base);
      });
    }

    if (pipeTarget.startsWith('rev')) {
      return rawText.split('').reverse().join('');
    }
  }

  // Handle direct base64 -d <str>
  if (trimmed.startsWith('base64 -d ') || trimmed.startsWith('base64 --decode ')) {
    const str = trimmed.replace(/^base64\s+(-d|--decode)\s+['"]?/, '').replace(/['"]?$/, '');
    try {
      if (typeof window !== 'undefined') return atob(str.trim());
    } catch {
      return 'base64: invalid input';
    }
  }

  // Handle direct rev <str>
  if (trimmed.startsWith('rev ') && !trimmed.includes('|')) {
    const str = trimmed.slice(4).replace(/^['"]/, '').replace(/['"]$/, '');
    return str.split('').reverse().join('');
  }

  return null;
}

function getCtfBannerText(stageIndex: number, prefixNotice?: string): string {
  const stage = CTF_STAGES[stageIndex];
  if (!stage) return '';
  const lines: string[] = [];
  if (prefixNotice) {
    lines.push(prefixNotice);
  }
  lines.push(`[*] CTF CHALLENGE: UNLOCK THE SECRET — STAGE ${stage.stage} / 3`);
  lines.push(`[*] ${stage.layer}`);
  lines.push('----------------------------------------------------------------------');
  lines.push(`Ciphertext : ${stage.ciphertext}`);
  lines.push(`Petunjuk   : ${stage.hint}`);
  lines.push(`Referensi  : Cek Command Explorer (03 / THE LANGUAGE OF LINUX) untuk command & step penyelesaian.`);
  lines.push(`Submit     : /bblug <jawaban>  (atau ketik langsung jawabannya)`);
  lines.push('----------------------------------------------------------------------');
  return lines.join('\n');
}

const DEFAULT_FS: FSNode = {
  name: '~',
  type: 'dir',
  children: {
    Documents: { name: 'Documents', type: 'dir', children: {} },
    Downloads: { name: 'Downloads', type: 'dir', children: {} },
    Projects: {
      name: 'Projects',
      type: 'dir',
      children: {
        'hello-linux': {
          name: 'hello-linux',
          type: 'dir',
          children: {
            'notes.txt': {
              name: 'notes.txt',
              type: 'file',
              content: 'Linux is freedom. Explore, build, and master the core!',
            },
          },
        },
      },
    },
  },
};

// Helper: render ASCII tree dynamically from VFS
function renderAsciiTree(node: FSNode, prefix = ''): string[] {
  let lines: string[] = [];
  const entries = Object.keys(node.children || {}).sort();
  entries.forEach((name, idx) => {
    const isLast = idx === entries.length - 1;
    const child = node.children![name];
    const branch = isLast ? '└── ' : '├── ';
    lines.push(prefix + branch + name + (child.type === 'dir' ? '/' : ''));
    if (child.type === 'dir' && Object.keys(child.children || {}).length > 0) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      lines = lines.concat(renderAsciiTree(child, nextPrefix));
    }
  });
  return lines;
}

export default function PlaygroundSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // In-memory Virtual Filesystem (resets on page refresh)
  const [fs, setFs] = useState<FSNode>(() => JSON.parse(JSON.stringify(DEFAULT_FS)));
  const [pathStack, setPathStack] = useState<string[]>(['Projects', 'hello-linux']);

  // Challenge tracking flags
  const [hasCreatedHello, setHasCreatedHello] = useState(true);
  const [hasEnteredDir, setHasEnteredDir] = useState(true);
  const [hasCreatedNotes, setHasCreatedNotes] = useState(true);
  const [hasReadNotes, setHasReadNotes] = useState(false);

  // Terminal history
  const [history, setHistory] = useState<CommandEntry[]>([
    { id: '1', command: 'cd Projects', path: '~', output: '' },
    { id: '2', command: 'mkdir hello-linux', path: '~/Projects', output: '' },
    { id: '3', command: 'cd hello-linux', path: '~/Projects', output: '' },
    { id: '4', command: 'touch notes.txt', path: '~/Projects/hello-linux', output: '' },
    { id: '5', command: 'ls', path: '~/Projects/hello-linux', output: 'notes.txt' },
    { id: '6', command: 'pwd', path: '~/Projects/hello-linux', output: '/home/linux-explorer/Projects/hello-linux' },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [terminalMode, setTerminalMode] = useState<'normal' | 'minimized' | 'maximized'>('normal');
  const [ctfStage, setCtfStage] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const executeCommandRef = useRef<(cmd: string) => void>(() => {});

  // Listen for TRY IN PLAYGROUND commands from CommandExplorerSection
  useEffect(() => {
    const handleTryCommand = (e: Event) => {
      const customEvent = e as CustomEvent<{ command?: string }>;
      const cmd = customEvent.detail?.command;
      if (cmd) {
        setTerminalMode((prev) => (prev === 'minimized' ? 'normal' : prev));
        setTimeout(() => {
          executeCommandRef.current(cmd);
          inputRef.current?.focus();
        }, 350);
      }
    };
    window.addEventListener('koral:try-command', handleTryCommand);
    return () => window.removeEventListener('koral:try-command', handleTryCommand);
  }, []);

  // Close maximized mode with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && terminalMode === 'maximized') {
        setTerminalMode('normal');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [terminalMode]);

  // Formatted path string
  const currentPathStr = '~' + (pathStack.length > 0 ? '/' + pathStack.join('/') : '');

  // Calculate completed challenges
  const completedCount =
    (hasCreatedHello ? 1 : 0) +
    (hasEnteredDir ? 1 : 0) +
    (hasCreatedNotes ? 1 : 0) +
    (hasReadNotes ? 1 : 0);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [history]);

  useGSAP(
    () => {
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        '.pg-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    },
    { scope: containerRef }
  );

  // Helper: navigate VFS node based on current path stack
  const getCurrentDirNode = (rootNode: FSNode, stack: string[]): FSNode | null => {
    let curr = rootNode;
    for (const seg of stack) {
      if (!curr.children || !curr.children[seg] || curr.children[seg].type !== 'dir') {
        return null;
      }
      curr = curr.children[seg];
    }
    return curr;
  };

  // Reset entire filesystem
  const resetFilesystem = () => {
    setFs(JSON.parse(JSON.stringify(DEFAULT_FS)));
    setPathStack(['Projects', 'hello-linux']);
    setHasCreatedHello(true);
    setHasEnteredDir(true);
    setHasCreatedNotes(true);
    setHasReadNotes(false);
    setCtfStage(0);
    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: '# reset-fs',
        output: '[SYSTEM] In-memory filesystem & CTF challenges restored to default state.',
      },
    ]);
  };

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    }

    // Pipeline execution: echo '...' | base64 -d / tr / rev
    const pipeResult = evaluatePipeline(trimmed);
    if (pipeResult !== null) {
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          command: trimmed,
          path: currentPathStr,
          output: pipeResult,
        },
      ]);
      setInputValue('');
      return;
    }

    let output = '';
    let isError = false;
    const isEasterEgg = false;
    const lower = trimmed.toLowerCase();

    // CTF /bblug command check
    const isBblug =
      lower === '/bblug' ||
      lower === 'bblug' ||
      lower.startsWith('/bblug ') ||
      lower.startsWith('bblug ');

    const bblugArg = isBblug ? trimmed.replace(/^\/?bblug\s*/i, '').trim() : '';

    // Check if user submitted an answer (either `/bblug <ans>` or plain answer when CTF is active)
    let candidateAns = bblugArg;
    if (!candidateAns && ctfStage >= 1 && ctfStage <= 3) {
      if (
        trimmed === CTF_STAGES[0].answer ||
        trimmed === CTF_STAGES[1].answer ||
        trimmed === CTF_STAGES[2].answer
      ) {
        candidateAns = trimmed;
      }
    }

    if (isBblug && (bblugArg.toLowerCase() === 'reset' || bblugArg.toLowerCase() === 'restart')) {
      setCtfStage(1);
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          command: trimmed,
          path: currentPathStr,
          output: getCtfBannerText(0, '[*] CTF challenge reset to Stage 1.'),
        },
      ]);
      setInputValue('');
      return;
    }

    // If candidate answer provided
    if (candidateAns) {
      const activeIdx = ctfStage === 0 ? 0 : ctfStage - 1;
      const targetStage = CTF_STAGES[activeIdx];

      if (candidateAns === targetStage.answer) {
        const nextStageNum = targetStage.stage + 1;
        const isFinal = targetStage.stage === 3;
        setCtfStage(nextStageNum);

        if (isFinal) {
          const finalOutput = [
            '[+] Verifying token... VALID!',
            '[+] STAGE 3 / 3 CLEARED · Layer 03 (Reverse String) unlocked!',
            '[+] ============================================================',
            '[+] ALL 3 STAGES CLEARED! CONGRATULATIONS, LINUX EXPLORER!',
            '[+] FINAL FLAG CAPTURED: "bblug_unlocked_sayang"',
            '[+] ROOT PRIVILEGES GRANTED: root@koral-linux',
            '[+] ============================================================',
            '[+] Streaming /etc/motd (BBLUG Mascot ASCII Art):',
          ].join('\n');

          setHistory((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              command: trimmed,
              path: currentPathStr,
              output: finalOutput,
              isEasterEgg: true,
              asciiArt: BBLUG_ASCII,
              postOutput: '[+] All 3 stages completed. Type "/bblug reset" to restart anytime.',
            },
          ]);
        } else if (targetStage.stage === 1) {
          // Stage 1 cleared -> show ASCII art reward from public/aset/bblug_ascii.txt!
          const nextIdx = 1;
          const stageOutput = [
            '[+] Verifying token payload... VALID!',
            `[+] STAGE 1 / 3 CLEARED · ${targetStage.layer} UNLOCKED`,
            `[+] Accepted token: "${targetStage.answer}"`,
            '[+] Reward unlocked: public/aset/bblug_ascii.txt (Stage 1 Payload):',
          ].join('\n');

          const nextChallengeText = getCtfBannerText(nextIdx, '[*] Moving to next challenge:');

          setHistory((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              command: trimmed,
              path: currentPathStr,
              output: stageOutput,
              isEasterEgg: true,
              asciiArt: BBLUG_ASCII,
              postOutput: nextChallengeText,
            },
          ]);
        } else {
          const nextIdx = targetStage.stage;
          const stageOutput = [
            '[+] Verifying token payload... VALID!',
            `[+] STAGE ${targetStage.stage} / 3 CLEARED · ${targetStage.layer} UNLOCKED`,
            `[+] Accepted token: "${targetStage.answer}"`,
            '',
            getCtfBannerText(nextIdx, '[*] Moving to next challenge:'),
          ].join('\n');

          setHistory((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              command: trimmed,
              path: currentPathStr,
              output: stageOutput,
            },
          ]);
        }
        setInputValue('');
        return;
      } else {
        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            command: trimmed,
            path: currentPathStr,
            output: `[-] Error: Invalid token payload for Stage ${ctfStage || 1}. Cek section Command Explorer (03 / THE LANGUAGE OF LINUX) untuk cara decode-nya.`,
            isError: true,
          },
        ]);
        setInputValue('');
        return;
      }
    }

    // If user typed /bblug without args
    if (isBblug) {
      const activeIdx = ctfStage === 0 ? 0 : Math.min(ctfStage - 1, 2);
      if (ctfStage === 0) setCtfStage(1);

      if (ctfStage > 3) {
        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            command: trimmed,
            path: currentPathStr,
            output: [
              '[+] ALL 3 STAGES CLEARED!',
              '[+] Final Flag: "bblug_unlocked_sayang"',
              '[+] Type "/bblug reset" to restart challenge.',
            ].join('\n'),
            isEasterEgg: true,
            asciiArt: BBLUG_ASCII,
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            command: trimmed,
            path: currentPathStr,
            output: getCtfBannerText(
              activeIdx,
              activeIdx === 0 ? '[*] BBLUG Cryptography Subsystem initialized.' : undefined
            ),
          },
        ]);
      }
      setInputValue('');
      return;
    }
    // Command: pwd
    else if (lower === 'pwd') {
      output = `/home/linux-explorer${pathStack.length > 0 ? '/' + pathStack.join('/') : ''}`;
    }
    // Command: whoami
    else if (lower === 'whoami') {
      output = 'linux-explorer';
    }
    // Command: id
    else if (lower === 'id') {
      output = 'uid=1000(linux-explorer) gid=1000(linux-explorer) groups=1000(linux-explorer),27(sudo)';
    }
    // Command: date
    else if (lower === 'date') {
      output = new Date().toUTCString();
    }
    // Command: uptime
    else if (lower === 'uptime') {
      output = ' 00:00:00 up 42 days, 1 user,  load average: 0.08, 0.03, 0.01';
    }
    // Command: history
    else if (lower === 'history') {
      output = history.map((h, i) => `  ${String(i + 1).padStart(4, ' ')}  ${h.command}`).join('\n');
    }
    // Command: uname
    else if (lower === 'uname' || lower === 'uname -s') {
      output = 'Linux';
    } else if (lower === 'uname -a') {
      output = 'Linux playground 6.8.0-koral #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    }
    // Command: ls -la / ls -l / ll
    else if (
      lower === 'ls -la' ||
      lower === 'ls -l' ||
      lower === 'll' ||
      lower.startsWith('ls -l') ||
      lower.startsWith('ls -al')
    ) {
      const curr = getCurrentDirNode(fs, pathStack);
      if (curr && curr.children) {
        const keys = Object.keys(curr.children);
        const lines = [
          `total ${keys.length * 4 + 8}`,
          'drwxr-xr-x 3 linux-explorer linux-explorer 4096 Nov 10 00:00 .',
          'drwxr-xr-x 4 linux-explorer linux-explorer 4096 Nov 10 00:00 ..',
        ];
        for (const name of keys) {
          const item = curr.children[name];
          if (item.type === 'dir') {
            lines.push(`drwxr-xr-x 2 linux-explorer linux-explorer 4096 Nov 10 00:00 ${name}`);
          } else {
            const size = (item.content || '').length || 24;
            lines.push(`-rw-r--r-- 1 linux-explorer linux-explorer ${String(size).padStart(4, ' ')} Nov 10 00:00 ${name}`);
          }
        }
        output = lines.join('\n');
      } else {
        output = 'total 8\ndrwxr-xr-x 2 linux-explorer linux-explorer 4096 Nov 10 00:00 .\ndrwxr-xr-x 3 linux-explorer linux-explorer 4096 Nov 10 00:00 ..';
      }
    }
    // Command: ls
    else if (lower === 'ls' || lower.startsWith('ls ')) {
      const curr = getCurrentDirNode(fs, pathStack);
      if (curr && curr.children) {
        const items = Object.keys(curr.children);
        if (items.length === 0) {
          output = '';
        } else {
          output = items
            .map((name) => {
              const item = curr.children![name];
              return item.type === 'dir' ? `${name}/` : name;
            })
            .join('  ');
        }
      } else {
        output = '';
      }
    }
    // Command: cd
    else if (lower === 'cd' || lower.startsWith('cd ')) {
      const target = trimmed.slice(2).trim();
      if (!target || target === '~' || target === '/') {
        setPathStack([]);
      } else if (target === '..' || target === '../') {
        if (pathStack.length > 0) {
          setPathStack((prev) => prev.slice(0, -1));
        }
      } else {
        const segments = target.split('/').filter(Boolean);
        const testStack = [...pathStack];
        let valid = true;

        for (const seg of segments) {
          if (seg === '..') {
            if (testStack.length > 0) testStack.pop();
          } else if (seg === '.') {
            continue;
          } else {
            const node = getCurrentDirNode(fs, testStack);
            if (node && node.children && node.children[seg] && node.children[seg].type === 'dir') {
              testStack.push(seg);
            } else {
              valid = false;
              break;
            }
          }
        }

        if (valid) {
          setPathStack(testStack);
          if (testStack.includes('hello-linux')) {
            setHasEnteredDir(true);
          }
        } else {
          output = `bash: cd: ${target}: No such file or directory`;
          isError = true;
        }
      }
    }
    // Command: mkdir (Arbitrary directory creation)
    else if (lower.startsWith('mkdir ')) {
      const dirName = trimmed.slice(6).trim();
      if (!dirName) {
        output = 'mkdir: missing operand';
        isError = true;
      } else if (dirName.includes('/')) {
        output = 'mkdir: creating nested directories not supported in this quick demo';
        isError = true;
      } else {
        const newFs = JSON.parse(JSON.stringify(fs));
        const curr = getCurrentDirNode(newFs, pathStack);
        if (curr && curr.children) {
          if (curr.children[dirName]) {
            output = `mkdir: cannot create directory '${dirName}': File exists`;
            isError = true;
          } else {
            curr.children[dirName] = { name: dirName, type: 'dir', children: {} };
            setFs(newFs);
            if (dirName === 'hello-linux') {
              setHasCreatedHello(true);
            }
          }
        }
      }
    }
    // Command: touch (Arbitrary file creation)
    else if (lower.startsWith('touch ')) {
      const fileName = trimmed.slice(6).trim();
      if (!fileName) {
        output = 'touch: missing file operand';
        isError = true;
      } else {
        const newFs = JSON.parse(JSON.stringify(fs));
        const curr = getCurrentDirNode(newFs, pathStack);
        if (curr && curr.children) {
          if (!curr.children[fileName]) {
            curr.children[fileName] = {
              name: fileName,
              type: 'file',
              content: fileName === 'notes.txt' ? 'Linux is freedom. Explore, build, and master the core!' : '',
            };
          }
          setFs(newFs);
          if (fileName === 'notes.txt') {
            setHasCreatedNotes(true);
          }
        }
      }
    }
    // Command: rm / rmdir (Arbitrary file and folder deletion)
    else if (lower.startsWith('rm ') || lower.startsWith('rmdir ')) {
      const parts = trimmed.split(/\s+/);
      const isRecursive = parts.includes('-r') || parts.includes('-rf');
      const targetName = parts[parts.length - 1];

      if (!targetName || targetName === 'rm' || targetName === 'rmdir') {
        output = 'rm: missing operand';
        isError = true;
      } else {
        const newFs = JSON.parse(JSON.stringify(fs));
        const curr = getCurrentDirNode(newFs, pathStack);
        if (curr && curr.children) {
          const item = curr.children[targetName];
          if (!item) {
            output = `rm: cannot remove '${targetName}': No such file or directory`;
            isError = true;
          } else if (item.type === 'dir' && !isRecursive && !lower.startsWith('rmdir')) {
            output = `rm: cannot remove '${targetName}': Is a directory (use rm -r or rmdir)`;
            isError = true;
          } else {
            delete curr.children[targetName];
            setFs(newFs);
            output = `removed '${targetName}'`;
          }
        }
      }
    }
    // Command: echo with redirection (e.g. echo "hello" > file.txt)
    else if (lower.startsWith('echo ') && trimmed.includes('>')) {
      const [left, right] = trimmed.split('>');
      const textToEcho = left.replace(/^echo\s+/i, '').trim().replace(/^["']|["']$/g, '');
      const targetFile = right.trim();

      if (targetFile) {
        const newFs = JSON.parse(JSON.stringify(fs));
        const curr = getCurrentDirNode(newFs, pathStack);
        if (curr && curr.children) {
          curr.children[targetFile] = {
            name: targetFile,
            type: 'file',
            content: textToEcho,
          };
          setFs(newFs);
        }
      }
    }
    // Command: echo
    else if (lower.startsWith('echo ')) {
      output = trimmed.slice(5).replace(/^["']|["']$/g, '');
    }
    // Command: cat (Read file)
    else if (lower.startsWith('cat ')) {
      const fileName = trimmed.slice(4).trim();
      const curr = getCurrentDirNode(fs, pathStack);
      if (curr && curr.children && curr.children[fileName]) {
        const item = curr.children[fileName];
        if (item.type === 'dir') {
          output = `cat: ${fileName}: Is a directory`;
          isError = true;
        } else {
          output = item.content || '(empty file)';
          if (fileName === 'notes.txt') {
            setHasReadNotes(true);
          }
        }
      } else {
        output = `cat: ${fileName}: No such file or directory`;
        isError = true;
      }
    }
    // Command: head / tail
    else if (lower.startsWith('head ') || lower.startsWith('tail ')) {
      const parts = trimmed.split(/\s+/);
      const fileName = parts[parts.length - 1];
      const curr = getCurrentDirNode(fs, pathStack);
      if (curr && curr.children && curr.children[fileName]) {
        const item = curr.children[fileName];
        output = item.type === 'dir' ? `${parts[0]}: ${fileName}: Is a directory` : item.content || '';
      } else {
        output = `${parts[0]}: ${fileName}: No such file or directory`;
        isError = true;
      }
    }
    // Command: hostname
    else if (lower === 'hostname' || lower.startsWith('hostname ')) {
      output = lower.includes('-i') ? '192.168.1.42' : 'koral';
    }
    // Command: free
    else if (lower === 'free' || lower.startsWith('free ')) {
      output = [
        '               total        used        free      shared  buff/cache   available',
        'Mem:            15Gi       3.2Gi       9.4Gi       210Mi       2.9Gi        12Gi',
        'Swap:          2.0Gi          0B       2.0Gi',
      ].join('\n');
    }
    // Command: cp
    else if (lower.startsWith('cp ')) {
      const parts = trimmed.split(/\s+/).filter((p) => !p.startsWith('-'));
      const src = parts[1];
      const dest = parts[2];
      if (!src || !dest) {
        output = 'cp: missing file operand';
        isError = true;
      } else {
        const newFs = JSON.parse(JSON.stringify(fs));
        const curr = getCurrentDirNode(newFs, pathStack);
        if (curr && curr.children && curr.children[src]) {
          curr.children[dest] = JSON.parse(JSON.stringify(curr.children[src]));
          curr.children[dest].name = dest;
          setFs(newFs);
          output = `copied '${src}' -> '${dest}'`;
        } else {
          output = `cp: cannot stat '${src}': No such file or directory`;
          isError = true;
        }
      }
    }
    // Command: mv
    else if (lower.startsWith('mv ')) {
      const parts = trimmed.split(/\s+/).filter((p) => !p.startsWith('-'));
      const src = parts[1];
      const dest = parts[2];
      if (!src || !dest) {
        output = 'mv: missing file operand';
        isError = true;
      } else {
        const newFs = JSON.parse(JSON.stringify(fs));
        const curr = getCurrentDirNode(newFs, pathStack);
        if (curr && curr.children && curr.children[src]) {
          curr.children[dest] = { ...curr.children[src], name: dest };
          delete curr.children[src];
          setFs(newFs);
          output = `renamed '${src}' -> '${dest}'`;
        } else {
          output = `mv: cannot stat '${src}': No such file or directory`;
          isError = true;
        }
      }
    }
    // Command: chmod / chown
    else if (lower.startsWith('chmod ') || lower.startsWith('chown ')) {
      const parts = trimmed.split(/\s+/);
      if (parts.length < 3) {
        output = `${parts[0]}: missing operand`;
        isError = true;
      } else {
        output = `[simulated] ${parts[0]} applied to '${parts[parts.length - 1]}'`;
      }
    }
    // Command: ip addr
    else if (lower === 'ip addr' || lower.startsWith('ip ')) {
      output = [
        '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN',
        '    inet 127.0.0.1/8 scope host lo',
        '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP',
        '    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0',
      ].join('\n');
    }
    // Command: ping
    else if (lower.startsWith('ping ')) {
      const host = trimmed.split(/\s+/).pop() || 'kernel.org';
      output = [
        `PING ${host} (139.178.84.217) 56(84) bytes of data.`,
        `64 bytes from ${host}: icmp_seq=1 ttl=56 time=18.4 ms`,
        `64 bytes from ${host}: icmp_seq=2 ttl=56 time=17.9 ms`,
        `64 bytes from ${host}: icmp_seq=3 ttl=56 time=18.2 ms`,
        `--- ${host} ping statistics ---`,
        '3 packets transmitted, 3 received, 0% packet loss',
      ].join('\n');
    }
    // Command: ssh
    else if (lower.startsWith('ssh ')) {
      const target = trimmed.split(/\s+/)[1] || 'explorer@koral.local';
      output = `[simulated] Connecting to ${target} via SSH-2.0-OpenSSH_9.6p1...\nWelcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-koral x86_64)`;
    }
    // Command: curl
    else if (lower.startsWith('curl ')) {
      output = [
        'HTTP/2 200',
        'server: nginx',
        'content-type: text/html; charset=utf-8',
        'x-koral-sandbox: simulated-response',
      ].join('\n');
    }
    // Command: apt
    else if (lower.startsWith('apt ') || lower.startsWith('sudo apt ')) {
      if (lower.includes('update')) {
        output = [
          'Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease',
          'Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]',
          'Reading package lists... Done',
          '14 packages can be upgraded. Run \'apt upgrade\' to upgrade them.',
        ].join('\n');
      } else if (lower.includes('install')) {
        const pkg = trimmed.split(/\s+/).pop() || 'package';
        output = [
          'Reading package lists... Done',
          `The following NEW packages will be installed: ${pkg}`,
          `Unpacking ${pkg} ...`,
          `Setting up ${pkg} ... done.`,
        ].join('\n');
      } else if (lower.includes('upgrade')) {
        output = [
          'Calculating upgrade... Done',
          '14 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.',
        ].join('\n');
      } else {
        output = 'apt: simulated package manager. Try apt update, apt install <pkg>, or apt upgrade.';
      }
    }
    // Command: help
    else if (lower === 'help') {
      output =
        'GNU bash, version 5.2.21-release (x86_64-pc-linux-gnu)\nAvailable builtins & utilities: pwd, ls, cd, mkdir, touch, cp, mv, rm, cat, echo, head, tail, whoami, hostname, free, id, date, uptime, history, uname, chmod, chown, ip, ping, ssh, curl, apt, clear.\nCTF challenge: /bblug';
    } else {
      output = `bash: ${trimmed.split(' ')[0]}: command not found`;
      isError = true;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: trimmed,
        path: currentPathStr,
        output,
        isError,
        isEasterEgg,
      },
    ]);
    setInputValue('');
  };

  useEffect(() => {
    executeCommandRef.current = executeCommand;
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
    }
  };

  const handleChipClick = (cmd: string) => {
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  const renderTerminalOutput = (output: string, isError?: boolean) => {
    const lines = output.split('\n');
    return (
      <div
        className={`pl-1 whitespace-pre-wrap font-mono text-[13px] leading-relaxed select-text space-y-0.5 ${
          isError ? 'text-red-400' : 'text-neutral-300'
        }`}
      >
        {lines.map((line, idx) => {
          if (line.startsWith('[+]')) {
            return (
              <div key={idx} className="text-emerald-400 font-semibold select-text">
                {line}
              </div>
            );
          }
          if (line.startsWith('[-]')) {
            return (
              <div key={idx} className="text-red-400 select-text">
                {line}
              </div>
            );
          }
          if (line.startsWith('[*]')) {
            return (
              <div key={idx} className="text-[#FFC500] font-bold select-text">
                {line}
              </div>
            );
          }
          if (line.startsWith('---') || line.startsWith('===')) {
            return (
              <div key={idx} className="text-neutral-600 select-none">
                {line}
              </div>
            );
          }
          if (line.startsWith('Referensi  : ')) {
            const refText = line.replace('Referensi  : ', '').trim();
            return (
              <div key={idx} className="flex flex-wrap items-center gap-1 select-text">
                <span className="text-neutral-500 select-none">Referensi  : </span>
                <button
                  type="button"
                  onClick={() => {
                    if (terminalMode === 'maximized') setTerminalMode('normal');
                    setTimeout(() => {
                      document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="text-sky-400 hover:text-[#FFC500] hover:underline cursor-pointer text-left"
                >
                  {refText} ↗
                </button>
              </div>
            );
          }
          if (line.startsWith('Ciphertext : ')) {
            const cipher = line.replace('Ciphertext : ', '').trim();
            return (
              <div key={idx} className="flex flex-wrap items-center gap-1 select-text">
                <span className="text-neutral-500 select-none">Ciphertext : </span>
                <span className="text-[#FFC500] font-bold select-all">{cipher}</span>
              </div>
            );
          }
          return (
            <div key={idx} className="select-text">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  const PALETTE_COMMANDS = [
    'pwd',
    'ls',
    'mkdir test-folder',
    'touch script.sh',
    'rm script.sh',
    'cat notes.txt',
    '/bblug',
    'whoami',
    'uname -a',
    'clear',
  ];

  return (
    <section
      id="playground"
      ref={containerRef}
      className="relative w-full bg-[#000000] text-[#F0F0F0] py-24 sm:py-32 border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-12 sm:gap-16">
        {/* SECTION HEADER */}
        <div className="pg-reveal flex flex-col gap-6">
          {/* Chapter Label */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#FFC500] inline-block shadow-sm" />
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[#FFC500] uppercase">
              02 / LEARN BY DOING
            </span>
          </div>

          {/* Heading and Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between border-b border-white/15 pb-10">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-display font-medium text-4xl sm:text-6xl lg:text-[72px] leading-[0.98] tracking-tighter text-white">
                Enter the Linux Playground.
              </h2>
              <p className="font-sans text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
                Bebas eksplorasi syntax Linux: buat folder (`mkdir`), buat file (`touch`),
                hapus (`rm`), atau navigasi (`cd`). Semua interaktif dalam memori dan aman.
              </p>
            </div>

            {/* Simulation Status Badge & Reset Button */}
            <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-[#FFC500]/40 bg-[#FFC500]/10 text-[#FFC500] rounded">
                <span className="font-bold tracking-wider">IN-MEMORY SESSION / READY</span>
              </div>
              <button
                type="button"
                onClick={resetFilesystem}
                className="px-3 py-1.5 border border-[#FFC500]/40 bg-[#FFC500]/10 hover:bg-[#FFC500] text-[#FFC500] hover:text-black rounded transition-colors font-bold flex items-center gap-1.5"
                title="Hapus semua perubahan dan reset filesystem ke awal"
              >
                <span>RESET FS</span>
                <span>↺</span>
              </button>
            </div>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE (2 Columns: Terminal Left + Learning Sidebar Right) */}
        <div className="pg-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: Terminal Workspace (Col Span 7) */}
          <div className="lg:col-span-7 w-full flex flex-col gap-3 font-mono">
            {/* Backdrop when maximized */}
            {terminalMode === 'maximized' && (
              <div
                className="fixed inset-0 bg-black/85 backdrop-blur-sm z-40 transition-opacity cursor-pointer animate-fadeIn"
                onClick={() => setTerminalMode('normal')}
              />
            )}

            {/* In-place placeholder when maximized so right sidebar & bottom content never shift */}
            {terminalMode === 'maximized' && (
              <div className="w-full min-h-[380px] border border-dashed border-[#FFC500]/40 rounded-lg bg-[#0D0D0D]/60 flex flex-col items-center justify-center p-6 text-center font-mono gap-3 shadow-inner">
                <div className="w-3 h-3 rounded-full bg-[#FFC500] animate-ping" />
                <span className="text-[#FFC500] text-xs sm:text-sm font-bold tracking-wider">
                  [ TERMINAL MAXIMIZED · FOCUS MODE ]
                </span>
                <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
                  Terminal sedang dibuka layar penuh agar tidak merusak layout konten samping &amp; bawah.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTerminalMode('normal')}
                    className="px-3 py-1.5 bg-[#FFC500] text-black font-bold text-xs rounded hover:bg-yellow-400 transition"
                  >
                    KEMBALIKAN KE SINI (RESTORE)
                  </button>
                  <span className="text-neutral-500 text-[11px]">atau tekan ESC</span>
                </div>
              </div>
            )}

            {/* Terminal Window Box */}
            <div
              className={
                terminalMode === 'maximized'
                  ? 'fixed inset-3 sm:inset-6 md:inset-10 z-50 bg-[#0D0D0D] text-[#F0F0F0] border-2 border-[#FFC500]/70 rounded-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col cursor-text transition-all'
                  : terminalMode === 'minimized'
                  ? 'w-full bg-[#0D0D0D] text-[#F0F0F0] border border-white/20 rounded-lg shadow-md overflow-hidden flex flex-col transition-all cursor-pointer'
                  : 'w-full bg-[#0D0D0D] text-[#F0F0F0] border border-white/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all cursor-text'
              }
              onClick={() => {
                if (terminalMode === 'minimized') {
                  setTerminalMode('normal');
                } else {
                  inputRef.current?.focus();
                }
              }}
            >
              {/* Window Bar (Authentic Linux / Unix Terminal) */}
              <div className="h-9 px-4 bg-[#141414] border-b border-white/10 flex items-center justify-between select-none">
                {/* Traffic lights controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFilesystem();
                    }}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-125 transition-all flex items-center justify-center text-[8px] text-black/70 font-bold group"
                    title="Close / Reset filesystem"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTerminalMode((prev) => (prev === 'minimized' ? 'normal' : 'minimized'));
                    }}
                    className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all flex items-center justify-center text-[9px] text-black/70 font-bold group"
                    title={terminalMode === 'minimized' ? 'Restore window' : 'Minimize window'}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">−</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTerminalMode((prev) => (prev === 'maximized' ? 'normal' : 'maximized'));
                    }}
                    className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-125 transition-all flex items-center justify-center text-[8px] text-black/70 font-bold group"
                    title={terminalMode === 'maximized' ? 'Restore window (Esc)' : 'Maximize window'}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {terminalMode === 'maximized' ? '❐' : '+'}
                    </span>
                  </button>
                </div>

                {/* Shell Title */}
                <div className="flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-none font-mono text-[11px] text-neutral-300">
                  <span className="text-neutral-500">bash — </span>
                  <span className="text-emerald-400 font-semibold">linux-explorer@koral</span>
                  <span className="text-neutral-500">:</span>
                  <span className="text-sky-400 font-medium truncate">{currentPathStr}</span>
                  {terminalMode === 'minimized' && (
                    <span className="text-[#FFC500] font-bold text-[10px] ml-1">[MIN]</span>
                  )}
                  {terminalMode === 'maximized' && (
                    <span className="text-[#FFC500] font-bold text-[10px] ml-1">[MAX · ESC TO RESTORE]</span>
                  )}
                </div>

                {/* Window Actions */}
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  {terminalMode === 'minimized' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTerminalMode('normal');
                      }}
                      className="px-2 py-0.5 bg-[#FFC500] text-black font-bold rounded hover:bg-yellow-400 transition-colors"
                    >
                      RESTORE
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTerminalMode((prev) => (prev === 'maximized' ? 'normal' : 'maximized'));
                        }}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title="Toggle fullscreen / maximize"
                      >
                        [{terminalMode === 'maximized' ? 'RESTORE' : 'MAXIMIZE'}]
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetFilesystem();
                        }}
                        className="text-neutral-400 hover:text-red-400 transition-colors hidden sm:inline"
                        title="Reset filesystem & CTF"
                      >
                        [RESET]
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistory([]);
                    }}
                    className="text-neutral-400 hover:text-[#FFC500] transition-colors"
                    title="Clear screen (Ctrl+L)"
                  >
                    [CLEAR]
                  </button>
                </div>
              </div>

              {/* Scrollable Command Area (hidden when minimized) */}
              {terminalMode !== 'minimized' && (
                <div
                  ref={terminalScrollRef}
                  className={`p-4 sm:p-5 overflow-y-auto space-y-2.5 text-[13px] font-mono leading-relaxed bg-[#0c0c0c] scrollbar-thin scrollbar-thumb-white/20 ${
                    terminalMode === 'maximized'
                      ? 'flex-1 min-h-[300px]'
                      : 'min-h-[300px] max-h-[440px]'
                  }`}
                >
                  {history.map((item) => (
                    <div key={item.id} className="space-y-1 font-mono">
                      {item.command !== '# next-challenge' && item.command !== '# reset-fs' && (
                        <div className="flex flex-wrap items-center gap-1 font-mono text-[13px] leading-tight">
                          <span className="text-emerald-400 font-bold select-none">linux-explorer@koral</span>
                          <span className="text-neutral-500 select-none">:</span>
                          <span className="text-sky-400 font-semibold select-none">{item.path || currentPathStr}</span>
                          <span className="text-[#FFC500] font-bold select-none">$</span>
                          <span className="text-white ml-1 font-medium">{item.command}</span>
                        </div>
                      )}

                      {/* Pure Terminal Stdout Output */}
                      {item.output ? renderTerminalOutput(item.output, item.isError) : null}

                      {/* ASCII Art Mascot Dump (Terminal Stream) */}
                      {item.asciiArt && (
                        <div className="my-2 py-1 select-all overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800">
                          <pre className="font-mono text-[6px] sm:text-[7.5px] md:text-[8.5px] leading-[1.02] tracking-tight text-[#FFC500] select-all whitespace-pre">
                            {item.asciiArt}
                          </pre>
                        </div>
                      )}

                      {/* Post Output (e.g. Next Challenge Banner) */}
                      {item.postOutput ? renderTerminalOutput(item.postOutput, false) : null}
                    </div>
                  ))}

                  {/* Active Input Prompt */}
                  <div className="flex items-center gap-1 font-mono text-[13px] pt-1">
                    <span className="text-emerald-400 font-bold select-none">linux-explorer@koral</span>
                    <span className="text-neutral-500 select-none">:</span>
                    <span className="text-sky-400 font-semibold select-none">{currentPathStr}</span>
                    <span className="text-[#FFC500] font-bold select-none">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder=""
                      className="flex-1 ml-1.5 bg-transparent border-none outline-none text-white text-[13px] font-mono p-0 focus:ring-0 caret-[#FFC500]"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {/* Suggested Quick Chips (Authentic CLI bar) */}
              {terminalMode !== 'minimized' && (
                <div className="px-4 py-2 bg-[#101010] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-neutral-500 text-[11px] select-none">QUICK CMD:</span>
                    {['pwd', 'ls -la', 'cat notes.txt', '/bblug', 'whoami', 'uname -a', 'clear'].map((cmd) => (
                      <button
                        key={cmd}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChipClick(cmd);
                        }}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                          cmd === '/bblug'
                            ? 'bg-[#FFC500]/20 text-[#FFC500] hover:bg-[#FFC500] hover:text-black font-bold'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                        }`}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                  <div className="text-neutral-500 text-[10px] hidden sm:block">
                    BASH v5.2 · VIRTUAL MEMORY
                  </div>
                </div>
              )}
            </div>

            {/* Instruction description under terminal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 font-mono gap-1 pt-1">
              {terminalMode === 'minimized' ? (
                <span className="text-[#FFC500]">
                  Terminal diminimalkan · Klik bar terminal atau tombol RESTORE untuk membuka.
                </span>
              ) : terminalMode === 'maximized' ? (
                <span className="text-[#FFC500]">
                  Layar penuh aktif · Tekan ESC atau tombol RESTORE untuk kembali normal.
                </span>
              ) : (
                <span>
                  {ctfStage > 0 && ctfStage <= 3
                    ? `[CTF ACTIVE: STAGE ${ctfStage}/3] · KETIK JAWABAN ATAU /bblug reset`
                    : '↑ ↓ COMMANDS · ENTER TO RUN · KETIK /bblug UNTUK MEMULAI CTF EASTER EGG'}
                </span>
              )}
              <span>Data hanya di memori browser (refresh untuk reset).</span>
            </div>
          </div>

          {/* RIGHT: Learning Sidebar (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Box 1: Dynamic Filesystem Live Preview */}
            <div className="border border-white/20 bg-[#0D0D0D] p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-white/10">
                <span className="text-[#FFC500] font-bold tracking-wider">
                  FILESYSTEM / LIVE PREVIEW
                </span>
                <span className="text-neutral-500">DYNAMIC TREE</span>
              </div>

              {/* Dynamic Virtual Filesystem ASCII Tree */}
              <pre className="font-mono text-xs sm:text-[13px] text-neutral-300 leading-relaxed overflow-x-auto py-2">
                {`~ / linux-explorer\n${renderAsciiTree(fs).join('\n')}`}
              </pre>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-neutral-400">
                <span>CURRENT LOCATION:</span>
                <span className="text-[#FFC500] font-bold">{currentPathStr}</span>
              </div>
            </div>

            {/* Box 2: Mini Challenge */}
            <div className="border border-white/20 bg-[#0D0D0D] p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FFC500] inline-block" />
                  <span className="text-white font-bold tracking-wider">MINI CHALLENGE</span>
                </div>
                <span className="text-[#FFC500] font-bold font-mono">
                  {completedCount} / 4 COMPLETED
                </span>
              </div>

              <div>
                <h4 className="font-sans font-semibold text-lg text-white">
                  Make yourself at home.
                </h4>
                <p className="font-sans text-xs text-neutral-400 pt-1">
                  Coba buat, masuk direktori, buat file, dan baca file untuk menyelesaikan tantangan.
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFC500] transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2.5 font-mono text-xs pt-1">
                <div
                  className={`flex items-center gap-2.5 ${
                    hasCreatedHello ? 'text-[#FFC500]' : 'text-neutral-400'
                  }`}
                >
                  <span>{hasCreatedHello ? '✓' : '○'}</span>
                  <span>Create hello-linux (mkdir hello-linux)</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 ${
                    hasEnteredDir ? 'text-[#FFC500]' : 'text-neutral-400'
                  }`}
                >
                  <span>{hasEnteredDir ? '✓' : '○'}</span>
                  <span>Enter the directory (cd hello-linux)</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 ${
                    hasCreatedNotes ? 'text-[#FFC500]' : 'text-neutral-400'
                  }`}
                >
                  <span>{hasCreatedNotes ? '✓' : '○'}</span>
                  <span>Create notes.txt (touch notes.txt)</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 ${
                    hasReadNotes ? 'text-[#FFC500]' : 'text-neutral-400'
                  }`}
                >
                  <span>{hasReadNotes ? '✓' : '○'}</span>
                  <span>Read it with cat notes.txt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Supported Commands Palette */}
        <div className="pg-reveal border-t border-white/15 pt-8 space-y-4">
          <div className="font-mono text-xs text-neutral-400 tracking-wider uppercase">
            QUICK EXPERIMENT COMMANDS
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {PALETTE_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => handleChipClick(cmd)}
                className={`px-3.5 py-1.5 font-mono text-xs border rounded transition-all duration-150 active:scale-95 ${
                  cmd === '/bblug'
                    ? 'bg-[#FFC500]/20 text-[#FFC500] border-[#FFC500] hover:bg-[#FFC500] hover:text-black font-bold'
                    : 'bg-[#141414] hover:bg-[#FFC500] text-neutral-300 hover:text-black border-white/15 hover:border-[#FFC500]'
                }`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}