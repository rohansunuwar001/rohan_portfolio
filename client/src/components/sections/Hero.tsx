'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeroProps {
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  scrollProgress: number;
}

export default function Hero({ title, heroTitle, heroSubtitle, heroDesc, scrollProgress }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial timeline for entry reveals (only runs once preloader is done)
    const startAnimations = () => {
      const tl = gsap.timeline();

      // 1. Reveal headers (fade/translate)
      tl.fromTo(
        '.hero-fade-in',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );

      // 2. Stagger slide up the giant headers
      tl.fromTo(
        '.hero-title-line',
        { yPercent: 100 },
        { yPercent: 0, duration: 1.0, stagger: 0.1, ease: 'power4.out' },
        '-=0.6'
      );

      // 3. Reveal subtitle
      tl.fromTo(
        '.hero-sub-reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      );

      // 4. Reveal description (comes after subtitle)
      tl.fromTo(
        '.hero-desc-reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );

      // 5. Reveal action button (comes after description)
      tl.fromTo(
        '.hero-btn-reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );

      // 6. Stagger typewriter characters in custom float text block
      tl.fromTo(
        '.code-line',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.15 },
        '-=0.2'
      );
    };

    // Listen for preloader completion
    window.addEventListener('preloaderComplete', startAnimations);

    // Scroll animation: Scale down/move the giant header text as we scroll
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        scale: 0.85,
        yPercent: 15,
        opacity: 0.3,
        ease: 'none',
      });
    }

    return () => {
      window.removeEventListener('preloaderComplete', startAnimations);
    };
  }, { scope: containerRef });

  const heroLines = (heroTitle || 'CREATIVE\nDEVELOPER').split('\n').filter(Boolean);

  return (
    <section 
      ref={containerRef}
      className="relative flex h-screen w-full flex-col justify-center px-6 md:px-16 lg:px-32 overflow-hidden bg-[#050507]/30 backdrop-blur-[2px]"
    >
      <div className="relative z-10 max-w-5xl space-y-6">
        {/* Status Line */}
        <div className="hero-fade-in text-zinc-500 text-[10px] md:text-xs tracking-widest uppercase font-mono flex items-center select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mr-2.5 animate-pulse" />
          SYSTEM LOAD // ACTIVE_GRID_SESSION
        </div>

        {/* Giant header text (scales down on scroll) */}
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9] pb-4 select-none uppercase font-sans origin-left"
        >
          {heroLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span className="hero-title-line inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                {line}
              </span>
            </div>
          ))}
        </h1>

        {/* Subtitle & Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 max-w-4xl">
          <div className="md:col-span-4 overflow-hidden">
            <span className="hero-sub-reveal inline-block hero-subtitle-wind font-bold text-sm md:text-base uppercase tracking-wider">
              {heroSubtitle}
            </span>
          </div>
          
          <div className="md:col-span-8 overflow-hidden">
            <p className="hero-desc-reveal hero-subtitle-wind text-xs md:text-sm font-mono leading-relaxed">
              {title} // {heroDesc}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="hero-btn-reveal pt-8">
          <a
            href="#about"
            className="inline-flex items-center gap-3 border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm hover:border-sky-500 hover:text-zinc-950 hover:bg-sky-400 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl"
          >
            ENTER SYSTEM OVERVIEW <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Floating transparent code block */}
      <div className="code-float absolute right-8 md:right-16 lg:right-28 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
        <div className="relative font-mono text-base md:text-lg lg:text-xl leading-loose">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.03] to-transparent pointer-events-none" />
          
          <div className="code-line overflow-hidden py-1">
            <span className="text-pink-500">while</span> <span className="text-zinc-400">(</span><span className="text-emerald-400 font-semibold">alive</span><span className="text-zinc-400">)</span>
          </div>
          
          <div className="code-line overflow-hidden py-1">
            <span className="text-zinc-400">{`{`}</span>
          </div>
          
          <div className="code-line overflow-hidden py-1 pl-8">
            <span className="text-sky-400">eat</span><span className="text-zinc-400">();</span>
          </div>
          
          <div className="code-line overflow-hidden py-1 pl-8">
            <span className="text-sky-400">sleep</span><span className="text-zinc-400">();</span>
          </div>
          
          <div className="code-line overflow-hidden py-1 pl-8">
            <span className="text-purple-400">code</span><span className="text-zinc-400">();</span>
          </div>
          
          <div className="code-line overflow-hidden py-1 pl-8">
            <span className="text-purple-400">repeat</span><span className="text-zinc-400">();</span>
          </div>
          
          <div className="code-line overflow-hidden py-1">
            <span className="text-zinc-400">{`}`}</span><span className="text-sky-400 font-extrabold animate-pulse">|</span>
          </div>
        </div>
      </div>
    </section>
  );
}
