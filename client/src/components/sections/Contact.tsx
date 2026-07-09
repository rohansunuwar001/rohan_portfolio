'use client';

import React, { useRef } from 'react';
import { Mail } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ContactProps {
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" rx="1" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact({ email, github, linkedin }: ContactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    // Get all animate-up elements scoped inside this container
    const items = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll('.contact-animate-up')
    );

    // Find the wrapper element to trigger the main content animation
    const contentElement = containerRef.current.querySelector('.contact-content-wrapper');

    // Animate from hidden → visible on scroll into view
    // Use fromTo so GSAP explicitly controls the start state (no gsap.set needed)
    // toggleActions: play forward on enter, reverse back on leave-back
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentElement || containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Animate footer copyright independently when it enters viewport (so it doesn't wait for stagger on mobile)
    const footerElement = containerRef.current.querySelector('footer');
    if (footerElement) {
      gsap.fromTo(
        footerElement,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerElement,
            start: 'top bottom',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
    // Scroll scrub: scale down & fade out heading as page scrolls past it
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
  }, { scope: containerRef, dependencies: [email, github, linkedin] });

  return (
    <section 
      ref={containerRef}
      id="contact" 
      className="relative z-10 min-h-[60vh] flex flex-col justify-center px-6 md:px-16 lg:px-32 py-24 bg-[#050507]/30 backdrop-blur-[2px] border-t border-zinc-900/10 font-mono"
    >
      <div className="contact-content-wrapper max-w-2xl space-y-8">
        <span className="contact-animate-up text-xs text-emerald-400 uppercase tracking-widest block">03 / HANDSHAKE</span>
        <div className="contact-animate-up">
          <h2 ref={titleRef} className="text-3xl md:text-5xl font-bold tracking-tight leading-tight hero-subtitle-wind origin-left">
            Connect to terminal.
          </h2>
        </div>
        <p className="contact-animate-up text-zinc-400 text-xs md:text-sm leading-relaxed">
          Feel free to reach out if you have a creative project, job opportunity, or just want to chat about WebGL, Three.js, and interactive design.
        </p>
        <div className="space-y-4 pt-4 text-sm">
          {email && (
            <a
              href={`mailto:${email}`}
              className="contact-animate-up flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors w-fit"
            >
              <Mail size={16} /> <span>{email}</span>
            </a>
          )}
          <div className="flex items-center gap-6 pt-6">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="contact-animate-up flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs"
              >
                <GithubIcon /> GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-animate-up flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs"
              >
                <LinkedinIcon /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
