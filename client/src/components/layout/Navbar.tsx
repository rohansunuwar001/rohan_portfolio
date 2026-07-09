'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const TextScramble = dynamic(() => import('../effects/TextScramble'), { ssr: false });

interface NavbarProps {
  profileName: string;
  isLoggedIn: boolean;
}

export default function Navbar({ profileName, isLoggedIn }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm border-b border-zinc-950/20 bg-zinc-950/5">
      <a href="#" className="text-sm font-bold tracking-widest text-sky-400">
        <TextScramble text={profileName} triggerOnScroll={false} />
      </a>
      <nav className="flex items-center gap-6 text-xs uppercase tracking-wider">
        <a href="#about" className="hover:text-sky-400 transition-colors">.about</a>
        <a href="#projects" className="hover:text-rose-500 transition-colors">.work</a>
        <a href="#contact" className="hover:text-emerald-400 transition-colors">.contact</a>
        {isLoggedIn && (
          <a
            href="/cms"
            className="border border-zinc-800 bg-zinc-950/50 px-3 py-1.5 rounded hover:border-sky-500 hover:text-sky-400 transition-all"
          >
            .cms
          </a>
        )}
      </nav>
    </header>
  );
}
