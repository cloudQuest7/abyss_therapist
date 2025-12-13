"use client"

import React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import Hero from '@/components/landing/hero'
import StaggeredMenu from '@/components/StaggeredMenu';

const landing = () => {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com', icon: <FaTwitter /> },
  { label: 'GitHub', link: 'https://github.com', icon: <FaGithub /> },
  { label: 'LinkedIn', link: 'https://linkedin.com', icon: <FaLinkedin /> }
];

  return (
    <div style={{ height: '100vh', background: '#1a1a1a' }}>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"           // White for visibility on black
        openMenuButtonColor="#808D7C"    // Olive green when open
        changeMenuColorOnOpen={true}
        colors={['#2A2A2A', '#808D7C']}  // Dark grey to olive green gradient
        logoUrl="/leaf.png"
        accentColor="#808D7C"            // Olive green accent (10%)
        isFixed={true}
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

      <Hero />
    </div>
  )
}

export default landing
