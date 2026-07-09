'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  profileName: string;
  isLoggedIn: boolean;
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

export default function MainLayout({
  children,
  profileName,
  isLoggedIn,
  email,
  github,
  linkedin,
}: MainLayoutProps) {
  return (
    <>
      <Navbar profileName={profileName} isLoggedIn={isLoggedIn} />
      {children}
      <Footer profileName={profileName} email={email} github={github} linkedin={linkedin} />
    </>
  );
}
