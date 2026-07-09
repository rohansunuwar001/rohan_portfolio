'use client';

import { useEffect } from 'react';

export default function SecurityDeterrent() {
  useEffect(() => {
    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Common Inspect Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || // F12 Developer Tools
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || // Ctrl + Shift + I (Inspect Element)
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || // Ctrl + Shift + J (Console)
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) || // Ctrl + U (View Page Source)
        (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) // Ctrl + Shift + C (Element Inspector)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
