"use client"

import { Section } from "@/components/section"
import { motion } from "motion/react"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getRandomBearImages } from "@/lib/bear-utils"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Stack from "@/components/stack"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export function Narrative() {
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  return (
    <Section
      id="narrative"
      className="relative py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden"
    >
      {/* Paper texture base - matching Invitation section */}
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
          className="text-center space-y-8 sm:space-y-10 md:space-y-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Label */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#4a5d4e]"
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              A Celebration of Faith & First Milestones
            </h2>
          </motion.div>

          {/* Sub-label */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] font-light uppercase tracking-[0.15em]`}
              style={{ 
                letterSpacing: "0.15em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Baptism and 1st Birthday
            </p>
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/40" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </motion.div>

          {/* Stack Image Component */}
          <motion.div 
            className="flex justify-center py-8 sm:py-10 md:py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <div className="relative">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a5d4e]/15 via-[#4a5d4e]/10 to-[#4a5d4e]/12 rounded-full blur-3xl -z-10 w-full h-full max-w-sm animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4a5d4e]/12 via-transparent to-[#4a5d4e]/10 rounded-full blur-2xl -z-10 w-full h-full max-w-sm" />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#4a5d4e]/10 via-transparent to-[#4a5d4e]/8 rounded-full blur-xl -z-10 w-full h-full max-w-sm" />

              <Stack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={false}
                cardDimensions={{ width: 240, height: 280 }}
                cardsData={[
                  { id: 1, img: "/mobile-background/celebrant (1).jpg" },
                  { id: 2, img: "/mobile-background/celebrant (2).jpg" },
                  { id: 3, img: "/mobile-background/celebrant (10).jpg" },
                  { id: 4, img: "/mobile-background/celebrant (4).jpg" },
                  { id: 5, img: "/mobile-background/celebrant (5).jpg" },
                  { id: 6, img: "/mobile-background/celebrant (6).jpg" },
                  { id: 7, img: "/mobile-background/celebrant (7).jpg" },
                  { id: 8, img: "/mobile-background/celebrant (8).jpg" },
                  { id: 9, img: "/mobile-background/celebrant (9).jpg" },
                  { id: 10, img: "/mobile-background/celebrant (3).jpg" }
                ]}
                animationConfig={{ stiffness: 260, damping: 20 }}
              />

              <motion.p 
                className={`${cormorant.className} text-center text-xs md:text-sm text-[#4a5d4e] mt-4 font-light tracking-wide`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
              >
                <span className="text-[#4a5d4e]/70">✨</span> Drag to explore our moments <span className="text-[#4a5d4e]/70">✨</span>
              </motion.p>
            </div>
          </motion.div>

          {/* Narrative Text */}
          <motion.div
            className="max-w-[600px] mx-auto space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="space-y-5 sm:space-y-6">
              <p
                className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] leading-relaxed font-light text-center`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
                  lineHeight: "1.8",
                }}
              >
                With hearts full of gratitude and joy, we invite you to join us in celebrating two beautiful milestones in our family&apos;s journey. On this blessed day, we will witness the <strong className="font-semibold">Baptism of Ransch Cristov Penales and Iszabella Rans Penales</strong>, as they receive the sacrament that welcomes them into our faith community and marks the beginning of their spiritual journey.
              </p>
              
              <p
                className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] leading-relaxed font-light text-center`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
                  lineHeight: "1.8",
                }}
              >
                We also celebrate with immense love and pride the <strong className="font-semibold">1st Birthday of our dear Ransch Cristov Penales</strong>. This first year has been a precious gift, filled with countless moments of wonder, growth, and boundless love. Each day has brought new discoveries, sweet smiles, and the pure joy that only a child can bring to a family.
              </p>
              
              <p
                className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] leading-relaxed font-light text-center`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
                  lineHeight: "1.8",
                }}
              >
                These celebrations represent more than milestones—they are testaments to God&apos;s grace, the strength of family bonds, and the beautiful promise of new beginnings. As we gather together in faith, love, and celebration, we are reminded of the blessings that surround us and the hope that fills our hearts for the future.
              </p>
              
              <p
                className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] leading-relaxed font-light text-center italic`}
                style={{ 
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
                  lineHeight: "1.8",
                }}
              >
                Your presence would make this day even more meaningful as we honor these precious moments together.
              </p>
            </div>
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/40" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
            <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </motion.div>
        </motion.div>
      </div>

      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" />
    </Section>
  )
}
