'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';

const TiltCard = dynamic(() => import('../effects/TiltCard'), { ssr: false });

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
  return (
    <section id="projects" className="relative min-h-screen px-6 md:px-16 lg:px-32 py-24">
      <div className="space-y-4 mb-16">
        <span className="text-xs text-rose-500 font-mono uppercase tracking-widest">02 / EXPERIMENTS</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Project Repositories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, i) => (
          <TiltCard key={proj.id} maxTilt={10}>
            <article className="h-full border border-zinc-800 bg-zinc-950/60 p-6 rounded-2xl flex flex-col justify-between hover:border-rose-500/50 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">INDEX 0{i + 1}</span>
                  <LayoutGrid size={16} className="text-zinc-600" />
                </div>
                {proj.imageUrl ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-900 mb-4 bg-zinc-900">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${proj.imageUrl}`}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg border border-zinc-900/60 bg-zinc-900/10 mb-4 flex items-center justify-center font-mono text-[10px] text-zinc-700">
                    NO_VISUAL_FILE.PNG
                  </div>
                )}
                <h3 className="text-base font-extrabold tracking-tight text-white mb-2 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {proj.tags.split(',').map((tag) => (
                    <span key={tag} className="text-[9px] bg-zinc-900 border border-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 border-t border-zinc-900 pt-4 text-xs font-bold uppercase tracking-wider">
                  {proj.demoLink && proj.demoLink !== '#' && (
                    <a
                      href={proj.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      Demo <ArrowUpRight size={12} />
                    </a>
                  )}
                  {proj.githubLink && proj.githubLink !== '#' && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      Source <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
