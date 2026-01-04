"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "motion/react"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import { siteConfig } from "@/content/site"

const desktopImages = [
  "/desktop-background/couple (1).jpeg",
  "/desktop-background/couple (2).jpeg",
  "/desktop-background/couple (3).jpeg",
  "/desktop-background/couple (4).jpeg",
  "/desktop-background/couple (5).jpeg",

]

const mobileImages = [
  "/mobile-background/celebrant (5).jpg",
  "/mobile-background/celebrant (3).jpg",
  "/mobile-background/celebrant (6).jpg",
  "/mobile-background/celebrant (10).jpg",
]

const SHOW_BUTTERFLIES = false

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Parse wedding date for display
  const weddingDate = siteConfig.wedding.date || siteConfig.ceremony.date
  const [weddingMonth = "January", weddingDayRaw = "28", weddingYear = "2026"] = weddingDate.split(" ")
  const weddingDayNumber = weddingDayRaw.replace(/[^0-9]/g, "") || "28"
  
  // Convert month name to number
  const monthMap: { [key: string]: string } = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12"
  }
  const monthNumber = monthMap[weddingMonth] || "01"
  const dayNumber = weddingDayNumber.padStart(2, "0")

  // Detect screen size and update isMobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    // Check on mount
    checkScreenSize()
    
    // Listen for resize events
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Get the appropriate image array based on screen size
  const backgroundImages = useMemo(() => {
    return isMobile ? mobileImages : desktopImages
  }, [isMobile])

  // Preload images progressively - show first image immediately
  useEffect(() => {
    setImagesLoaded(false)
    setCurrentImageIndex(0)
    
    // Load first image with priority to show it immediately
    const firstImg = new Image()
    firstImg.src = backgroundImages[0]
    firstImg.onload = () => {
      setImagesLoaded(true) // Show first image immediately
    }
    
    // Then preload a small lookahead set in background (avoid preloading all)
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && (navigator as any).connection?.saveData) return
      backgroundImages.slice(1, 3).forEach((src) => {
        const img = new Image()
        img.decoding = 'async'
        img.loading = 'lazy' as any
        img.src = src
      })
    }, 200)
  }, [backgroundImages])

  useEffect(() => {
    if (!imagesLoaded) return
    
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(imageTimer)
  }, [imagesLoaded, backgroundImages])


  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {imagesLoaded && backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              willChange: "opacity",
            }}
          />
        ))}
        
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(209, 230, 240, 0.4) 0%, rgba(254, 217, 213, 0.4) 100%)',
          }}
        />
        
        {/* Fluffy mist/fog effect at the top - seamless blend */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {/* Main top mist - fluffy fog gradient with soft edges */}
          <div 
            className="absolute top-0 left-0 right-0 h-[45%]"
            style={{
              background: `
                radial-gradient(ellipse 150% 120% at 50% 0%, 
                  rgba(255,255,255,0.9) 0%, 
                  rgba(255,255,255,0.8) 8%, 
                  rgba(255,255,255,0.65) 18%, 
                  rgba(255,255,255,0.45) 35%, 
                  rgba(255,255,255,0.25) 55%, 
                  rgba(255,255,255,0.1) 75%, 
                  transparent 100%)
              `,
              filter: 'blur(2px)',
            }}
          />
          
          {/* Left side fluffy cloud */}
          <div 
            className="absolute top-0 left-0 h-[40%] w-[50%]"
            style={{
              background: `
                radial-gradient(ellipse 180% 100% at 0% 0%, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,255,255,0.5) 15%, 
                  rgba(255,255,255,0.3) 30%, 
                  rgba(255,255,255,0.15) 50%, 
                  transparent 80%)
              `,
              filter: 'blur(3px)',
            }}
          />
          
          {/* Right side fluffy cloud */}
          <div 
            className="absolute top-0 right-0 h-[40%] w-[50%]"
            style={{
              background: `
                radial-gradient(ellipse 180% 100% at 100% 0%, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,255,255,0.5) 15%, 
                  rgba(255,255,255,0.3) 30%, 
                  rgba(255,255,255,0.15) 50%, 
                  transparent 80%)
              `,
              filter: 'blur(3px)',
            }}
          />
          
          {/* Center fluffy accent */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[35%] w-[60%]"
            style={{
              background: `
                radial-gradient(ellipse 120% 90% at 50% 0%, 
                  rgba(255,255,255,0.6) 0%, 
                  rgba(255,255,255,0.4) 20%, 
                  rgba(255,255,255,0.2) 40%, 
                  transparent 70%)
              `,
              filter: 'blur(4px)',
            }}
          />
        </div>

        {/* Fluffy mist/fog effect at the bottom - seamless blend */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {/* Main bottom mist - fluffy fog gradient with soft edges */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[45%]"
            style={{
              background: `
                radial-gradient(ellipse 150% 120% at 50% 100%, 
                  rgba(255,255,255,0.9) 0%, 
                  rgba(255,255,255,0.8) 8%, 
                  rgba(255,255,255,0.65) 18%, 
                  rgba(255,255,255,0.45) 35%, 
                  rgba(255,255,255,0.25) 55%, 
                  rgba(255,255,255,0.1) 75%, 
                  transparent 100%)
              `,
              filter: 'blur(2px)',
            }}
          />
          
          {/* Left side fluffy cloud */}
          <div 
            className="absolute bottom-0 left-0 h-[40%] w-[50%]"
            style={{
              background: `
                radial-gradient(ellipse 180% 100% at 0% 100%, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,255,255,0.5) 15%, 
                  rgba(255,255,255,0.3) 30%, 
                  rgba(255,255,255,0.15) 50%, 
                  transparent 80%)
              `,
              filter: 'blur(3px)',
            }}
          />
          
          {/* Right side fluffy cloud */}
          <div 
            className="absolute bottom-0 right-0 h-[40%] w-[50%]"
            style={{
              background: `
                radial-gradient(ellipse 180% 100% at 100% 100%, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,255,255,0.5) 15%, 
                  rgba(255,255,255,0.3) 30%, 
                  rgba(255,255,255,0.15) 50%, 
                  transparent 80%)
              `,
              filter: 'blur(3px)',
            }}
          />
          
          {/* Center fluffy accent */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[35%] w-[60%]"
            style={{
              background: `
                radial-gradient(ellipse 120% 90% at 50% 100%, 
                  rgba(255,255,255,0.6) 0%, 
                  rgba(255,255,255,0.4) 20%, 
                  rgba(255,255,255,0.2) 40%, 
                  transparent 70%)
              `,
              filter: 'blur(4px)',
            }}
          />
        </div>
      </div>

      {/* Top intro text */}
      <div className="absolute top-0 left-0 right-0 z-[10] flex flex-col items-center justify-center pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-4">
        <p
          className="text-[#4a5d4e] text-base sm:text-lg md:text-xl lg:text-2xl text-center max-w-2xl mx-auto leading-relaxed"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
            letterSpacing: "0.02em",
          }}
        >
          Let us come together in faith, love, and celebration
          <br />
          on this very special day.
        </p>
      </div>

      {/* Bottom center text - Names, SAVE THE DATE, and Date */}
      <div className="absolute bottom-0 left-0 right-0 z-[10] flex flex-col items-center justify-center pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4">
        <h1
          className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#4a5d4e] text-center"
          style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
            letterSpacing: "0.02em",
          }}
        >
          Ransch Cristov
          <br />
          & 
          <br />
          Iszabella Rans
        </h1>
        <p
          className="text-[#4a5d4e] text-base sm:text-lg md:text-xl lg:text-2xl mt-6 sm:mt-8 md:mt-10"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
            letterSpacing: "0.05em",
          }}
        >
          SAVE THE DATE
        </p>
        <p
          className="text-[#4a5d4e] text-lg sm:text-xl md:text-2xl lg:text-3xl mt-2 sm:mt-3"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
            letterSpacing: "0.03em",
          }}
        >
          January 10, 2026 9AM
        </p>
      </div>

      {/* Torn paper edge at bottom */}
      {/* <TornPaperEdge position="bottom" /> */}

      {SHOW_BUTTERFLIES && (
        <>
          {/* Realistic Butterflies flying in lower part near flowers */}
          <style jsx>{`
            @keyframes flutter {
              0% { transform: rotateX(0deg); }
              50% { transform: rotateX(75deg); }
              100% { transform: rotateX(0deg); }
            }
            
            @keyframes flutter-left {
              0% { transform: rotateX(0deg) rotateY(2deg); }
              50% { transform: rotateX(70deg) rotateY(5deg); }
              100% { transform: rotateX(0deg) rotateY(2deg); }
            }
            
            @keyframes flutter-right {
              0% { transform: rotateX(0deg) rotateY(-2deg); }
              50% { transform: rotateX(70deg) rotateY(-5deg); }
              100% { transform: rotateX(0deg) rotateY(-2deg); }
            }
            
            .butterfly-wing {
              transform-origin: 50% 50%;
            }
            
            .butterfly-wing-left {
              animation: flutter-left 180ms ease-in-out infinite;
            }
            
            .butterfly-wing-right {
              animation: flutter-right 180ms ease-in-out infinite;
              animation-delay: 90ms;
            }
          `}</style>

          {/* Butterfly 1 - Flying at CTA button level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '15%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '5%', y: 0 }}
            animate={{
              x: ['5%', '15%', '30%', '50%', '70%', '85%', '75%', '55%', '30%', '10%', '5%'],
              y: [0, 15, 8, -5, 12, 5, 18, 10, -8, 5, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95], // Custom cubic bezier for smooth, natural motion
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 8, 12, 5, -3, -8, -5, 2, 10, 6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 120 120"
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                {/* Left Wing */}
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 35 50 25 35 Q 18 25 20 18 Q 25 10 32 15 Q 40 20 45 30 Q 52 45 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <path
                    d="M 60 60 Q 40 55 32 45 Q 28 38 30 32 Q 33 28 38 32 Q 43 36 48 45 Q 55 52 60 60"
                    fill="#FCB8B5"
                    opacity="0.85"
                  />
                  <ellipse cx="35" cy="30" rx="8" ry="10" fill="#FFE5B4" opacity="0.7" />
                  <circle cx="38" cy="35" r="3" fill="#E6A27A" opacity="0.8" />
                  <circle cx="30" cy="25" r="2" fill="#FCB8B5" opacity="0.9" />
                  
                  {/* Lower left wing */}
                  <path
                    d="M 60 65 Q 45 72 35 80 Q 28 86 30 92 Q 35 98 42 93 Q 48 88 52 80 Q 57 72 60 65"
                    fill="#FFBD87"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 65 Q 48 70 40 76 Q 36 80 38 84 Q 41 88 45 84 Q 49 80 54 74 Q 58 69 60 65"
                    fill="#FCB8B5"
                    opacity="0.75"
                  />
                </g>

                {/* Right Wing */}
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 85 50 95 35 Q 102 25 100 18 Q 95 10 88 15 Q 80 20 75 30 Q 68 45 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <path
                    d="M 60 60 Q 80 55 88 45 Q 92 38 90 32 Q 87 28 82 32 Q 77 36 72 45 Q 65 52 60 60"
                    fill="#FCB8B5"
                    opacity="0.85"
                  />
                  <ellipse cx="85" cy="30" rx="8" ry="10" fill="#FFE5B4" opacity="0.7" />
                  <circle cx="82" cy="35" r="3" fill="#E6A27A" opacity="0.8" />
                  <circle cx="90" cy="25" r="2" fill="#FCB8B5" opacity="0.9" />
                  
                  {/* Lower right wing */}
                  <path
                    d="M 60 65 Q 75 72 85 80 Q 92 86 90 92 Q 85 98 78 93 Q 72 88 68 80 Q 63 72 60 65"
                    fill="#FFBD87"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 65 Q 72 70 80 76 Q 84 80 82 84 Q 79 88 75 84 Q 71 80 66 74 Q 62 69 60 65"
                    fill="#FCB8B5"
                    opacity="0.75"
                  />
                </g>

                {/* Body - drawn on top */}
                <g className="butterfly-body">
                  <ellipse cx="60" cy="65" rx="3.5" ry="28" fill="#654321" />
                  <ellipse cx="60" cy="64" rx="2.5" ry="25" fill="#8B6F47" />
                  <ellipse cx="60" cy="63" rx="2" ry="22" fill="#A0826D" />
                  <circle cx="60" cy="55" r="4" fill="#4A3423" />
                  <ellipse cx="60" cy="75" rx="2.5" ry="10" fill="#654321" />
                  
                  {/* Antennae */}
                  <line x1="60" y1="55" x2="55" y2="45" stroke="#4A3423" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="60" y1="55" x2="65" y2="45" stroke="#4A3423" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="55" cy="45" r="2" fill="#654321" />
                  <circle cx="65" cy="45" r="2" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* Butterfly 2 - Different path and timing at CTA level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '18%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '90%', y: 0 }}
            animate={{
              x: ['90%', '78%', '62%', '45%', '28%', '12%', '5%', '18%', '35%', '55%', '75%', '90%'],
              y: [0, 10, -8, 15, 5, 20, 8, -5, 18, 12, 5, 0],
            }}
            transition={{
              duration: 38,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1], // Smooth cubic bezier
              delay: 5,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, -10, -6, 8, 12, -8, -12, 5, 10, -5, 8, 0],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 120 120"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                {/* Left Wing */}
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 38 52 28 38 Q 22 28 24 22 Q 28 15 35 20 Q 42 25 48 35 Q 55 48 60 60"
                    fill="#FCB8B5"
                    opacity="0.95"
                  />
                  <ellipse cx="38" cy="35" rx="9" ry="11" fill="#FFBD87" opacity="0.8" />
                  <circle cx="35" cy="30" r="3" fill="#E6A27A" opacity="0.85" />
                  
                  {/* Lower left wing */}
                  <path
                    d="M 60 65 Q 47 70 38 78 Q 32 84 34 90 Q 38 95 44 90 Q 50 85 55 78 Q 58 71 60 65"
                    fill="#FCB8B5"
                    opacity="0.9"
                  />
                </g>

                {/* Right Wing */}
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 82 52 92 38 Q 98 28 96 22 Q 92 15 85 20 Q 78 25 72 35 Q 65 48 60 60"
                    fill="#FCB8B5"
                    opacity="0.95"
                  />
                  <ellipse cx="82" cy="35" rx="9" ry="11" fill="#FFBD87" opacity="0.8" />
                  <circle cx="85" cy="30" r="3" fill="#E6A27A" opacity="0.85" />
                  
                  {/* Lower right wing */}
                  <path
                    d="M 60 65 Q 73 70 82 78 Q 88 84 86 90 Q 82 95 76 90 Q 70 85 65 78 Q 62 71 60 65"
                    fill="#FCB8B5"
                    opacity="0.9"
                  />
                </g>

                {/* Body */}
                <g className="butterfly-body">
                  <ellipse cx="60" cy="64" rx="3" ry="24" fill="#654321" />
                  <ellipse cx="60" cy="63" rx="2.2" ry="22" fill="#8B6F47" />
                  <circle cx="60" cy="56" r="3.5" fill="#4A3423" />
                  
                  {/* Antennae */}
                  <line x1="60" y1="56" x2="56" y2="48" stroke="#4A3423" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="60" y1="56" x2="64" y2="48" stroke="#4A3423" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="56" cy="48" r="1.5" fill="#654321" />
                  <circle cx="64" cy="48" r="1.5" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* Butterfly 3 - Smaller, flies at CTA level */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ 
              perspective: '1000px',
              bottom: '12%',
              left: 0,
              width: '100%',
            }}
            initial={{ x: '45%', y: 0 }}
            animate={{
              x: ['45%', '58%', '70%', '82%', '88%', '75%', '58%', '40%', '22%', '8%', '20%', '35%', '45%'],
              y: [0, 12, 5, 18, 10, -5, 15, 8, -8, 12, 18, 8, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: [0.43, 0.13, 0.57, 0.87], // Smooth flowing bezier curve
              delay: 10,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 9, 12, -5, -10, 8, 11, -8, -6, 10, 5, -8, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 120 120"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              >
                {/* Left Wing */}
                <g className="butterfly-wing butterfly-wing-left">
                  <path
                    d="M 60 60 Q 40 53 30 40 Q 24 30 26 24 Q 30 18 36 23 Q 43 28 50 38 Q 56 50 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <ellipse cx="40" cy="38" rx="7" ry="9" fill="#FCB8B5" opacity="0.75" />
                  <circle cx="37" cy="33" r="2.5" fill="#FFE5B4" opacity="0.8" />
                </g>

                {/* Right Wing */}
                <g className="butterfly-wing butterfly-wing-right">
                  <path
                    d="M 60 60 Q 80 53 90 40 Q 96 30 94 24 Q 90 18 84 23 Q 77 28 70 38 Q 64 50 60 60"
                    fill="#FFBD87"
                    opacity="0.95"
                  />
                  <ellipse cx="80" cy="38" rx="7" ry="9" fill="#FCB8B5" opacity="0.75" />
                  <circle cx="83" cy="33" r="2.5" fill="#FFE5B4" opacity="0.8" />
                </g>

                {/* Body */}
                <g className="butterfly-body">
                  <ellipse cx="60" cy="63" rx="2.5" ry="20" fill="#654321" />
                  <ellipse cx="60" cy="62" rx="2" ry="18" fill="#8B6F47" />
                  <circle cx="60" cy="57" r="3" fill="#4A3423" />
                  
                  {/* Antennae */}
                  <line x1="60" y1="57" x2="57" y2="50" stroke="#4A3423" strokeWidth="1" strokeLinecap="round" />
                  <line x1="60" y1="57" x2="63" y2="50" stroke="#4A3423" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="57" cy="50" r="1.2" fill="#654321" />
                  <circle cx="63" cy="50" r="1.2" fill="#654321" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        </>
      )}

    </section>
  )
}
