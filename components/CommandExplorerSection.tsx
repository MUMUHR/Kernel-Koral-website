'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CommandItem {
  id: string;
  refNumber: string;
  name: string;
  summary: string;
  description: string;
  syntax: string;
  exampleCmd: string;
  exampleOutput: string;
  further: string;
  steps?: string[];
  playgroundCmd: string;
}

interface CommandCategory {
  id: string;
  title: string;
  commands: CommandItem[];
}

const COMMAND_CATEGORIES: CommandCategory[] = [
  {
    id: 'file-management',
    title: 'File Management',
    commands: [
      {
        id: 'ls',
        refNumber: '01',
        name: 'ls',
        summary: "See what's here.",
        description:
          'List files and directories in your current directory, or in a path you specify.',
        syntax: 'ls [options] [path]',
        exampleCmd: '$ ls /home/linux-explorer',
        exampleOutput: 'Documents  Downloads  Projects',
        further:
          'ls -l adds details such as permissions and ownership. ls -a includes hidden entries.',
        playgroundCmd: 'ls',
      },
      {
        id: 'cd',
        refNumber: '02',
        name: 'cd',
        summary: 'Move between directories.',
        description:
          'Change the shell working directory to navigate across the Linux filesystem hierarchy.',
        syntax: 'cd [directory]',
        exampleCmd: '$ cd ~/Projects/hello-linux',
        exampleOutput: 'linux-explorer@koral:~/Projects/hello-linux$',
        further:
          'cd .. moves one level up to the parent directory. cd ~ or bare cd always returns home.',
        playgroundCmd: 'cd ..',
      },
      {
        id: 'pwd',
        refNumber: '03',
        name: 'pwd',
        summary: 'Know where you stand.',
        description:
          'Print the full absolute path of your current working directory from root (/).',
        syntax: 'pwd [options]',
        exampleCmd: '$ pwd',
        exampleOutput: '/home/linux-explorer/Projects/hello-linux',
        further:
          'pwd -P resolves symbolic links to reveal the true physical path on disk.',
        playgroundCmd: 'pwd',
      },
      {
        id: 'mkdir',
        refNumber: '04',
        name: 'mkdir',
        summary: 'Create new folders.',
        description:
          'Create one or more directories inside the current working path or a specified location.',
        syntax: 'mkdir [options] <directory>',
        exampleCmd: '$ mkdir kernel-lab',
        exampleOutput: '(directory created silently with exit code 0)',
        further:
          'mkdir -p parent/child/leaf creates missing parent directories automatically without errors.',
        playgroundCmd: 'mkdir kernel-lab',
      },
      {
        id: 'touch',
        refNumber: '05',
        name: 'touch',
        summary: 'Create empty files fast.',
        description:
          'Create an empty file if it does not exist, or update its access and modification timestamps.',
        syntax: 'touch [options] <file>',
        exampleCmd: '$ touch notes.txt',
        exampleOutput: '(empty file notes.txt created)',
        further:
          'Combine brace expansion like touch app_{1..3}.log to scaffold multiple files in one command.',
        playgroundCmd: 'touch demo.txt',
      },
      {
        id: 'cp',
        refNumber: '06',
        name: 'cp',
        summary: 'Duplicate files or folders.',
        description:
          'Copy files or directories from a source path to a destination path.',
        syntax: 'cp [options] <source> <destination>',
        exampleCmd: '$ cp notes.txt notes-backup.txt',
        exampleOutput: '(copied notes.txt -> notes-backup.txt)',
        further:
          'Use cp -r to copy directories recursively, and cp -i to prompt before overwriting.',
        playgroundCmd: 'cp notes.txt notes-backup.txt',
      },
      {
        id: 'mv',
        refNumber: '07',
        name: 'mv',
        summary: 'Move or rename items.',
        description:
          'Move files or directories to another location, or rename them in place.',
        syntax: 'mv [options] <source> <destination>',
        exampleCmd: '$ mv draft.txt final.txt',
        exampleOutput: '(renamed draft.txt -> final.txt)',
        further:
          'Unlike cp, mv moves inode pointers within the same filesystem almost instantaneously.',
        playgroundCmd: 'mv demo.txt readme.txt',
      },
      {
        id: 'rm',
        refNumber: '08',
        name: 'rm',
        summary: 'Remove entries permanently.',
        description:
          'Delete files or directories from the filesystem without sending them to a graphical trash bin.',
        syntax: 'rm [options] <target>',
        exampleCmd: '$ rm old-log.txt',
        exampleOutput: "removed 'old-log.txt'",
        further:
          'rm -r deletes directories recursively. Always double-check paths before adding -f (force).',
        playgroundCmd: 'rm readme.txt',
      },
    ],
  },
  {
    id: 'system-info',
    title: 'System Information',
    commands: [
      {
        id: 'uname',
        refNumber: '09',
        name: 'uname',
        summary: 'Inspect the kernel identity.',
        description:
          'Display system information including kernel name, release version, and CPU architecture.',
        syntax: 'uname [options]',
        exampleCmd: '$ uname -a',
        exampleOutput: 'Linux playground 6.8.0-koral #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
        further:
          'uname -r prints only the kernel release string, useful when installing kernel headers.',
        playgroundCmd: 'uname -a',
      },
      {
        id: 'whoami',
        refNumber: '10',
        name: 'whoami',
        summary: 'Identify the active user.',
        description:
          'Print the effective username associated with your current shell session.',
        syntax: 'whoami',
        exampleCmd: '$ whoami',
        exampleOutput: 'linux-explorer',
        further:
          'Run id right after whoami to view your UID, GID, and all supplementary group memberships.',
        playgroundCmd: 'whoami',
      },
      {
        id: 'hostname',
        refNumber: '11',
        name: 'hostname',
        summary: 'Check machine network name.',
        description:
          'Show or set the system host name used to identify the machine across local networks and SSH.',
        syntax: 'hostname [options]',
        exampleCmd: '$ hostname',
        exampleOutput: 'koral',
        further:
          'hostname -I lists all assigned local IP addresses without querying external DNS.',
        playgroundCmd: 'hostname',
      },
      {
        id: 'uptime',
        refNumber: '12',
        name: 'uptime',
        summary: 'Measure runtime & load.',
        description:
          'Show current system time, how long the OS has been running, active users, and load averages.',
        syntax: 'uptime [options]',
        exampleCmd: '$ uptime',
        exampleOutput: ' 00:00:00 up 42 days, 1 user,  load average: 0.08, 0.03, 0.01',
        further:
          'The three load numbers represent average runnable processes over 1, 5, and 15 minutes.',
        playgroundCmd: 'uptime',
      },
      {
        id: 'free',
        refNumber: '13',
        name: 'free',
        summary: 'Monitor RAM & swap usage.',
        description:
          'Display total, used, free, cached, and available physical memory and swap space.',
        syntax: 'free [options]',
        exampleCmd: '$ free -h',
        exampleOutput: 'Mem: 15Gi total · 3.2Gi used · 12Gi available',
        further:
          'Always focus on the "available" column rather than "free" — Linux smartly caches disk reads in RAM.',
        playgroundCmd: 'free -h',
      },
    ],
  },
  {
    id: 'file-permissions',
    title: 'File Permissions',
    commands: [
      {
        id: 'chmod',
        refNumber: '14',
        name: 'chmod',
        summary: 'Control read, write, execute.',
        description:
          'Change access mode bits of files or directories for owner, group, and others.',
        syntax: 'chmod <mode> <file>',
        exampleCmd: '$ chmod +x deploy.sh',
        exampleOutput: '(mode of deploy.sh changed to -rwxr-xr-x)',
        further:
          'Numeric octal mode works too: chmod 755 sets rwx for owner and r-x for group/others.',
        playgroundCmd: 'chmod +x notes.txt',
      },
      {
        id: 'chown',
        refNumber: '15',
        name: 'chown',
        summary: 'Transfer file ownership.',
        description:
          'Change the owning user and/or group of a specified file or directory tree.',
        syntax: 'chown [options] <user>:<group> <file>',
        exampleCmd: '$ chown linux-explorer:devs app.conf',
        exampleOutput: '(ownership updated to linux-explorer:devs)',
        further:
          'Add -R to recursively transfer ownership across an entire project directory.',
        playgroundCmd: 'chown linux-explorer:linux-explorer notes.txt',
      },
      {
        id: 'ls-l',
        refNumber: '16',
        name: 'ls -l',
        summary: 'Read permission strings.',
        description:
          'Render long listing format showing file type, permissions, link count, owner, size, and date.',
        syntax: 'ls -l [path]',
        exampleCmd: '$ ls -l',
        exampleOutput: '-rw-r--r-- 1 linux-explorer linux-explorer 58 Nov 10 00:00 notes.txt',
        further:
          'First character shows type (d for directory, - for regular file, l for symlink), followed by rwx triplets.',
        playgroundCmd: 'ls -l',
      },
    ],
  },
  {
    id: 'networking',
    title: 'Networking',
    commands: [
      {
        id: 'ip-addr',
        refNumber: '17',
        name: 'ip addr',
        summary: 'Inspect network interfaces.',
        description:
          'Display IPv4/IPv6 addresses, MAC hardware addresses, and interface link state.',
        syntax: 'ip addr show [interface]',
        exampleCmd: '$ ip addr',
        exampleOutput: '2: eth0: <BROADCAST,MULTICAST,UP> inet 192.168.1.42/24',
        further:
          'ip -br addr outputs a clean single-line summary per interface for fast terminal scanning.',
        playgroundCmd: 'ip addr',
      },
      {
        id: 'ping',
        refNumber: '18',
        name: 'ping',
        summary: 'Test host reachability.',
        description:
          'Send ICMP ECHO_REQUEST packets to verify connectivity and measure round-trip latency.',
        syntax: 'ping [options] <destination>',
        exampleCmd: '$ ping -c 3 kernel.org',
        exampleOutput: '64 bytes from kernel.org: icmp_seq=1 ttl=56 time=18.4 ms',
        further:
          'On Linux, ping runs indefinitely until Ctrl+C unless you limit packets with -c <count>.',
        playgroundCmd: 'ping -c 3 kernel.org',
      },
      {
        id: 'ssh',
        refNumber: '19',
        name: 'ssh',
        summary: 'Encrypted remote shell.',
        description:
          'Connect securely to another Linux machine over an encrypted cryptographic tunnel.',
        syntax: 'ssh [user@]host [-p port]',
        exampleCmd: '$ ssh explorer@192.168.1.10',
        exampleOutput: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-generic)',
        further:
          'Pair ssh with Ed25519 key authentication (~/.ssh/id_ed25519) instead of passwords.',
        playgroundCmd: 'ssh explorer@koral.local',
      },
      {
        id: 'curl',
        refNumber: '20',
        name: 'curl',
        summary: 'Transfer data via URLs.',
        description:
          'Make HTTP/HTTPS requests, inspect headers, download artifacts, or test REST APIs from CLI.',
        syntax: 'curl [options] <url>',
        exampleCmd: '$ curl -I https://kernel.org',
        exampleOutput: 'HTTP/2 200 · content-type: text/html; charset=utf-8',
        further:
          'Use curl -fsSL for clean script downloads and curl -X POST -d for JSON API payloads.',
        playgroundCmd: 'curl -I https://kernel.org',
      },
    ],
  },
  {
    id: 'package-management',
    title: 'Package Management',
    commands: [
      {
        id: 'apt-update',
        refNumber: '21',
        name: 'apt update',
        summary: 'Refresh package indexes.',
        description:
          'Synchronize local package index metadata with configured Debian/Ubuntu repositories.',
        syntax: 'sudo apt update',
        exampleCmd: '$ sudo apt update',
        exampleOutput: 'Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease · 14 packages upgradable',
        further:
          'apt update refreshes the catalog only — it does not download or install new binaries yet.',
        playgroundCmd: 'apt update',
      },
      {
        id: 'apt-install',
        refNumber: '22',
        name: 'apt install',
        summary: 'Install software & deps.',
        description:
          'Resolve dependencies and install requested packages cleanly from verified repositories.',
        syntax: 'sudo apt install <package>',
        exampleCmd: '$ sudo apt install neofetch',
        exampleOutput: 'Unpacking neofetch ... Setting up neofetch (7.1.0) ... done.',
        further:
          'Add -y to auto-confirm installation prompts in automated server provisioning scripts.',
        playgroundCmd: 'apt install htop',
      },
      {
        id: 'apt-upgrade',
        refNumber: '23',
        name: 'apt upgrade',
        summary: 'Apply latest updates.',
        description:
          'Upgrade all currently installed packages to their newest compatible repository versions.',
        syntax: 'sudo apt upgrade [options]',
        exampleCmd: '$ sudo apt upgrade',
        exampleOutput: '14 upgraded, 0 newly installed, 0 to remove.',
        further:
          'Always run apt update before apt upgrade so the resolver knows about newer security patches.',
        playgroundCmd: 'apt upgrade',
      },
    ],
  },
  {
    id: 'text-cipher',
    title: 'Text & Cipher Decoding',
    commands: [
      {
        id: 'echo-pipe',
        refNumber: '24',
        name: 'echo |',
        summary: 'Print & pipe text streams.',
        description:
          'Output text to standard output (stdout) and chain it with a pipe (|) into another command for processing or decoding.',
        syntax: "echo '<text>' | <target-command>",
        exampleCmd: "$ echo 'linux-core' | rev",
        exampleOutput: 'eroc-xunil',
        further:
          'In Linux, pipes (|) let small focused tools work together by passing stdout of one command directly into stdin of the next.',
        steps: [
          '1. Bungkus teks atau ciphertext dengan tanda kutip tunggal: echo \'teks\'.',
          '2. Tambahkan operator pipe (|) untuk mengalirkan teks ke command berikutnya.',
          '3. Sambungkan dengan decoder seperti base64 -d, tr, atau rev.',
        ],
        playgroundCmd: "echo 'koral-linux' | rev",
      },
      {
        id: 'base64',
        refNumber: '25',
        name: 'base64',
        summary: 'Decode Base64 encoded data.',
        description:
          'Encode or decode Base64 strings safely across text-based channels. Commonly used in payloads, tokens, and Stage 1 CTF challenges.',
        syntax: "echo '<ciphertext>' | base64 -d",
        exampleCmd: "$ echo 'aGVsbG8tbGludXg=' | base64 -d",
        exampleOutput: 'hello-linux',
        further:
          'Flag -d (atau --decode) memberitahu base64 untuk mengembalikan string terenkode menjadi teks asli yang bisa dibaca.',
        steps: [
          '1. Salin ciphertext dari Stage 1 tantangan /bblug di Playground.',
          '2. Jalankan pipeline: echo \'<ciphertext>\' | base64 -d (ganti <ciphertext> dengan kode soal).',
          '3. Submit hasil decode dengan mengetik /bblug <hasil_decode> atau langsung tempel ke terminal.',
        ],
        playgroundCmd: "echo 'aGVsbG8tbGludXg=' | base64 -d",
      },
      {
        id: 'tr',
        refNumber: '26',
        name: 'tr',
        summary: 'Translate or shift characters.',
        description:
          'Translate, substitute, or rotate characters from standard input. Ideal for decoding Caesar / ROT13 shift ciphers.',
        syntax: "echo '<ciphertext>' | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        exampleCmd: "$ echo 'uryyb-yvahk' | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        exampleOutput: 'hello-linux',
        further:
          "Set 'A-Za-z' menjadi 'N-ZA-Mn-za-m' memetakan setiap huruf ke posisi +13 alfabet (ROT13), yang otomatis membalik pergeseran 13 huruf.",
        steps: [
          '1. Ambil ciphertext hasil Stage 1 untuk dipecahkan pada Stage 2.',
          '2. Jalankan pipeline: echo \'<ciphertext>\' | tr \'A-Za-z\' \'N-ZA-Mn-za-m\'.',
          '3. Kirim output teks yang terbaca dengan /bblug <hasil_decode>.',
        ],
        playgroundCmd: "echo 'uryyb-yvahk' | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
      },
      {
        id: 'rev',
        refNumber: '27',
        name: 'rev',
        summary: 'Reverse character order.',
        description:
          'Reverse lines character-by-character from right to left. Useful for mirrored strings and final-layer obfuscation.',
        syntax: "echo '<ciphertext>' | rev",
        exampleCmd: "$ echo 'xunil-olleh' | rev",
        exampleOutput: 'hello-linux',
        further:
          'Command rev bekerja per baris secara instan dan sering digabung dengan tr atau base64 dalam pipeline multi-tahap.',
        steps: [
          '1. Ambil teks terbalik dari Stage 3 tantangan /bblug.',
          '2. Jalankan pipeline: echo \'<ciphertext>\' | rev di terminal Playground.',
          '3. Submit flag final menggunakan /bblug <flag_final> untuk membuka akses penuh.',
        ],
        playgroundCmd: "echo 'xunil-olleh' | rev",
      },
    ],
  },
];

export default function CommandExplorerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const [openCategories, setOpenCategories] = useState<string[]>([
    'file-management',
    'system-info',
    'file-permissions',
    'networking',
    'package-management',
    'text-cipher',
  ]);
  const [selectedCmdId, setSelectedCmdId] = useState<string>('ls');

  // Flatten commands for lookup
  const allCommands = COMMAND_CATEGORIES.flatMap((cat) =>
    cat.commands.map((cmd) => ({ ...cmd, categoryTitle: cat.title }))
  );
  const activeCommand =
    allCommands.find((c) => c.id === selectedCmdId) || allCommands[0];

  // Entrance scroll animation
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
        '.ce-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.75, ease: 'power2.out', clearProps: 'transformOrigin' }
      )
        .fromTo(
          '.ce-header-reveal',
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          0.1
        )
        .fromTo(
          '.ce-left-col',
          { x: -35, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          0.25
        )
        .fromTo(
          '.ce-right-col',
          { x: 35, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          0.25
        );
    },
    { scope: containerRef }
  );

  // Subtle transition animation when switching commands
  useEffect(() => {
    if (!detailRef.current) return;
    gsap.fromTo(
      detailRef.current.querySelectorAll('.ce-detail-anim'),
      { y: 10, opacity: 0.25 },
      {
        y: 0,
        opacity: 1,
        duration: 0.28,
        stagger: 0.03,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      }
    );
  }, [selectedCmdId]);

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleTryInPlayground = () => {
    const playgroundEl = document.getElementById('playground');
    if (playgroundEl) {
      playgroundEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.dispatchEvent(
      new CustomEvent('koral:try-command', {
        detail: { command: activeCommand.playgroundCmd },
      })
    );
  };

  return (
    <section
      id="explore"
      ref={containerRef}
      className="relative w-full bg-[#000000] text-[#F0F0F0] py-20 sm:py-24 lg:py-[100px] overflow-hidden"
    >
      <div className="max-w-[1776px] mx-auto px-6 lg:px-12 w-full flex flex-col gap-9">
        {/* Top Editorial Rule */}
        <div className="ce-rule w-full h-px bg-[#F0F0F0]" />

        {/* Chapter Label */}
        <div className="ce-header-reveal flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFC500] inline-block shrink-0" />
          <span className="font-mono text-[11px] leading-[15px] tracking-[0.06em] text-[#F0F0F0] uppercase">
            03 / THE LANGUAGE OF LINUX
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="ce-header-reveal font-display font-medium text-5xl sm:text-7xl lg:text-[88px] leading-[1.04] tracking-[-0.04em] text-[#F0F0F0]">
          Small commands.
          <br />
          Powerful ideas.
        </h2>

        {/* Description */}
        <p className="ce-header-reveal font-sans text-base sm:text-[17px] leading-[27px] text-[#F0F0F0]/85 max-w-3xl">
          Explore the command reference. Understand what each instruction does before you try it.
        </p>

        {/* Command Reference Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-2">
          {/* LEFT: Command Categories Accordion + Chips */}
          <div className="ce-left-col lg:col-span-4 xl:col-span-4 flex flex-col">
            <div className="flex flex-col border-t border-[#F0F0F0]">
              {COMMAND_CATEGORIES.map((category) => {
                const isOpen = openCategories.includes(category.id);
                const hasActiveCmd = category.commands.some(
                  (c) => c.id === selectedCmdId
                );

                return (
                  <div
                    key={category.id}
                    className="border-b border-[#F0F0F0] py-6 flex flex-col gap-4"
                  >
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span
                        className={`font-display text-lg sm:text-[20px] font-medium tracking-tight transition-colors ${
                          hasActiveCmd
                            ? 'text-[#FFC500]'
                            : 'text-[#F0F0F0] group-hover:text-[#FFC500]'
                        }`}
                      >
                        {category.title}
                      </span>
                      <span className="font-mono text-base text-[#F0F0F0] select-none">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {/* Discoverable Commands Grid */}
                    {isOpen && (
                      <div className="flex flex-wrap gap-2">
                        {category.commands.map((cmd) => {
                          const isSelected = cmd.id === selectedCmdId;
                          return (
                            <button
                              key={cmd.id}
                              type="button"
                              onClick={() => setSelectedCmdId(cmd.id)}
                              className={`h-10 px-3 font-mono text-[12px] tracking-tight border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#FFC500] text-[#000000] border-[#FFC500] font-bold'
                                  : 'bg-transparent text-[#F0F0F0] border-[#F0F0F0]/35 hover:border-[#FFC500] hover:text-[#FFC500]'
                              }`}
                            >
                              {cmd.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Disclaimer Note */}
            <p className="font-sans text-[12px] leading-[19px] text-[#F0F0F0]/60 pt-4">
              apt commands apply to Debian-family distributions, including Debian and Ubuntu. This
              reference does not execute commands.
            </p>
          </div>

          {/* RIGHT: Selected Command Detail Panel */}
          <div className="ce-right-col lg:col-span-8 xl:col-span-8">
            <div
              ref={detailRef}
              className="w-full border border-[#F0F0F0] p-6 sm:p-10 flex flex-col gap-7 bg-[#000000]"
            >
              {/* Detail Header */}
              <div className="ce-detail-anim flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.08em] uppercase">
                <span className="text-[#FFC500] font-semibold">
                  {activeCommand.categoryTitle}
                </span>
                <span className="text-[#F0F0F0]/75">
                  REFERENCE / {activeCommand.refNumber}
                </span>
              </div>

              {/* Command Big Display Title */}
              <div className="ce-detail-anim">
                <h3 className="font-display font-normal text-6xl sm:text-8xl lg:text-[120px] leading-none tracking-tight text-[#F0F0F0]">
                  {activeCommand.name}
                </h3>
              </div>

              {/* Summary & Description */}
              <div className="ce-detail-anim flex flex-col gap-3">
                <p className="font-sans text-lg sm:text-[21px] leading-[34px] text-[#F0F0F0]">
                  {activeCommand.summary}
                </p>
                <p className="font-sans text-sm sm:text-[16px] leading-[26px] text-[#F0F0F0]/80 max-w-3xl">
                  {activeCommand.description}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#F0F0F0]/30" />

              {/* Syntax Block */}
              <div className="ce-detail-anim flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#F0F0F0]/60">
                  SYNTAX
                </span>
                <code className="font-mono text-sm sm:text-[14px] leading-[22px] text-[#F0F0F0]">
                  {activeCommand.syntax}
                </code>
              </div>

              {/* Example Block */}
              <div className="ce-detail-anim flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#F0F0F0]/60">
                  EXAMPLE
                </span>
                <code className="font-mono text-sm sm:text-[14px] leading-[22px] text-[#F0F0F0]">
                  {activeCommand.exampleCmd}
                </code>
                <code className="font-mono text-xs sm:text-[12px] leading-[19px] text-[#F0F0F0]/65">
                  {activeCommand.exampleOutput}
                </code>
              </div>

              {/* Go A Little Further Block */}
              <div className="ce-detail-anim flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#F0F0F0]/60">
                  GO A LITTLE FURTHER
                </span>
                <p className="font-sans text-sm sm:text-[14px] leading-[22px] text-[#F0F0F0]/85">
                  {activeCommand.further}
                </p>
              </div>

              {/* Challenge Solution Steps (when present) */}
              {activeCommand.steps && activeCommand.steps.length > 0 && (
                <div className="ce-detail-anim flex flex-col gap-2.5 p-4 border border-[#FFC500]/40 bg-[#FFC500]/5">
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#FFC500] font-bold">
                    CHALLENGE SOLUTION STEPS (/BBLUG)
                  </span>
                  <div className="flex flex-col gap-1.5 font-mono text-xs sm:text-[13px] leading-[20px] text-[#F0F0F0]/90">
                    {activeCommand.steps.map((step, idx) => (
                      <p key={idx}>{step}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Try In Playground Action */}
              <button
                type="button"
                onClick={handleTryInPlayground}
                className="ce-detail-anim w-full h-14 px-6 border border-[#F0F0F0] flex items-center justify-between text-[#FFC500] hover:bg-[#FFC500] hover:text-[#000000] hover:border-[#FFC500] transition-colors duration-150 cursor-pointer group"
              >
                <span className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase">
                  TRY IN PLAYGROUND
                </span>
                <span className="text-xl leading-none transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
