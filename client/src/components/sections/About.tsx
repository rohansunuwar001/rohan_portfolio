'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface AboutProps {
  bio: string;
  cvUrl: string | null;
}

export default function About({ bio, cvUrl }: AboutProps) {
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 py-24 bg-zinc-950/30 border-y border-zinc-900/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs text-sky-400 font-mono uppercase tracking-widest">01 / OVERVIEW</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Merging code aesthetics with visual interaction.
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            {bio}
          </p>
          <div className="pt-6 flex flex-wrap gap-4">
            {cvUrl && (
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${cvUrl}`}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                <FileText size={14} /> Download CV / Resume
              </a>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="border border-zinc-800 bg-zinc-900/20 p-8 rounded-xl max-w-sm font-mono space-y-4">
            <span className="text-zinc-600 text-xs block border-b border-zinc-800 pb-2">CORE CORE_ENGINES</span>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center justify-between"><span className="text-zinc-600">01.</span> <span>Next.js / React 19</span> <span className="text-emerald-500">100%</span></li>
              <li className="flex items-center justify-between"><span className="text-zinc-600">02.</span> <span>Three.js / WebGL</span> <span className="text-emerald-500">95%</span></li>
              <li className="flex items-center justify-between"><span className="text-zinc-600">03.</span> <span>GSAP / Motion Engine</span> <span className="text-emerald-500">90%</span></li>
              <li className="flex items-center justify-between"><span className="text-zinc-600">04.</span> <span>GLSL Shaders</span> <span className="text-emerald-500">80%</span></li>
              <li className="flex items-center justify-between"><span className="text-zinc-600">05.</span> <span>Tailwind CSS v4</span> <span className="text-emerald-500">100%</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
