'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  profileName: string;
  isLoggedIn: boolean;
}

export default function MainLayout({
  children,
  profileName,
  isLoggedIn,
}: MainLayoutProps) {
  return (
    <>
      <Navbar profileName={profileName} isLoggedIn={isLoggedIn} />
      {children}
      <Footer profileName={profileName} />
    </>
  );
}
