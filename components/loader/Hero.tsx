import React from 'react';
import { FadeIn } from './FadeIn';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {

  return (
    <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-all duration-1000 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Details/background.mp4" type="video/mp4" />
        </video>

        {/* Overlay - matching loader pastel gradient */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(135deg, #D1E6F0 0%, #FED9D5 100%)',
            opacity: 0.7
          }}
        />
        
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(163, 141, 120, 0.03) 2px, rgba(163, 141, 120, 0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(163, 141, 120, 0.03) 2px, rgba(163, 141, 120, 0.03) 4px),
              radial-gradient(circle at 20% 30%, rgba(203, 185, 163, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(163, 141, 120, 0.08) 0%, transparent 50%),
              linear-gradient(135deg, rgba(244, 241, 234, 0.5) 0%, rgba(245, 245, 245, 0.3) 50%, rgba(250, 249, 245, 0.5) 100%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%'
          }}
        />
        
        {/* Subtle paper grain texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full max-w-md mx-auto min-h-screen">
        {/* Monogram */}
        <FadeIn show={visible} delay={300} className="mb-12 sm:mb-16">
          <div 
            className="text-center text-5xl sm:text-7xl md:text-8xl"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 700,
              lineHeight: '1.2',
              color: '#4a5d4e',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            R | I
          </div>
        </FadeIn>

        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <FadeIn show={visible} delay={600}>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider"
              style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                color: '#4a5d4e',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              You're Invited
            </h1>
          </FadeIn>

          <FadeIn show={visible} delay={900}>
            <button 
              onClick={() => {
                onOpen();
              }}
              className="group relative px-10 py-4 bg-transparent border-2 border-[#4a5d4e] text-[#4a5d4e] font-serif text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#4a5d4e] hover:text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 rounded-sm overflow-hidden"
            >
              <span
                className="relative z-10 drop-shadow-md"
                style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}
              >
                Open Invitation
              </span>
              {/* Button sheen effect */}
              <div className="absolute top-0 left-[-100%] w-full h-full bg-white/20 skew-x-12 group-hover:animate-[shimmer_1s_infinite]" />
            </button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};