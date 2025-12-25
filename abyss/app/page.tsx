"use client"

import React, { useEffect } from 'react'
import Hero from '@/components/landing/hero'
import FeaturesSection from '@/components/landing/feature'
import Footer from '@/components/landing/footer'
import StaggeredMenu from '@/components/StaggeredMenu';

const Landing = () => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/hero' },
    { label: 'Feature', ariaLabel: 'View our services', link: '/feature' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/footer' }
  ];

  const socialItems = [
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/anjali-jayakumar-145902320/' },
    { label: 'GitHub', link: 'https://github.com/cloudQuest7' },
    { label: 'Email', link: 'mailto:anjalijayakumar79@gmail.com' }
  ];

  // Prevent flash by not rendering menu until mounted
  if (!mounted) {
    return (
      <div style={{ height: '100vh', background: '#1a1a1a' }}>
        <Hero />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: '#1a1a1a' }}>
<div className="fixed top-7 left-16 z-50">
      <span className="font-auralyess text-2xl text-white px-4 py-2 select-none">
        Abyss
      </span>
    </div>

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
      <FeaturesSection />
      <Footer />
    </div>
  )
}

export default Landing
