"use client"

import { useState, useEffect } from "react"
import { Cormorant_Garamond } from "next/font/google"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import { motion } from "motion/react"
import Image from "next/image"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export function Invitation() {
  const [bearImages, setBearImages] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  // Countdown timer - January 10, 2026 9AM
  useEffect(() => {
    const targetDate = new Date('2026-01-10T09:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])
  
  return (
    <section id="invitation" className="relative py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden">
      {/* Paper texture base - matching LoadingScreen */}
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

      {/* Torn paper edge at top */}
      <TornPaperEdge position="top" />
      
      {/* Bear decorations */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {bearImages[0] && (
          <motion.div
            className="absolute top-[25%] right-[5%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-50"
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Image
              src={bearImages[0]}
              alt="Bear decoration"
              fill
              className="object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
        {bearImages[1] && (
          <motion.div
            className="absolute bottom-[30%] left-[5%] w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 opacity-50"
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Image
              src={bearImages[1]}
              alt="Bear decoration"
              fill
              className="object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
        
        {/* Background bear images */}
        <motion.div
          className="absolute top-[50%] left-[1%] w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (8).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute top-[70%] right-[1%] w-18 h-18 sm:w-26 sm:h-26 md:w-34 md:h-34 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (6).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute top-[5%] right-[8%] w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (1).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-[5%] left-[8%] w-16 h-16 sm:w-22 sm:h-22 md:w-30 md:h-30 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (2).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute top-[15%] left-[3%] w-15 h-15 sm:w-22 sm:h-22 md:w-30 md:h-30 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (12).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-[15%] right-[3%] w-17 h-17 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (11).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute top-[35%] right-[3%] w-15 h-15 sm:w-21 sm:h-21 md:w-29 md:h-29 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: -7 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (4).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-[50%] left-[3%] w-16 h-16 sm:w-23 sm:h-23 md:w-31 md:h-31 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: 7 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (3).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          variants={staggerChildren}
        >
          {/* Invitation Text - Elegant matching hero section */}
          <motion.div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8" variants={fadeInUp}>
            <p
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] leading-relaxed font-light italic`}
              style={{ 
                letterSpacing: "0.03em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              A little blessing,
              <br />
              a precious beginning,
              <br />
              and a joyful first year of life.
            </p>
          </motion.div>

          {/* Decorative divider matching hero style */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4"
            variants={fadeInUp}
          >
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/40" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </motion.div>

          {/* Invitation Text - Baptism and Birthday */}
          <motion.div className="space-y-4 sm:space-y-6" variants={fadeInUp}>
            <p
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] leading-relaxed font-light`}
              style={{ 
                letterSpacing: "0.03em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Please join us as we celebrate the Baptism of
            </p>
          </motion.div>

          {/* Names - Elegant script style matching hero section */}
          <motion.div className="space-y-3 sm:space-y-4 md:space-y-5 relative" variants={fadeInUp}>
            {/* Bear images - desktop decorative (left and right) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12 md:-translate-x-16 hidden md:block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
              >
                <Image
                  src="/Details/bearboy.png"
                  alt="Bear boy"
                  fill
                  className="object-contain drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  }}
                />
              </motion.div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 md:translate-x-16 hidden md:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
              >
                <Image
                  src="/Details/beargirl.png"
                  alt="Bear girl"
                  fill
                  className="object-contain drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  }}
                />
              </motion.div>
            </div>

            {/* Bear images - mobile (above and below names) */}
            <div className="flex justify-center md:hidden mb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative w-20 h-20"
              >
                <Image
                  src="/Details/bearboy.png"
                  alt="Bear boy"
                  fill
                  className="object-contain drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  }}
                />
              </motion.div>
            </div>
            
            <h1
              className="style-script-regular text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#4a5d4e]"
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              Ransch Cristov
            </h1>
            <motion.p
              className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e] font-light`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.15)",
              }}
            >
              &
            </motion.p>
            <h1
              className="style-script-regular text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#4a5d4e]"
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              Iszabella Rans
            </h1>

            <div className="flex justify-center md:hidden mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative w-20 h-20"
              >
                <Image
                  src="/Details/beargirl.png"
                  alt="Bear girl"
                  fill
                  className="object-contain drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Birthday Text */}
          <motion.div className="space-y-4 sm:space-y-6" variants={fadeInUp}>
            <p
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] leading-relaxed font-light`}
              style={{ 
                letterSpacing: "0.03em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              and the 1st Birthday of our dear Ransch Cristov Penales.
            </p>
          </motion.div>

          {/* Decorative divider matching hero style */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4"
            variants={fadeInUp}
          >
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/40" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </motion.div>

          {/* Closing Message */}
          <motion.div className="space-y-4 sm:space-y-6" variants={fadeInUp}>
            <p
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] leading-relaxed font-light`}
              style={{ 
                letterSpacing: "0.03em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Let us come together in faith, love, and celebration
              <br />
              on this very special day.
            </p>
          </motion.div>

          {/* Decorative divider matching hero style */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4"
            variants={fadeInUp}
          >
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/40" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </motion.div>

          {/* Date and Venue Details */}
          <motion.div className="space-y-4 sm:space-y-6" variants={fadeInUp}>
            <p
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] font-light`}
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
                letterSpacing: "0.02em",
              }}
            >
              January 10, 2026 9AM
            </p>
            <p
              className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] font-light`}
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Ceremony: Our Lady of Lourdes Parish Church - Silang Junction North, Tagaytay City
            </p>
            <p
              className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] font-light`}
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Reception: McClare Resort Imus, Cavite
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div className="space-y-4 sm:space-y-6" variants={fadeInUp}>
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <div className="text-center">
                <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e] font-semibold`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/70 font-light uppercase tracking-wider mt-1`}>
                  Day
                </div>
              </div>
              <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e]/60 font-light`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                :
              </div>
              <div className="text-center">
                <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e] font-semibold`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/70 font-light uppercase tracking-wider mt-1`}>
                  Hour
                </div>
              </div>
              <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e]/60 font-light`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                :
              </div>
              <div className="text-center">
                <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e] font-semibold`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/70 font-light uppercase tracking-wider mt-1`}>
                  Minutes
                </div>
              </div>
              <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e]/60 font-light`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                :
              </div>
              <div className="text-center">
                <div className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#4a5d4e] font-semibold`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/70 font-light uppercase tracking-wider mt-1`}>
                  Seconds
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button - Matching hero section style */}
          <motion.div className="pt-8 sm:pt-10 md:pt-12" variants={fadeInUp}>
            <motion.a
              href="#guest-list"
              className={`${cormorant.className} inline-block px-12 sm:px-14 md:px-16 lg:px-20 py-4 sm:py-4.5 md:py-5 bg-[#4a5d4e] text-white uppercase tracking-[0.2em] text-sm sm:text-base md:text-lg font-medium rounded-sm shadow-[0_6px_20px_rgba(74,93,78,0.4)] transition-all duration-300 hover:bg-[#3d4d3f] hover:shadow-[0_8px_28px_rgba(74,93,78,0.5)] relative overflow-hidden group`}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Confirm Attendance</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" />
    </section>
  )
}
