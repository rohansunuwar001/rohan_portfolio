'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TextScramble from '../effects/TextScramble';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Consent categories
  const [consents, setConsents] = useState({
    functionality: true, // required
    analytics: true,
    advertising: true,
    advertisingUserData: true,
    advertisingPersonalisation: true,
    personalisation: true,
    security: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('portfolio_cookie_consent');
    if (!consentChoice) {
      // Show banner after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Slide-in animation using GSAP when visible is set to true
  useGSAP(() => {
    if (isVisible && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.75)',
        }
      );
    }
  }, { scope: containerRef, dependencies: [isVisible] });

  const handleAcceptAll = () => {
    const allAccepted = {
      functionality: true,
      analytics: true,
      advertising: true,
      advertisingUserData: true,
      advertisingPersonalisation: true,
      personalisation: true,
      security: true,
    };
    animateClose(() => saveConsent(allAccepted));
  };

  const handleRejectAll = () => {
    const allRejected = {
      functionality: true, // required stays true
      analytics: false,
      advertising: false,
      advertisingUserData: false,
      advertisingPersonalisation: false,
      personalisation: false,
      security: false,
    };
    animateClose(() => saveConsent(allRejected));
  };

  const handleSavePreferences = () => {
    animateClose(() => saveConsent(consents));
  };

  const animateClose = (callback: () => void) => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          setIsVisible(false);
          callback();
        },
      });
    } else {
      setIsVisible(false);
      callback();
    }
  };

  const saveConsent = (consentData: typeof consents) => {
    localStorage.setItem('portfolio_cookie_consent', JSON.stringify(consentData));
    document.cookie = `portfolio_cookie_consent=given; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax; Secure`;
  };

  const handleToggle = (key: keyof typeof consents) => {
    if (key === 'functionality') return; // cannot toggle required
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[9999] w-full max-w-[440px] px-4 sm:px-0 font-mono select-none"
    >
      <div className="w-full border border-zinc-800 bg-zinc-950/90 backdrop-blur-md p-6 rounded-lg shadow-2xl text-zinc-300 transition-all duration-300">
        
        {/* Top Header & Glowing Dot */}
        <div className="flex items-between justify-between mb-4 border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
            <span className="h-2 w-2 rounded-full bg-sky-400 -ml-4" />
            <h3 className="text-xs uppercase tracking-widest font-bold bg-linear-to-r from-sky-400 to-rose-500 bg-clip-text text-transparent">
              <TextScramble text="WE USE COOKIES" triggerOnScroll={false} />
            </h3>
          </div>
          <button 
            onClick={handleRejectAll}
            className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Informational Text */}
        <div className="text-zinc-400 text-xs leading-relaxed mb-4">
          <p>
            By using our website, you agree to the storing of cookies on your device for essential site functionality. You can choose to opt into other categories of cookies below.
          </p>
        </div>

        {/* Toggle Details Link */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-xs font-bold mb-4 focus:outline-none transition-colors group"
        >
          {showDetails ? (
            <>
              Hide details 
              <ChevronUp size={14} className="transform group-hover:-translate-y-0.5 transition-transform" />
            </>
          ) : (
            <>
              Show details 
              <ChevronDown size={14} className="transform group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>

        {/* Custom scrollable checklist */}
        {showDetails && (
          <div 
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="space-y-4 max-h-[220px] overflow-y-auto pr-2 mb-6 border-t border-zinc-900 pt-4 custom-scrollbar text-[11px]"
          >
            
            {/* Functionality */}
            <div 
              className="flex items-start gap-3 p-2 rounded bg-zinc-950 border border-zinc-900 opacity-80 cursor-not-allowed"
            >
              <input
                type="checkbox"
                checked={consents.functionality}
                disabled
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-not-allowed"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Functionality (required)" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Enables storage that supports the functionality of the website or app such as language settings.
                </span>
              </div>
            </div>

            {/* Analytics */}
            <label 
              onClick={() => handleToggle('analytics')}
              className={`flex items-start gap-3 p-2 rounded border transition-all cursor-pointer ${
                consents.analytics 
                  ? 'bg-sky-950/15 border-sky-500/20 text-zinc-200' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400'
              }`}
            >
              <input
                type="checkbox"
                checked={consents.analytics}
                readOnly
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-pointer"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Analytics storage" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Enables storage, such as cookies, related to analytics (for example, visit duration).
                </span>
              </div>
            </label>

            {/* Advertising */}
            <label 
              onClick={() => handleToggle('advertising')}
              className={`flex items-start gap-3 p-2 rounded border transition-all cursor-pointer ${
                consents.advertising 
                  ? 'bg-sky-950/15 border-sky-500/20 text-zinc-200' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400'
              }`}
            >
              <input
                type="checkbox"
                checked={consents.advertising}
                readOnly
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-pointer"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Advertising storage" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Enables storage, such as cookies, related to advertising.
                </span>
              </div>
            </label>

            {/* Advertising user data */}
            <label 
              onClick={() => handleToggle('advertisingUserData')}
              className={`flex items-start gap-3 p-2 rounded border transition-all cursor-pointer ${
                consents.advertisingUserData 
                  ? 'bg-sky-950/15 border-sky-500/20 text-zinc-200' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400'
              }`}
            >
              <input
                type="checkbox"
                checked={consents.advertisingUserData}
                readOnly
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-pointer"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Advertising user data" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Sets consent for sending user data to Google for online advertising purposes.
                </span>
              </div>
            </label>

            {/* Advertising personalisation */}
            <label 
              onClick={() => handleToggle('advertisingPersonalisation')}
              className={`flex items-start gap-3 p-2 rounded border transition-all cursor-pointer ${
                consents.advertisingPersonalisation 
                  ? 'bg-sky-950/15 border-sky-500/20 text-zinc-200' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400'
              }`}
            >
              <input
                type="checkbox"
                checked={consents.advertisingPersonalisation}
                readOnly
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-pointer"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Advertising personalisation" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Sets consent for personalized advertising.
                </span>
              </div>
            </label>

            {/* Personalisation */}
            <label 
              onClick={() => handleToggle('personalisation')}
              className={`flex items-start gap-3 p-2 rounded border transition-all cursor-pointer ${
                consents.personalisation 
                  ? 'bg-sky-950/15 border-sky-500/20 text-zinc-200' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400'
              }`}
            >
              <input
                type="checkbox"
                checked={consents.personalisation}
                readOnly
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-pointer"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Personalisation storage" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Enables storage related to personalization such as video recommendations.
                </span>
              </div>
            </label>

            {/* Security */}
            <label 
              onClick={() => handleToggle('security')}
              className={`flex items-start gap-3 p-2 rounded border transition-all cursor-pointer ${
                consents.security 
                  ? 'bg-sky-950/15 border-sky-500/20 text-zinc-200' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400'
              }`}
            >
              <input
                type="checkbox"
                checked={consents.security}
                readOnly
                className="mt-0.5 h-3.5 w-3.5 accent-sky-400 cursor-pointer"
              />
              <div className="leading-snug">
                <span className="font-bold text-white block">
                  <TextScramble text="Security storage" triggerOnScroll={false} />
                </span>
                <span className="text-zinc-500 block mt-1">
                  Enables storage related to security such as authentication functionality, fraud prevention, and other user protection.
                </span>
              </div>
            </label>

            {/* Privacy Policy Link */}
            <div className="pt-2 text-xs">
              <a 
                href="/privacy-policy" 
                target="_blank" 
                className="text-sky-400 hover:text-sky-300 underline font-bold transition-colors"
              >
                View our privacy policy
              </a>
            </div>
          </div>
        )}

        {/* Creative styled Terminal Buttons */}
        <div className="flex items-center justify-end gap-3 font-semibold mt-4 text-[10px]">
          {showDetails && (
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white rounded transition-all active:scale-95"
            >
              [ SAVE ]
            </button>
          )}
          <button
            onClick={handleRejectAll}
            className="px-4 py-2 border border-zinc-800 text-zinc-500 hover:border-red-900/50 hover:text-red-400 rounded transition-all active:scale-95"
          >
            [ REJECT ALL ]
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-linear-to-r from-sky-500 to-rose-500 text-zinc-950 font-bold rounded transition-all active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.15)] hover:shadow-[0_0_20px_rgba(244,63,94,0.25)] border-0"
          >
            [ ACCEPT ALL ]
          </button>
        </div>

      </div>
    </div>
  );
}
