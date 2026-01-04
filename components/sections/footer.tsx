"use client"

import { useState, useEffect } from "react"
import { Instagram, Twitter, Facebook, MapPin, Calendar, Clock, Heart, Music2 } from "lucide-react"
import { siteConfig } from "@/content/site"
import { Cormorant_Garamond } from "next/font/google"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import { motion } from "motion/react"
import Image from "next/image"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

export function Footer() {
  const year = new Date().getFullYear()
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTime = siteConfig.ceremony.time
  const receptionTime = siteConfig.reception.time
  const ceremonyVenue = siteConfig.ceremony.venue
  const receptionVenue = siteConfig.reception.venue

  const [ceremonyMonth = "December", ceremonyDayRaw = "21", ceremonyYear = "2025"] = ceremonyDate.split(" ")
  const ceremonyDayNumber = ceremonyDayRaw.replace(/[^0-9]/g, "") || "21"

  const quotes = [
    `"Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these." – Matthew 19:14`,
    "Welcome to Ransch Cristov and Iszabella's baptism celebration! We give thanks to God for these beautiful blessings and the joy they bring to our lives.",
    "Thank you for your love, prayers, and support as we celebrate this sacred day together!",
  ]

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
      }, 3000)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        const deleteTimeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
        return () => clearTimeout(deleteTimeout)
      } else {
        setIsDeleting(false)
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
      }
    } else {
      const currentQuote = quotes[currentQuoteIndex]
      if (displayedText.length < currentQuote.length) {
        const typeTimeout = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, displayedText.length + 1))
        }, 50)
        return () => clearTimeout(typeTimeout)
      } else {
        setIsPaused(true)
        setIsDeleting(true)
      }
    }
  }, [displayedText, isDeleting, isPaused, currentQuoteIndex, quotes])

  const nav = [
    { label: "Home", href: "#home" },
    { label: "Details", href: "#details" },
    { label: "Gallery", href: "#gallery" },
    { label: "Messages", href: "#messages" },
    { label: "RSVP", href: "#guest-list" },
  ] as const

  return (
    <footer 
      id="footer"
      className="relative z-20 mt-12 sm:mt-16 overflow-hidden"
    >
      {/* Paper texture base - matching Narrative section */}
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
            className="absolute top-[8%] right-[3%] w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 opacity-50"
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
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
            className="absolute bottom-[10%] left-[3%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-50"
            initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
            whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Image
              src={bearImages[1]}
              alt="Bear decoration"
              fill
              className="object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
      </div>
      
      {/* Monogram - centered at top */}
      <div className="relative z-10 flex flex-col items-center pt-12 sm:pt-16 md:pt-20 lg:pt-24 mb-5 sm:mb-6 md:mb-8">
        <div className="relative">
          <div 
            className="text-center"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 700,
              fontSize: '3rem',
              lineHeight: '1.2',
              color: 'rgb(74, 93, 78)',
            }}
          >
            R | I
          </div>
        </div>

        {/* Names & Date below monogram */}
        <div className="mt-3 sm:mt-4 md:mt-5 text-center">
          <p
            className={`${cormorant.className} tracking-[0.25em] sm:tracking-[0.3em] text-xs sm:text-sm md:text-base text-[#4a5d4e] uppercase font-light`}
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            Ransch Cristov & Iszabella Rans
          </p>
          <p
            className={`${cormorant.className} text-sm sm:text-base md:text-lg text-[#4a5d4e]/85 mt-1 sm:mt-2 font-light`}
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            {ceremonyDate}
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* Children Info */}
          <div className="lg:col-span-2">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 md:h-12 bg-[#4a5d4e]/10 rounded-full flex items-center justify-center border border-[#4a5d4e]/20 flex-shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 md:w-6 text-[#4a5d4e]" fill="#4a5d4e" />
                </div>
                <h3 
                  className="style-script-regular text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#4a5d4e]"
                  style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
                  }}
                >
                  Ransch Cristov & Iszabella Rans
                </h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className={`flex items-center gap-3 ${cormorant.className} text-[#4a5d4e] font-light`}>
                  <Calendar className="w-4 h-4 sm:w-5 md:w-5 text-[#4a5d4e] flex-shrink-0" />
                  <span className="text-sm sm:text-base md:text-lg" style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                  }}>{ceremonyDate}</span>
                </div>
                <div className={`flex items-center gap-3 ${cormorant.className} text-[#4a5d4e]/85 font-light`}>
                  <MapPin className="w-4 h-4 sm:w-5 md:w-5 text-[#4a5d4e] flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base leading-relaxed" style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                  }}>{ceremonyVenue}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F5]/98 backdrop-blur-md border border-[#D0D0D0]/40 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
              <blockquote 
                className={`${cormorant.className} text-[#4a5d4e] italic text-sm sm:text-base md:text-lg leading-relaxed min-h-[60px] sm:min-h-[70px] md:min-h-[80px] font-light`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                }}
              >
                "{displayedText}
                <span className="inline-block w-0.5 h-4 sm:h-5 md:h-6 bg-[#4a5d4e] ml-1 animate-pulse">|</span>"
              </blockquote>
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4a5d4e]/60 rounded-full" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4a5d4e]/40 rounded-full" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4a5d4e]/60 rounded-full" />
              </div>
            </div>
          </div>

          {/* Event Details quick tiles */}
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-[#FAF9F5]/98 backdrop-blur-md border border-[#D0D0D0]/40 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 hover:border-[#4a5d4e]/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 md:h-10 bg-[#4a5d4e]/10 rounded-full flex items-center justify-center border border-[#4a5d4e]/20 flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 md:w-5 text-[#4a5d4e]" />
                </div>
                <h4 
                  className={`${cormorant.className} font-semibold text-base sm:text-lg md:text-xl text-[#4a5d4e]`}
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
                >
                  Ceremony
                </h4>
              </div>
              <div className={`space-y-2 sm:space-y-3 ${cormorant.className} text-[#4a5d4e]/85 text-xs sm:text-sm leading-relaxed font-light`}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 text-[#4a5d4e] flex-shrink-0 mt-0.5" />
                  <span style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                  }}>{ceremonyVenue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-3.5 h-3.5 sm:w-4 text-[#4a5d4e] flex-shrink-0" />
                  <span style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                  }}>{ceremonyTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F5]/98 backdrop-blur-md border border-[#D0D0D0]/40 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 hover:border-[#4a5d4e]/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 md:h-10 bg-[#4a5d4e]/10 rounded-full flex items-center justify-center border border-[#4a5d4e]/20 flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 md:w-5 text-[#4a5d4e]" fill="#4a5d4e" />
                </div>
                <h4 
                  className={`${cormorant.className} font-semibold text-base sm:text-lg md:text-xl text-[#4a5d4e]`}
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
                >
                  Reception
                </h4>
              </div>
              <div className={`space-y-2 sm:space-y-3 ${cormorant.className} text-[#4a5d4e]/85 text-xs sm:text-sm leading-relaxed font-light`}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 text-[#4a5d4e] flex-shrink-0 mt-0.5" />
                  <span style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                  }}>{receptionVenue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-3.5 h-3.5 sm:w-4 text-[#4a5d4e] flex-shrink-0" />
                  <span style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                  }}>{receptionTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact + Quick Links */}
          <div className="space-y-6 sm:space-y-7">
            <div>
              <h4 
                className={`${cormorant.className} font-semibold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 md:mb-5 flex items-center gap-2 sm:gap-3 text-[#4a5d4e]`}
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
              >
                <div className="w-1.5 sm:w-2 h-6 sm:h-7 md:h-8 bg-[#4a5d4e]/30 rounded-full" /> Follow Us
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                <a 
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#4a5d4e]/10 border border-[#4a5d4e]/20 hover:bg-[#4a5d4e]/20 hover:border-[#4a5d4e]/40 transition-all duration-200 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a5d4e]" />
                </a>
                <a 
                  href="https://www.instagram.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#4a5d4e]/10 border border-[#4a5d4e]/20 hover:bg-[#4a5d4e]/20 hover:border-[#4a5d4e]/40 transition-all duration-200 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a5d4e]" />
                </a>
                <a 
                  href="https://www.youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#4a5d4e]/10 border border-[#4a5d4e]/20 hover:bg-[#4a5d4e]/20 hover:border-[#4a5d4e]/40 transition-all duration-200 hover:scale-110"
                  aria-label="YouTube"
                >
                  <Music2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a5d4e]" />
                </a>
                <a 
                  href="https://x.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#4a5d4e]/10 border border-[#4a5d4e]/20 hover:bg-[#4a5d4e]/20 hover:border-[#4a5d4e]/40 transition-all duration-200 hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a5d4e]" />
                </a>
              </div>
            </div>

            <div>
              <h5 
                className={`${cormorant.className} font-semibold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-[#4a5d4e]`}
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
              >
                Quick Links
              </h5>
              <div className="space-y-2">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block text-[#4a5d4e]/85 hover:text-[#4a5d4e] transition-colors duration-200 ${cormorant.className} text-xs sm:text-sm leading-relaxed font-light`}
                    style={{ 
                      letterSpacing: "0.02em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[#D0D0D0]/40 pt-5 sm:pt-6 md:pt-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5">
            <div className="text-center md:text-left">
              <p 
                className={`text-[#4a5d4e] ${cormorant.className} text-xs sm:text-sm leading-relaxed font-light`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                }}
              >
                © {year} Ransch Cristov & Iszabella Rans — crafted with love, prayers, and gratitude.
              </p>
              <p 
                className={`text-[#4a5d4e]/85 ${cormorant.className} text-xs sm:text-sm mt-1 leading-relaxed font-light`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                }}
              >
                This celebration site was designed to share Ransch Cristov and Iszabella's special day with you.
              </p>
            </div>
            
            <div className="text-center md:text-right space-y-1">
              <p 
                className={`text-[#4a5d4e]/85 ${cormorant.className} text-xs sm:text-sm font-light`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                }}
              >
                Developed by{" "}
                <a 
                  href="https://lance28-beep.github.io/portfolio-website/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4a5d4e] hover:text-[#3d4d3f] transition-colors duration-200 underline decoration-[#4a5d4e]/60 hover:decoration-[#4a5d4e]/80"
                >
                  Lance Valle
                </a>
              </p>
              <p 
                className={`text-[#4a5d4e]/85 ${cormorant.className} text-xs sm:text-sm font-light`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                }}
              >
                Want a website like this? Visit{" "}
                <a 
                  href="https://www.facebook.com/WeddingInvitationNaga" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4a5d4e] hover:text-[#3d4d3f] transition-colors duration-200 underline decoration-[#4a5d4e]/60 hover:decoration-[#4a5d4e]/80"
                >
                  Wedding Invitation Naga
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Torn paper edge at bottom */}
      {/* <TornPaperEdge position="bottom" /> */}
    </footer>
  )
}
