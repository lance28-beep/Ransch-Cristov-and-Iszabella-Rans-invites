"use client"

import React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { siteConfig } from "@/content/site"
import { Loader2, Users } from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Image from "next/image"
import { motion } from "motion/react"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

interface EntourageMember {
  Name: string
  RoleCategory: string
  RoleTitle: string
  Email: string
}

const ROLE_CATEGORY_ORDER = [
  "OFFICIATING MINISTER",
  "The Couple",
  "Parents of the Groom",
  "Parents of the Bride",
  "Family of the Groom",
  "Family of the Bride",
  "Best Man",
  "Maid of Honor",
  "Matron of Honor",
  "Candle Sponsors",
  "Cord Sponsors",
  "Veil Sponsors",
  "Groomsmen",
  "Bridesmaids",
  "Flower Girls",
  "Ring/Coin Bearers",
]

export function Entourage() {
  const [entourage, setEntourage] = useState<EntourageMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  const fetchEntourage = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/entourage", { cache: "no-store" })
      if (!response.ok) {
        throw new Error("Failed to fetch entourage")
      }
      const data: EntourageMember[] = await response.json()
      setEntourage(data)
    } catch (error: any) {
      console.error("Failed to load entourage:", error)
      setError(error?.message || "Failed to load entourage")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntourage()

    // Set up auto-refresh listener for dashboard updates
    const handleEntourageUpdate = () => {
      setTimeout(() => {
        fetchEntourage()
      }, 1000)
    }

    window.addEventListener("entourageUpdated", handleEntourageUpdate)

    return () => {
      window.removeEventListener("entourageUpdated", handleEntourageUpdate)
    }
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

  // Group entourage by role category
  const grouped = useMemo(() => {
    const grouped: Record<string, EntourageMember[]> = {}
    
    entourage.forEach((member) => {
      const category = member.RoleCategory

      // Skip members without a category or in "Other"
      if (!category || category === "Other") {
        return
      }
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(member)
    })
    
    return grouped
  }, [entourage])

  // Helper component for elegant section titles
  const SectionTitle = ({ 
    children,
    align = "center",
    className = "",
    subLabel
  }: { 
    children: React.ReactNode
    align?: "left" | "center" | "right"
    className?: string
    subLabel?: string
  }) => {
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <div className={`flex flex-col ${textAlign} ${className}`}>
        <h3
          className={`relative ${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-extrabold uppercase text-[#111814] mb-1 sm:mb-1.5 md:mb-2 tracking-[0.14em] sm:tracking-[0.18em] ${textAlign} transition-all duration-300 whitespace-nowrap`}
        >
          {children}
        </h3>
        {subLabel && (
          <p className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-light italic text-[#556457] tracking-wide ${textAlign} transition-all duration-300`}>
            {subLabel}
          </p>
        )}
      </div>
    )
  }

  // Helper component for name items with role title (supports alignment)
  const NameItem = ({
    member,
    align = "center",
    showRole = true,
  }: {
    member: EntourageMember
    align?: "left" | "center" | "right"
    showRole?: boolean
  }) => {
    const containerAlign =
      align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <div
        className={`relative flex flex-col ${containerAlign} justify-center py-1 sm:py-1.5 md:py-2 leading-snug sm:leading-relaxed group/item transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03]`}
      >
        {/* Hover highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4a5d4e]/15 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-md" />

        <p
          className={`relative text-[#243127] text-[11px] sm:text-[13px] md:text-sm lg:text-base font-semibold ${textAlign} group-hover/item:text-[#1A231C] transition-all duration-300`}
        >
          {member.Name}
        </p>
        {showRole && member.RoleTitle && (
          <p
            className={`relative text-[#556457] text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-medium mt-0.5 leading-tight sm:leading-snug ${textAlign} tracking-wide uppercase group-hover/item:text-[#37413A] transition-colors duration-300`}
          >
            {member.RoleTitle}
          </p>
        )}
      </div>
    )
  }

  // Helper component for two-column layout wrapper
  const TwoColumnLayout = ({ 
    children, 
    leftTitle, 
    rightTitle,
    singleTitle,
    centerContent = false,
    subLabel
  }: { 
    children: React.ReactNode
    leftTitle?: string
    rightTitle?: string
    singleTitle?: string
    centerContent?: boolean
    subLabel?: string
  }) => {
    if (singleTitle) {
      return (
        <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          <SectionTitle subLabel={subLabel}>{singleTitle}</SectionTitle>
          <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-1.5 sm:gap-x-2 md:gap-x-3 gap-y-1 sm:gap-y-1.5 md:gap-y-2 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-1.5 sm:gap-x-2 md:gap-x-3 mb-1.5 sm:mb-2 md:mb-3">
          {leftTitle && (
            <SectionTitle align="right" className="pr-2 sm:pr-3 md:pr-4">{leftTitle}</SectionTitle>
          )}
          {rightTitle && (
            <SectionTitle align="left" className="pl-2 sm:pl-3 md:pl-4">{rightTitle}</SectionTitle>
          )}
        </div>
        <div className={`grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-1.5 sm:gap-x-2 md:gap-x-3 gap-y-1 sm:gap-y-1.5 md:gap-y-2 ${centerContent ? 'max-w-2xl mx-auto' : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div ref={sectionRef}>
      <section
        id="entourage"
        className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-[#FAF9F5]"
      >
        {/* Torn paper edge at top */}
        <TornPaperEdge position="top" />
        
        {/* Bear decorations */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {bearImages[0] && (
            <motion.div
              className="absolute top-[10%] right-[3%] w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 opacity-50"
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
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
              className="absolute bottom-[12%] left-[3%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-50"
              initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
              whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
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
            Those who stand with {siteConfig.couple.groomNickname} &amp; {siteConfig.couple.brideNickname}
          </p>

          {/* Main title - elegant script */}
          <h2
            className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e]"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            Wedding Entourage
          </h2>
        </div>

        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
          <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/50 border border-[#4a5d4e]/40" />
          <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
        </div>
      </div>

      {/* Central Card Container */}
      <div
        className={`relative z-30 max-w-4xl mx-auto px-3 sm:px-5 transition-all duration-1000 delay-300 ${
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
            <div className="relative z-10 w-full px-3 sm:px-6 md:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-[#4a5d4e]/70" />
                  <span className="text-[#4a5d4e]/80 font-serif text-base sm:text-lg">Loading entourage...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="text-center">
                  <p className="text-red-700/80 font-serif text-base sm:text-lg mb-3">{error}</p>
                  <button
                    onClick={fetchEntourage}
                    className="text-[#4a5d4e]/90 hover:text-[#4a5d4e] font-serif underline transition-colors duration-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : entourage.length === 0 ? (
              <div className="text-center py-24 sm:py-28 md:py-32">
                <Users className="h-14 w-14 sm:h-16 sm:w-16 text-[#4a5d4e]/30 mx-auto mb-4" />
                <p className="text-[#4a5d4e]/60 font-serif text-base sm:text-lg">No entourage members yet</p>
              </div>
            ) : (
            <>
              {ROLE_CATEGORY_ORDER.map((category, categoryIndex) => {
                const members = grouped[category] || []
                
                if (members.length === 0) return null

                // Special handling for The Couple - display Bride and Groom side by side
                if (category === "The Couple") {
                   const groom = members.find(m => m.RoleTitle?.toLowerCase().includes('groom'))
                  const bride = members.find(m => m.RoleTitle?.toLowerCase().includes('bride'))
                  
                  return (
                    <div key={category}>
                        {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-3 md:py-4 mb-3 sm:mb-4 md:mb-6">
                          <div className="flex items-center gap-1.5 sm:gap-2 w-full max-w-md">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#4a5d4e]/40 rounded-full" />
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#4a5d4e]/50 rounded-full" />
                              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#4a5d4e]/40 rounded-full" />
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                          </div>
                        </div>
                      )}
                      <TwoColumnLayout singleTitle="The Couple" centerContent={true}>
                        <div className="px-2 sm:px-3 md:px-4">
                          {groom && <NameItem member={groom} align="right" />}
                        </div>
                        <div className="px-2 sm:px-3 md:px-4">
                          {bride && <NameItem member={bride} align="left" />}
                        </div>
                      </TwoColumnLayout>
                    </div>
                  )
                }

                // Special handling for Parents sections - combine into single two-column layout
                if (category === "Parents of the Bride" || category === "Parents of the Groom") {
                  // Get both parent groups
                  const parentsBride = grouped["Parents of the Bride"] || []
                  const parentsGroom = grouped["Parents of the Groom"] || []
                  
                  // Helper function to sort parents: father first, then mother
                  const sortParents = (members: EntourageMember[]) => {
                    return [...members].sort((a, b) => {
                      const aIsFather = a.RoleTitle?.toLowerCase().includes('father') ?? false
                      const bIsFather = b.RoleTitle?.toLowerCase().includes('father') ?? false
                      
                      // Father comes first
                      if (aIsFather && !bIsFather) return -1
                      if (!aIsFather && bIsFather) return 1
                      return 0
                    })
                  }
                  
                  // Only render once (when processing "Parents of the Groom")
                  if (category === "Parents of the Groom") {
                    return (
                      <div key="Parents">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">
                            <div className="flex items-center gap-2 w-full max-w-md">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#4a5d4e]/50 rounded-full" />
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                            </div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Groom’s Parents" rightTitle="Bride’s Parents">
                          {(() => {
                            const leftArr = sortParents(parentsGroom)
                            const rightArr = sortParents(parentsBride)
                            const maxLen = Math.max(leftArr.length, rightArr.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = leftArr[i]
                              const right = rightArr[i]
                              rows.push(
                                <React.Fragment key={`parents-row-${i}`}>
                                  <div key={`parent-groom-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                  <div key={`parent-bride-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Parents of the Bride" since it's already rendered above
                  return null
                }

                // Special handling for Family of the Groom/Bride - combine into single two-column layout
                if (category === "Family of the Groom" || category === "Family of the Bride") {
                  const familyGroom = grouped["Family of the Groom"] || []
                  const familyBride = grouped["Family of the Bride"] || []

                  if (category === "Family of the Groom") {
                    return (
                      <div key="Family">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">
                            <div className="flex items-center gap-2 w-full max-w-md">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#4a5d4e]/50 rounded-full" />
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                            </div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Family of the Groom" rightTitle="Family of the Bride">
                          {(() => {
                            const maxLen = Math.max(familyGroom.length, familyBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = familyGroom[i]
                              const right = familyBride[i]
                              rows.push(
                                <React.Fragment key={`family-row-${i}`}>
                                  <div key={`family-groom-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                  <div key={`family-bride-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return null
                }

                // Special handling for Maid/Matron of Honor and Best Man - combine into single two-column layout
                if (category === "Matron of Honor" || category === "Maid of Honor" || category === "Best Man") {
                  // Get both honor attendant groups - combine Maid and Matron of Honor
                  const maidOfHonor = [...(grouped["Maid of Honor"] || []), ...(grouped["Matron of Honor"] || [])]
                  const bestMan = grouped["Best Man"] || []
                  
                  // Only render once (when processing "Best Man")
                  if (category === "Best Man") {
                    return (
                      <div key="HonorAttendants">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">
                            <div className="flex items-center gap-2 w-full max-w-md">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#4a5d4e]/50 rounded-full" />
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                            </div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Best Man" rightTitle="Maid of Honor">
                          {(() => {
                            const maxLen = Math.max(bestMan.length, maidOfHonor.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = bestMan[i]
                              const right = maidOfHonor[i]
                              rows.push(
                                <React.Fragment key={`honor-row-${i}`}>
                                  <div key={`bestman-cell-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                  <div key={`maid-cell-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Matron of Honor" and "Maid of Honor" since they're already rendered above
                  return null
                }

                // Special handling for Bridesmaids and Groomsmen - combine into single two-column layout
                if (category === "Bridesmaids" || category === "Groomsmen") {
                  // Get both bridal party groups
                  const bridesmaids = grouped["Bridesmaids"] || []
                  const groomsmen = grouped["Groomsmen"] || []
                  
                  // Only render once (when processing "Bridesmaids")
                  if (category === "Bridesmaids") {
                    return (
                      <div key="BridalParty">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">
                            <div className="flex items-center gap-2 w-full max-w-md">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#4a5d4e]/50 rounded-full" />
                                <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                            </div>
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Groomsmen" rightTitle="Bridesmaids">
                          {(() => {
                            const maxLen = Math.max(bridesmaids.length, groomsmen.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const groomsman = groomsmen[i]
                              const bridesmaid = bridesmaids[i]
                              rows.push(
                                <React.Fragment key={`bridal-row-${i}`}>
                                  <div key={`groomsman-cell-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {groomsman ? <NameItem member={groomsman} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                  <div key={`bridesmaid-cell-${i}`} className="px-2 sm:px-3 md:px-4">
                                    {bridesmaid ? <NameItem member={bridesmaid} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Groomsmen" since it's already rendered above
                  return null
                }


                // Default: single title, centered content
                return (
                  <div key={category}>
                    {categoryIndex > 0 && (
                      <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">
                        <div className="flex items-center gap-2 w-full max-w-md">
                          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                          <div className="w-1.5 h-1.5 bg-[#4a5d4e]/50 rounded-full"></div>
                          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                        </div>
                      </div>
                    )}
                    <TwoColumnLayout 
                      singleTitle={category} 
                      centerContent={true}
                      subLabel={
                        category === "Candle Sponsors" ? "To light our path" :
                        category === "Cord Sponsors" ? "To bind us together" :
                        category === "Veil Sponsors" ? "To clothe us as one" :
                        undefined
                      }
                    >
                      {(() => {
                        const SINGLE_COLUMN_SECTIONS = new Set([
                          "Best Man",
                          "Maid of Honor",
                          "Ring Bearer",
                          "Coin Bearer",
                          "Bible Bearer",
                          "Presider",
                        ])
                        // Special rule: paired sponsor roles with exactly 2 names should meet at center
                        const PAIRED_SECTIONS = new Set(["Candle Sponsors", "Cord Sponsors", "Veil Sponsors"])
                        if (PAIRED_SECTIONS.has(category) && members.length === 2) {
                          const left = members[0]
                          const right = members[1]
                          return (
                            <>
                              <div className="px-2 sm:px-3 md:px-4">
                                <NameItem member={left} align="right" />
                              </div>
                              <div className="px-2 sm:px-3 md:px-4">
                                <NameItem member={right} align="left" />
                              </div>
                            </>
                          )
                        }
                        if (SINGLE_COLUMN_SECTIONS.has(category) || members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.Name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Default two-column sections: render row-by-row pairs to keep alignment on small screens
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-2 sm:px-3 md:px-4">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-2 sm:px-3 md:px-4">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
              
              {/* Display any other categories not in the ordered list */}
              {Object.keys(grouped).filter(cat => !ROLE_CATEGORY_ORDER.includes(cat) && cat !== "Other").map((category) => {
                const members = grouped[category]
                return (
                  <div key={category}>
                    <div className="flex justify-center py-3 sm:py-4 md:py-5 mb-5 sm:mb-6 md:mb-8">
                      <div className="flex items-center gap-2 w-full max-w-md">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                          <div className="w-1.5 h-1.5 bg-[#4a5d4e]/50 rounded-full" />
                          <div className="w-1 h-1 bg-[#4a5d4e]/40 rounded-full" />
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60"></div>
                      </div>
                    </div>
                    <TwoColumnLayout singleTitle={category} centerContent={true}>
                      {(() => {
                        if (members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.Name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Pair row-by-row for other categories as well
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-2 sm:px-3 md:px-4">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-2 sm:px-3 md:px-4">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
            </>
            )}
            </div>
          </div>
        </div>
      </div>
      </section>
      
      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" />
    </div>
  )
}