import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation - 8 seconds total
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 80); // 80ms * 100 = 8000ms (8 seconds)

    // Simulate loading time - at least 8 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 1000); // Wait for fade out animation
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const year = new Date().getFullYear();

  return (
    <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
      {/* Paper texture base - matching Hero.tsx */}
      <div className="absolute inset-0 z-0">
        {/* Base paper color - pastel gradient */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(135deg, #D1E6F0 0%, #FED9D5 100%)'
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
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-12 w-full max-w-md mx-auto min-h-screen">
        {/* Birds Image */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <Image
              src="/Details/birds.png"
              alt="Decorative birds"
              fill
              className="object-contain drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
              }}
              priority
            />
          </div>
        </div>

        {/* Monogram - matching Hero.tsx style */}
        <div className="mb-8 sm:mb-10 animate-fade-in-delay">
          <div 
            className="text-center text-5xl sm:text-7xl md:text-8xl transition-all duration-1000"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 700,
              lineHeight: '1.2',
              color: 'rgb(74, 93, 78)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            R | I
          </div>
        </div>

        {/* Children's Names */}
        <div className="mb-12 sm:mb-16 animate-fade-in-delay text-center">
          <div 
            className="text-base sm:text-lg md:text-xl leading-relaxed"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              color: 'rgb(74, 93, 78)',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
            }}
          >
            Ransch Cristov & Iszabella Rans
          </div>
        </div>

        {/* Copywriting paragraph */}
        <div className="text-center mb-8 sm:mb-10 max-w-xs sm:max-w-md px-4 animate-fade-in-delay-2">
          <p
            className="text-sm sm:text-base leading-relaxed text-[#4a5d4e]/90 italic"
            style={{ 
              fontFamily: '"Cormorant Garamond", serif', 
              fontWeight: 400,
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
            }}
          >
            A little blessing,
            a precious beginning,
            and a joyful first year of life.

            Please join us as we celebrate the Baptism of
            Ransch Cristov Penales and Iszabella Rans Penales,
            and the 1st Birthday of our dear Ransch Cristov Penales.

            Let us come together in faith, love, and celebration
            on this very special day.
          </p>
        </div>

        {/* Loading text */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-delay-3">
          <p
            className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#4a5d4e] mb-6 font-medium"
            style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}
          >
            Loading Invitation
          </p>

          {/* Enhanced progress bar */}
          <div className="relative w-48 sm:w-64 h-1 mx-auto bg-white/40 rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4a5d4e] to-[#6b8e6f] transition-all duration-300 ease-out rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-[10px] text-[#4a5d4e]/60 mt-3 font-light">
            {progress}%
          </p>
        </div>

        {/* Copyright - matching footer style */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 text-center px-4">
          <p
            className="text-[10px] sm:text-xs text-[#4a5d4e]/70 leading-relaxed"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            © {year} Clarisse & Kenneth — crafted with love, prayers, and gratitude.
          </p>
        </div>
      </div>
    </div>
  );
};