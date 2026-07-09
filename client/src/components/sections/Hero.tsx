'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface HeroProps {
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  scrollProgress: number;
}

/** Splits text into character spans for typewriter stagger */
function SplitChars({ text, cls }: { text: string; cls?: string }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`hero-char inline-block${cls ? ` ${cls}` : ''}`}
          style={{ whiteSpace: 'pre' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  );
}

export default function Hero({ title, heroTitle, heroSubtitle, scrollProgress }: HeroProps) {
  const heroLines = (heroTitle || 'CREATIVE\nDEVELOPER').split('\n').filter(Boolean);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // 1. Status bar — char by char opacity
    tl.fromTo(
      '.hero-char-status',
      { opacity: 0 },
      { opacity: 1, duration: 0.04, stagger: 0.04 }
    );

    // 2. Hero title lines — clip-path wipe left→right (preserves full gradient)
    tl.fromTo(
      '.hero-title-line',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.7, stagger: 0.25, ease: 'power2.inOut' },
      '-=0.1'
    );

    // 3. Subtitle + description fade in together
    tl.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.05'
    );

    tl.fromTo(
      '.hero-desc',
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    );

    // 5. Button
    tl.fromTo(
      '.hero-btn',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.1'
    );

    // 6. Code block line-by-line
    tl.fromTo(
      '.code-line',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.2 },
      '-=0.3'
    );

    // 7. Start float loop
    tl.call(() => {
      gsap.to('.code-float', {
        y: -16,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  return (
    <section className="relative flex h-screen w-full flex-col justify-center px-6 md:px-16 lg:px-32 overflow-hidden">
      <div className="max-w-4xl space-y-4">

        {/* Status bar */}
        <div className="text-zinc-500 text-[10px] md:text-xs tracking-widest uppercase mb-2 font-mono flex items-center select-none">
          <span className="h-2 w-2 inline-block rounded-full bg-sky-500 mr-2 animate-pulse flex-shrink-0" />
          <SplitChars text="INITIALIZING SYSTEM " cls="hero-char-status" />
          <span className="inline-flex text-sky-400 font-bold">
            <span className="dot-blink-1">.</span>
            <span className="dot-blink-2">.</span>
            <span className="dot-blink-3">.</span>
          </span>
          <span className="mx-1" />
          <SplitChars text="OK" cls="hero-char-status text-zinc-600 font-bold" />
        </div>

        {/* Hero title — gradient on full line, clip-path typewriter reveal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl  font-extrabold tracking-tighter leading-none pb-2 select-none">
          {heroLines.map((line, li) => (
            <div key={li} className="block overflow-hidden">
              <div className=" hero-title-animated hero-title-line inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 via-rose-400 via-sky-400 to-white">
                {line}
                {li === heroLines.length - 1 && (
                  <span className="terminal-cursor-blink text-sky-400 [-webkit-text-fill-color:theme(colors.sky.400)]">.</span>
                )}
              </div>
            </div>
          ))}
        </h1>

        {/* Subtitle — whole span with wind color, no char split */}
        <p className="text-sm md:text-base font-mono max-w-lg mt-6 leading-relaxed">
          <span className="hero-subtitle hero-subtitle-wind font-bold opacity-0">
            {heroSubtitle}
          </span>
          <span className="hero-desc opacity-0 text-zinc-400">
            {' '}specialized in crafting high-impact WebGL animation structures, particle environments, and fluid scroll grids.
          </span>
        </p>

        {/* Button */}
        <div className="pt-8 hero-btn opacity-0">
          <a
            href="#about"
            className="inline-flex items-center gap-2 border border-sky-500/30 bg-sky-950/20 hover:bg-sky-500 hover:text-zinc-950 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
          >
            System Overview <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Floating transparent code block */}
      <div className="code-float absolute right-8 md:right-16 lg:right-28 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
        <div className="relative font-mono text-base md:text-lg lg:text-xl leading-loose">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.03] to-transparent pointer-events-none" />

          <div className="code-line opacity-0 flex items-center">
            <span className="text-rose-400 font-bold">while</span>
            <span className="text-zinc-400">&nbsp;(</span>
            <span className="text-emerald-400 font-semibold">alive</span>
            <span className="text-zinc-400">)</span>
          </div>
          <div className="code-line opacity-0">
            <span className="text-zinc-500">{'{'}</span>
          </div>
          <div className="code-line opacity-0 pl-10 flex items-center gap-1">
            <span className="text-sky-400 font-semibold">eat</span>
            <span className="text-zinc-600">()</span>
            <span className="text-zinc-500">;</span>
          </div>
          <div className="code-line opacity-0 pl-10 flex items-center gap-1">
            <span className="text-sky-400 font-semibold">sleep</span>
            <span className="text-zinc-600">()</span>
            <span className="text-zinc-500">;</span>
          </div>
          <div className="code-line opacity-0 pl-10 flex items-center gap-1">
            <span className="text-violet-400 font-semibold">code</span>
            <span className="text-zinc-600">()</span>
            <span className="text-zinc-500">;</span>
          </div>
          <div className="code-line opacity-0 pl-10 flex items-center gap-1">
            <span className="text-violet-400 font-semibold">repeat</span>
            <span className="text-zinc-600">()</span>
            <span className="text-zinc-500">;</span>
          </div>
          <div className="code-line opacity-0 flex items-center">
            <span className="text-zinc-500">{'}'}</span>
            <span className="ml-1 inline-block w-[2px] h-[1.1em] bg-sky-400 terminal-cursor-blink align-middle" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-6 md:left-12 text-[10px] text-zinc-600 space-y-1">
        <div>LOC: {scrollProgress.toFixed(4)} // 40.7128 N, 74.0060 W</div>
        <div>FRAME: {Math.round(scrollProgress * 100)}% SYS_STATE_ACTIVE</div>
      </div>
    </section>
  );
}
