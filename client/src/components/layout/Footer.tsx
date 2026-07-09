'use client';

import React from 'react';
import { Mail } from 'lucide-react';

interface FooterProps {
  profileName: string;
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

export default function Footer({ profileName, email, github, linkedin }: FooterProps) {
  return (
    <section id="contact" className="relative min-h-[60vh] flex flex-col justify-center px-6 md:px-16 lg:px-32 py-24 bg-zinc-950/20 border-t border-zinc-900/30 font-mono">
      <div className="max-w-2xl space-y-8">
        <span className="text-xs text-emerald-400 uppercase tracking-widest block">03 / HANDSHAKE</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Connect to terminal.
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
          Feel free to reach out if you have a creative project, job opportunity, or just want to chat about WebGL, Three.js, and interactive design.
        </p>
        <div className="space-y-4 pt-4 text-sm">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors"
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
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs"
              >
                <GithubIcon /> GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs"
              >
                <LinkedinIcon /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer copyright */}
      <footer className="border-t border-zinc-900 mt-24 pt-6 text-[10px] text-zinc-700 flex flex-col sm:flex-row items-center justify-between">
        <div>© {new Date().getFullYear()} {profileName.toUpperCase()}. ALL SYSTEMS ACTIVE.</div>
        <div className="mt-2 sm:mt-0 uppercase tracking-widest">Built with Next.js, Three.js & GSAP</div>
      </footer>
    </section>
  );
}
