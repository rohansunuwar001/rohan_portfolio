'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamic imports
const SymbolScene = dynamic(() => import('../components/effects/SymbolScene'), { ssr: false });
const MainLayout = dynamic(() => import('../components/layout/MainLayout'), { ssr: false });
const Hero = dynamic(() => import('../components/sections/Hero'), { ssr: false });
const About = dynamic(() => import('../components/sections/About'), { ssr: false });
const Projects = dynamic(() => import('../components/sections/Projects'), { ssr: false });
const Contact = dynamic(() => import('../components/sections/Contact'),{ssr: false}
);

gsap.registerPlugin(ScrollTrigger);

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

interface Profile {
  name: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  aboutTitle: string;
  aboutFocus: string;
  aboutLocation: string;
  techStack: string;
  aboutImageUrl: string | null;
  bio: string;
  cvUrl: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

const DEFAULT_PROFILE: Profile = {
  name: 'ROHAN.',
  title: 'Creative Web Developer',
  heroTitle: 'CREATIVE\nDEVELOPER',
  heroSubtitle: 'Full Stack Web Developer',
  heroDesc: 'SPECIALIZED IN CRAFTING PREMIUM INTERACTIVE WEBSITE SYSTEMS, WEBGL SHADER STRUCTURES, AND FLUID SCROLL GRID ANIMATIONS.',
  aboutTitle: 'A software engineer building premium visual systems for the web.',
  aboutFocus: 'Frontend Architectures & Interactive WebGL',
  aboutLocation: 'Kathmandu, Nepal',
  techStack: 'Next.js / React 19:OPTIMAL\nWebGL / GLSL:ADVANCED\nGSAP / Motion Engine:ADVANCED\nTailwind CSS v4:OPTIMAL',
  aboutImageUrl: null,
  bio: 'I build premium, high-impact digital experiences. Merging WebGL art, geometric math, and responsive front-end design to tell stories and engage audiences.',
  cvUrl: null,
  email: 'hello@rohan.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'THE HYPER GLYPHS EXPERIMENT',
    description: 'A WebGL matrix shader project rendering interactive ASCII letters reacting to real-time audio.',
    imageUrl: null,
    demoLink: '#',
    githubLink: '#',
    tags: 'Three.js, WebGL, GLSL Shaders',
    featured: true,
    order: 1,
  },
  {
    id: 2,
    title: 'KINETIC FLUID SIMULATOR',
    description: 'High-performance interactive fluid physics simulations running natively in the browser.',
    imageUrl: null,
    demoLink: '#',
    githubLink: '#',
    tags: 'React, Canvas API, GSAP',
    featured: true,
    order: 2,
  },
  {
    id: 3,
    title: 'NEO-BRUTALIST COMMERCE',
    description: 'Full-stack headless e-commerce build with speed optimizations and interactive design modules.',
    imageUrl: null,
    demoLink: '#',
    githubLink: '#',
    tags: 'Next.js, Tailwind CSS, Prisma',
    featured: true,
    order: 3,
  },
];

import { useGetProfile } from '../api/userApi';
import { useGetProjects } from '../api/projectApi';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { profile: queryProfile } = useGetProfile();
  const { projects: queryProjects } = useGetProjects();

  useEffect(() => {
    let token = localStorage.getItem('portfolio_token');
    if (!token) {
      const match = document.cookie.match(/(^|;)\s*portfolio_token\s*=\s*([^;]+)/);
      if (match) {
        token = match[2];
        localStorage.setItem('portfolio_token', token);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!token);
  }, []);

  const profile = queryProfile.name ? queryProfile : DEFAULT_PROFILE;
  const projects = queryProjects.length > 0 ? queryProjects : DEFAULT_PROJECTS;

  // Sync scroll progress with Three.js canvas
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => trigger.kill();
  }, []);



  return (
    <div className="relative min-h-screen font-mono text-[#e2e8f0] overflow-hidden select-none">
      {/* 3D WebGL Background Scene */}
      <SymbolScene scrollProgress={scrollProgress} />

      {/* Modular Main Layout wrapping page contents */}
      <MainLayout
        profileName={profile.name}
        isLoggedIn={isLoggedIn}
      >
        <Hero 
          title={profile.title} 
          heroTitle={profile.heroTitle || 'CREATIVE\nDEVELOPER'} 
          heroSubtitle={profile.heroSubtitle || 'Full Stack Web Developer'} 
          heroDesc={profile.heroDesc}
          scrollProgress={scrollProgress} 
        />
        <About 
          bio={profile.bio} 
          cvUrl={profile.cvUrl} 
          aboutTitle={profile.aboutTitle}
          aboutFocus={profile.aboutFocus}
          aboutLocation={profile.aboutLocation}
          techStack={profile.techStack}
          aboutImageUrl={profile.aboutImageUrl}
        />
        <Projects projects={projects} />
        <Contact email={profile.email} github={profile.github} linkedin={profile.linkedin} />

      </MainLayout>
    </div>
  );
}
