import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-light text-white mb-8 tracking-tight leading-[0.9]">
          your safe space,<br />always
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-12 font-light max-w-md">
          AI-powered emotional support that actually gets you
        </p>
        <button className="text-white text-base font-light border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300">
          start feeling better
        </button>
      </div>
    </section>
  );
};

export default Hero;
