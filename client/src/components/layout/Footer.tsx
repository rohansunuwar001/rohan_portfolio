'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TextScramble = dynamic(() => import('../effects/TextScramble'), { ssr: false });

interface FooterProps {
  profileName: string;
}

export default function Footer({ profileName }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!footerRef.current) return;

      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative z-10 border-t border-zinc-900 mt-12 sm:mt-24 pt-6 text-[10px] text-zinc-700 flex flex-col sm:flex-row items-center justify-between px-6 md:px-16 lg:px-32 pb-12 font-mono"
    >
      <div>
        © {new Date().getFullYear()} <TextScramble text={profileName.toUpperCase()} triggerOnScroll={false} />. ALL SYSTEMS ACTIVE.
      </div>
      <div className="mt-2 sm:mt-0 uppercase tracking-widest hover:text-sky-400 transition-colors">
        <TextScramble text="Built with Next.js, Three.js & GSAP" triggerOnScroll={false} />
      </div>
    </footer>
  );
}
