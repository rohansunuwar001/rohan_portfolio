'use client';

import React, { useRef } from 'react';
import { FileText } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface AboutProps {
  bio: string;
  cvUrl: string | null;
  aboutTitle?: string;
  aboutFocus?: string;
  aboutLocation?: string;
  techStack?: string;
  aboutImageUrl?: string | null;
}

export default function About({ 
  bio, 
  cvUrl,
  aboutTitle,
  aboutFocus,
  aboutLocation,
  techStack,
  aboutImageUrl
}: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    // Get all animate-up elements scoped inside this container
    const items = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll('.about-animate-up')
    );

    // 1. Reveal headers and sections on scroll
    gsap.fromTo(
      items,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // 2. Parallax effect on the abstract side image
    gsap.to('.about-parallax-img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // 3. Scroll scrub: Scale down & fade out title on scroll down past viewport top
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
  }, { scope: containerRef });

  // Parse tech stack key-value pairs
  const techItems = (techStack || '')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(':');
      return {
        name: parts[0]?.trim() || '',
        level: parts[1]?.trim() || 'OPTIMAL',
      };
    });

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 py-32 bg-[#050507]/80 backdrop-blur-[8px] border-y border-zinc-900 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Biography & Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="about-animate-up text-[10px] md:text-xs text-sky-400 font-mono uppercase tracking-widest flex items-center gap-2">
            <span>01 — MEET THE SYSTEM</span>
          </div>

          <div className="about-animate-up">
            <h2 ref={titleRef} className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight uppercase font-sans max-w-2xl hero-subtitle-wind origin-left">
              {aboutTitle || "A software engineer building premium visual systems for the web."}
            </h2>
          </div>

          <p className="about-animate-up text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl font-mono">
            {bio}
          </p>

          {/* Details list */}
          <div className="about-animate-up grid grid-cols-2 gap-8 pt-6 max-w-md">
            <div>
              <h4 className="text-zinc-600 text-[10px] uppercase tracking-wider font-mono">Core Focus</h4>
              <p className="text-zinc-300 text-xs mt-1 font-mono">{aboutFocus || "Frontend Architectures & Interactive WebGL"}</p>
            </div>
            <div>
              <h4 className="text-zinc-600 text-[10px] uppercase tracking-wider font-mono">Location</h4>
              <p className="text-zinc-300 text-xs mt-1 font-mono">{aboutLocation || "Kathmandu, Nepal"}</p>
            </div>
          </div>

          {/* Action button */}
          <div className="about-animate-up pt-6">
            {cvUrl && (
              <a
                href={cvUrl.startsWith('http') ? cvUrl : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${cvUrl}`}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-950/40 hover:border-emerald-500 hover:text-zinc-950 hover:bg-emerald-400 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                <FileText size={14} /> Download CV / System Resume
              </a>
            )}
          </div>
        </div>
        
        {/* Right Column: Parallax Image Card & Skills */}
        <div className="lg:col-span-5 space-y-12">
          {/* Parallax Image container */}
          <div className="about-animate-up relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 group cursor-pointer">
            <div 
              className="about-parallax-img absolute inset-0 -top-[15%] h-[130%] w-full bg-cover bg-center grayscale contrast-125 brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105"
              style={{ 
                backgroundImage: `url('${
                  aboutImageUrl 
                    ? (aboutImageUrl.startsWith('http') ? aboutImageUrl : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${aboutImageUrl}`)
                    : 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
                }')` 
              }}
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 to-transparent group-hover:opacity-20 transition-opacity duration-500" />
          </div>

          {/* Tech Stack specs card */}
          <div className="about-animate-up border border-zinc-900 bg-zinc-950/30 backdrop-blur-sm p-8 rounded-xl font-mono space-y-4">
            <span className="text-zinc-600 text-[10px] block border-b border-zinc-900 pb-2 uppercase tracking-wider">SYSTEM_STACK_CONFIG</span>
            <ul className="space-y-3 text-[11px] text-zinc-400">
              {techItems.map((item, idx) => {
                const stepNum = String(idx + 1).padStart(2, '0');
                return (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="text-zinc-600">{stepNum}.</span> 
                    <span>{item.name}</span> 
                    <span className="text-sky-400 font-bold">{item.level}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
