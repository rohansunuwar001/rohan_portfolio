'use client';

import React, { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnScroll?: boolean;
}

const GLYPHS = '!@#$%^&*()_+{}:"<>?-=[];\',./~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function TextScramble({ text, className = '', triggerOnScroll = true }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 3; // Scramble speed factor
    }, 25);
  };

  useEffect(() => {
    if (!triggerOnScroll) {
      startScramble();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    // Scroll trigger intersection observer
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScramble();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, triggerOnScroll]);

  return (
    <span
      ref={elementRef}
      onMouseEnter={startScramble}
      className={`font-mono transition-colors duration-300 ${className}`}
    >
      {displayText}
      
    </span>
  );
}
