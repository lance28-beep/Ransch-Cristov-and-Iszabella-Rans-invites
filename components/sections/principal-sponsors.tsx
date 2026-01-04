"use client"

import React from "react"
import { useEffect, useMemo, useState, useRef } from "react"
import { Section } from "@/components/section"
import { Loader2, Users } from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"
import { siteConfig } from "@/content/site"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Image from "next/image"
import { motion } from "motion/react"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

interface PrincipalSponsor {
  MalePrincipalSponsor: string
  FemalePrincipalSponsor: string
}

export function PrincipalSponsors() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Helper component for elegant section titles
  const SectionTitle = ({
    children,
    align = "center",
    className = "",
  }: {
    children: React.ReactNode
    align?: "left" | "center" | "right"
    className?: string
  }) => {
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <h3
        className={`relative ${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-extrabold uppercase text-[#111814] mb-2 sm:mb-2.5 md:mb-3 tracking-[0.14em] sm:tracking-[0.18em] ${textAlign} ${className} transition-all duration-300 whitespace-nowrap`}
      >
        {children}
      </h3>
    )
  }

  // Helper component for name items with alignment
  const NameItem = ({ name, align = "center" }: { name: string, align?: "left" | "center" | "right" }) => {
    const containerAlign =
      align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <div
        className={`relative flex flex-col ${containerAlign} justify-center py-1 sm:py-1.5 md:py-2.5 w-full group/item transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03]`}
      >
        {/* Hover highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4a5d4e]/15 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-md" />

        <p
          className={`relative text-[#243127] text-[11px] sm:text-[13px] md:text-sm lg:text-base font-semibold leading-snug sm:leading-relaxed break-words ${textAlign} group-hover/item:text-[#1A231C] transition-all duration-300`}
        >
          {name}
        </p>
      </div>
    )
  }

  // Remote data state
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  const fetchSponsors = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/principal-sponsor", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load principal sponsors")
      const data: PrincipalSponsor[] = await res.json()
      setSponsors(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to load principal sponsors")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsors()
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Keep sponsors as pairs to ensure alignment
  const sponsorPairs = useMemo(() => 
    sponsors.filter(s => s.MalePrincipalSponsor || s.FemalePrincipalSponsor),
    [sponsors]
  )

  const { groomNickname, brideNickname } = siteConfig.couple

  return (
    <div ref={sectionRef}>
      <Section
        id="sponsors"
        className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-[#FAF9F5]"
      >
        {/* Torn paper edge at top */}
        <TornPaperEdge position="top" />
        
        {/* Bear decorations */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {bearImages[0] && (
            <motion.div
              className="absolute top-[10%] left-[3%] w-11 h-11 sm:w-15 sm:h-15 md:w-19 md:h-19 opacity-50"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
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
              className="absolute bottom-[12%] right-[3%] w-13 h-13 sm:w-17 sm:h-17 md:w-21 md:h-21 opacity-50"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
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
        
        {/* Paper texture background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle paper texture effect */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
          }} />
          {/* Soft accents */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#4a5d4e]/5 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#4a5d4e]/5 via-transparent to-transparent" />
        </div>

        {/* Section Header */}
        <div
          className={`relative z-30 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Small label - elegant uppercase */}
            <p
              className={`${cormorant.className} text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-[#4a5d4e] font-light`}
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
            >
              Our Beloved Principal Sponsors
            </p>

            {/* Main title - elegant script */}
            <h2
              className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e]"
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
              }}
            >
              Standing with {groomNickname} &amp; {brideNickname}
            </h2>
          </div>

          {/* Elegant divider */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/50 border border-[#4a5d4e]/40" />
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </div>
        </div>

        {/* Sponsors content */}
        <div
          className={`relative z-30 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Card with paper theme */}
          <div className="relative bg-[#FAF9F5]/98 backdrop-blur-md overflow-hidden border border-[#D0D0D0]/40 shadow-[0_16px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                              repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
            }} />
            
            {/* Card content */}
            <div className="relative py-3 sm:py-6 md:py-8 z-10">
              <div className="relative z-10 w-full">
              {isLoading ? (
                <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-[#4a5d4e]/70" />
                    <span className="text-[#4a5d4e]/80 font-serif text-base sm:text-lg">Loading sponsors...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                  <div className="text-center">
                    <p className="text-red-700/80 font-serif text-base sm:text-lg mb-3">{error}</p>
                    <button
                      onClick={fetchSponsors}
                      className="text-[#4a5d4e]/90 hover:text-[#4a5d4e] font-serif underline transition-colors duration-200"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : sponsorPairs.length === 0 ? (
                <div className="text-center py-24 sm:py-28 md:py-32">
                  <Users className="h-14 w-14 sm:h-16 sm:w-16 text-[#4a5d4e]/30 mx-auto mb-4" />
                  <p className="text-[#4a5d4e]/60 font-serif text-base sm:text-lg">No sponsors yet</p>
                </div>
              ) : (
                <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 space-y-6 sm:space-y-8">
                  {/* Principal Sponsors grid */}
                  <div>
                    <div className="mb-1.5 sm:mb-2 md:mb-3">
                      <SectionTitle align="center">
                        Principal Sponsors
                      </SectionTitle>
                    </div>
                    <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-1.5 sm:gap-x-2 md:gap-x-3 gap-y-1 sm:gap-y-1.5 md:gap-y-2 items-stretch">
                      {sponsorPairs.map((pair, idx) => (
                        <React.Fragment key={`pair-${idx}-${pair.MalePrincipalSponsor || 'empty'}-${pair.FemalePrincipalSponsor || 'empty'}`}>
                          <div className="px-2 sm:px-3 md:px-4">
                            {pair.MalePrincipalSponsor ? (
                              <NameItem name={pair.MalePrincipalSponsor} align="right" />
                            ) : (
                              <div className="py-0.5 sm:py-1 md:py-1.5" />
                            )}
                          </div>
                          <div className="px-2 sm:px-3 md:px-4">
                            {pair.FemalePrincipalSponsor ? (
                              <NameItem name={pair.FemalePrincipalSponsor} align="left" />
                            ) : (
                              <div className="py-0.5 sm:py-1 md:py-1.5" />
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" />
      </Section>
    </div>
  )
}