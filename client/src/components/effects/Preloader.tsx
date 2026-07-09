'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Lock scrolling on html/body while loading
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('is-loading');
      document.body.style.overflow = 'hidden';
    }

    const loaderData = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide/Slide out loader on completion
        gsap.timeline()
          .to('.loader-fill-bar', {
            clipPath: 'inset(0 0 0 0)',
            duration: 0.2
          })
          .to('.loader-content', {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power3.inOut'
          })
          .to('.loader-overlay', {
            yPercent: -100,
            duration: 0.7,
            ease: 'power4.inOut',
            onStart: () => {
              // Dispatch event to start Hero animations right as the slide-out begins!
              window.dispatchEvent(new Event('preloaderComplete'));
            },
            onComplete: () => {
              // Remove locks and loader classes
              document.documentElement.classList.remove('is-loading');
              document.body.style.overflow = '';
              const loaderEl = document.getElementById('preloader-root');
              if (loaderEl) loaderEl.style.display = 'none';
            }
          });
      }
    });

    // 1. Ticks up percentage counter and progress bar width in 1.4 seconds
    tl.to(loaderData, {
      value: 100,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(Math.floor(loaderData.value));
      }
    });

    return () => {
      // Cleanup locks just in case
      document.documentElement.classList.remove('is-loading');
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div id="preloader-root" className="loader-overlay fixed inset-0 z-[9999] flex flex-col justify-between bg-[#050507] text-[#e2e8f0] p-8 md:p-16 select-none font-mono">
      {/* Top Status */}
      <div className="loader-content flex justify-between items-center w-full">
        <div className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          CONNECTING CORE SESSION
        </div>
        <div className="text-[10px] md:text-xs text-zinc-500">
          SECURE_PORTAL_v1.6
        </div>
      </div>

      {/* Middle Logo Draw */}
      <div className="loader-content flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 to-rose-400 uppercase select-none">
          ROHAN®
        </h1>
        <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-2">
          WEB DEVELOPER // CREATIVE CODER // UI/UX DESIGNER
        </p>
        <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1">
          SPECIALIZED IN CRAFTING PREMIUM INTERACTIVE WEBSITE SYSTEMS, WEBGL SHADER STRUCTURES, AND FLUID SCROLL GRID ANIMATIONS.   
        </p>
      </div>

      {/* Bottom Loading Progress */}
      <div className="loader-content grid grid-cols-12 items-center gap-4 md:gap-8 w-full">
        {/* Percentage Counter */}
        <div className="col-span-3 text-2xl md:text-4xl font-light tracking-tight font-sans text-sky-400">
          {String(percent).padStart(3, '0')}%
        </div>

        {/* Fill Bar */}
        <div className="col-span-9 relative h-[1px] bg-zinc-800 w-full overflow-hidden">
          <div 
            className="loader-fill-bar absolute inset-y-0 left-0 bg-sky-400 transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
