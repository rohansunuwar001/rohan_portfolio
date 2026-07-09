'use client';

import React, { useRef } from 'react';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  demoLink: string | null;
  githubLink: string | null;
  tags: string;
  featured: boolean;
  order: number;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    // Get header and card elements scoped inside this container
    const headerItems = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll('.project-animate-up')
    );
    const cardItems = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll('.project-card-item')
    );

    // Reveal section header elements
    gsap.fromTo(
      headerItems,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Stagger reveal project cards on scroll
    gsap.fromTo(
      cardItems,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Scroll scrub: Scale down & fade out title on scroll down past viewport top
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

  return (
    <section 
      ref={containerRef}
      id="projects" 
      className="relative z-10 min-h-screen px-6 md:px-16 lg:px-32 py-32 bg-[#050507]/30 backdrop-blur-[2px]"
    >
      {/* Section Header */}
      <div className="space-y-4 mb-20">
        <span className="project-animate-up text-xs text-rose-500 font-mono uppercase tracking-widest flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          02 / EXPERIMENTS
        </span>
        <div className="project-animate-up">
          <h2 ref={titleRef} className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-sans hero-subtitle-wind origin-left">
            Project Repositories
          </h2>
        </div>
      </div>

      {/* Grid of Vertical Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, i) => {
          const indexNum = String(i + 1).padStart(2, '0');
          const finalImageUrl = proj.imageUrl 
            ? (proj.imageUrl.startsWith('http') ? proj.imageUrl : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${proj.imageUrl}`)
            : null;

          return (
            <div
              key={proj.id}
              className="project-card-item h-full border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm p-6 rounded-2xl flex flex-col justify-between hover:border-rose-500/50 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Card Top Info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                    INDEX {indexNum}
                  </span>
                  <LayoutGrid size={16} className="text-zinc-600" />
                </div>

                {/* Card Visual Image */}
                {finalImageUrl ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-900 mb-6 bg-zinc-900 select-none">
                    <img
                      src={finalImageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:scale-105 transition-all duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg border border-zinc-900/60 bg-zinc-900/10 mb-6 flex items-center justify-center font-mono text-[10px] text-zinc-700 select-none">
                    NO_VISUAL_FILE.PNG
                  </div>
                )}

                {/* Card Title & Desc */}
                <h3 className="text-lg font-bold tracking-tight text-white mb-3">
                  {proj.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-mono">
                  {proj.description}
                </p>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.tags.split(',').map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[9px] font-mono bg-zinc-900/60 border border-zinc-900 text-zinc-500 px-2 py-0.5 rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                {/* Card Bottom Links */}
                <div className="flex items-center gap-6 border-t border-zinc-900 pt-4 text-xs font-bold uppercase tracking-wider">
                  {proj.demoLink && proj.demoLink !== '#' && (
                    <a
                      href={proj.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-500 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      DEMO <ArrowUpRight size={13} />
                    </a>
                  )}
                  {proj.githubLink && proj.githubLink !== '#' && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      SOURCE <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
