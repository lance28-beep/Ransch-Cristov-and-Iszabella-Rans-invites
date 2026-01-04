"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Mail, Users, MapPin, Calendar, Crown } from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Image from "next/image"
import { motion } from "motion/react"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
})

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

export function BookOfGuests() {
  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  return (
    <div
      id="guests"
      className="relative z-[5] bg-[#FAF9F5] py-4 sm:py-8 md:py-12 lg:py-16 overflow-hidden"
    >
      {/* Torn paper edge at top */}
      {/* <TornPaperEdge position="top" /> */}
      
      {/* Bear decorations */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {bearImages[0] && (
          <motion.div
            className="absolute top-[8%] left-[3%] w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 opacity-50"
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
            className="absolute bottom-[10%] right-[3%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-50"
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
      
      {/* Paper texture background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
          }}
        />
      </div>
      
      {/* Torn paper edge at bottom */}
      {/* <TornPaperEdge position="bottom" zIndex={1} /> */}

      {/* Section Header - More Compact */}
      <div className="relative z-10 text-center mb-3 sm:mb-4 md:mb-6 px-2 sm:px-3 md:px-4">
        {/* Small label */}
        <p
          className={`${cormorant.className} text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-[#4a5d4e] mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-1 sm:mb-1.5 font-light`}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
        >
          Our Cherished Guests
        </p>

        <h2
          className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e] mb-1 sm:mb-2 md:mb-3"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          Book of Guests
        </h2>

        <p className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/80 font-light max-w-lg mx-auto leading-tight px-2`} style={{ fontWeight: 300 }}>
          See who&apos;s celebrating with us on our special day
        </p>

        {/* Decorative element - Smaller */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5 md:mt-3">
          <div className="w-6 sm:w-10 md:w-12 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-transparent" />
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#4a5d4e]/60 rounded-full" />
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#4a5d4e]/40 rounded-full" />
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#4a5d4e]/60 rounded-full" />
          <div className="w-6 sm:w-10 md:w-12 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-transparent" />
        </div>
      </div>

      {/* Guests content */}
      <div className="relative">
        {/* Stats card - Simplified */}
        <div className="text-center mb-2.5 sm:mb-4 md:mb-6 px-2 sm:px-4 md:px-6">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative bg-[#FAF9F5]/98 backdrop-blur-md border border-[#D0D0D0]/40 rounded-lg sm:rounded-xl p-3 sm:p-5 md:p-6 shadow-md">
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.02] rounded-lg sm:rounded-xl pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                                  repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
                }}
              />
              
              {/* Refresh button */}
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full bg-[#4a5d4e]/10 hover:bg-[#4a5d4e]/20 transition-all duration-300 disabled:opacity-50 group z-10"
                title="Refresh counts"
              >
                <RefreshCw className={`h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#4a5d4e] transition-transform ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} duration-500`} />
              </button>

              {/* Main Count with inline text */}
              <div className="mb-1.5 sm:mb-2.5 relative">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className={`${cormorant.className} text-xl sm:text-3xl md:text-4xl font-bold text-[#243127] transition-all duration-500 ${showIncrease ? 'scale-110 text-green-600' : ''}`} style={{ fontWeight: 300 }}>
                    {totalGuests}
                  </h3>
                  {showIncrease && (
                    <TrendingUp className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-green-600 animate-bounce" />
                  )}
                  <p className={`${cormorant.className} text-sm sm:text-lg md:text-xl text-[#243127] font-medium leading-tight`} style={{ fontWeight: 300 }}>
                    {totalGuests === 1 ? "Guest" : "Guests"} Celebrating With Us
                  </p>
                </div>
              </div>

              {/* RSVP Count */}
              <p className={`${cormorant.className} text-xs sm:text-base text-[#4a5d4e]/80 mb-2 sm:mb-3 relative`} style={{ fontWeight: 300 }}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              
              {/* Message */}
              <p className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/80 leading-tight relative`} style={{ fontWeight: 300 }}>
                Thank you for confirming your RSVP! Your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* Guest List Display */}
        {confirmedGuests.length > 0 && (
          <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {confirmedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="relative group bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#4a5d4e]/40"
                >
                  {/* Guest Header */}
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-2.5 md:mb-3">
                    {/* Avatar - Mobile Optimized */}
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#4a5d4e] to-[#5a6f5e] flex items-center justify-center shadow-md ring-2 ring-white/50">
                        <span className={`${cormorant.className} text-white font-semibold text-xs sm:text-base md:text-lg`} style={{ fontWeight: 300 }}>
                          {getInitials(guest.name)}
                        </span>
                      </div>
                      {/* VIP Badge - Mobile Optimized */}
                      {guest.isVip && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-md">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3.5 md:w-3.5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Guest Info - Mobile Optimized */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 sm:mb-1.5">
                        <h3 className={`${cormorant.className} text-xs sm:text-base md:text-lg font-semibold sm:font-bold text-[#243127] leading-tight mb-0.5`} style={{ fontWeight: 300 }}>
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs text-[#4a5d4e] font-medium`} style={{ fontWeight: 300 }}>
                            {guest.role}
                          </p>
                        )}
                      </div>

                      {/* Email - Mobile Optimized */}
                      {guest.email && (
                        <div className="flex items-center gap-1 mb-1.5 sm:mb-2 md:mb-3">
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#4a5d4e]/60 flex-shrink-0" />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs text-[#4a5d4e]/70 truncate`} style={{ fontWeight: 300 }}>{guest.email}</span>
                        </div>
                      )}

                      {/* Info Badges - Mobile Optimized */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                        {/* Guest count badge */}
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-[#4a5d4e]/10 to-[#4a5d4e]/5 border border-[#4a5d4e]/30 rounded sm:rounded-md md:rounded-lg">
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-[#4a5d4e]" />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#4a5d4e]`} style={{ fontWeight: 300 }}>
                            {guest.allowedGuests} {guest.allowedGuests === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>

                        {/* Table badge */}
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-[#4a5d4e]/15 to-[#4a5d4e]/10 border border-[#4a5d4e]/40 sm:border-2 rounded sm:rounded-md md:rounded-lg">
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-[#4a5d4e]" />
                          <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold sm:font-bold text-[#4a5d4e]`} style={{ fontWeight: 300 }}>
                            {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                              <>Table {guest.tableNumber}</>
                            ) : (
                              <span className={`${cormorant.className} text-gray-500 font-medium`} style={{ fontWeight: 300 }}>Not Assigned</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Message - Mobile Optimized */}
                      {guest.message && guest.message.trim() !== "" && (
                        <div className="relative mb-1.5 sm:mb-2.5 md:mb-3 p-2 sm:p-3 md:p-5 bg-gradient-to-br from-[#FAF9F5] via-white to-[#FAF9F5] rounded sm:rounded-lg md:rounded-2xl border border-[#4a5d4e]/30 shadow-sm overflow-hidden">
                          {/* Decorative corner elements - smaller on mobile */}
                          <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.08]">
                            <svg viewBox="0 0 100 100" className="text-[#4a5d4e]" fill="currentColor">
                              <path d="M0,0 L100,0 L0,100 Z" />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-[0.08]">
                            <svg viewBox="0 0 100 100" className="text-[#4a5d4e]" fill="currentColor">
                              <path d="M100,100 L0,100 L100,0 Z" />
                            </svg>
                          </div>
                          
                          {/* Opening quote - smaller on mobile */}
                          <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2 text-[#4a5d4e]/25">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                            </svg>
                          </div>
                          
                          {/* Closing quote - smaller on mobile */}
                          <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 text-[#4a5d4e]/25">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7l-2 4v6h6v-6h-3z" />
                            </svg>
                          </div>

                          {/* Message content */}
                          <div className="relative px-0.5 sm:px-1">
                            <p className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#243127] leading-tight sm:leading-relaxed italic font-medium`} style={{ fontWeight: 300 }}>
                              {guest.message}
                            </p>
                          </div>

                          {/* Elegant border accent - smaller on mobile */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-0.5 md:w-1 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-transparent via-[#4a5d4e]/40 to-transparent rounded-r-full" />
                        </div>
                      )}

                      {/* Companions - Mobile Optimized */}
                      {guest.companions && guest.companions.length > 0 && (
                        <div className="pt-1.5 sm:pt-2 md:pt-2.5 border-t border-gray-100">
                          <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-[#4a5d4e]" />
                            <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#243127]`} style={{ fontWeight: 300 }}>Companions</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {guest.companions.map((companion, idx) => (
                              <div key={idx} className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-white border border-[#4a5d4e]/30 rounded sm:rounded-md md:rounded-lg hover:border-[#4a5d4e]/50 transition-colors">
                                <span className={`${cormorant.className} text-[9px] sm:text-[10px] md:text-xs font-medium text-[#243127]`} style={{ fontWeight: 300 }}>{companion.name}</span>
                                {companion.relationship && (
                                  <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] text-[#4a5d4e]/70 bg-gray-50 px-1 sm:px-1.5 py-0.5 rounded-full`} style={{ fontWeight: 300 }}>
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer - Mobile Optimized */}
                      <div className="flex items-center gap-1 pt-1.5 sm:pt-2 md:pt-2.5 mt-1.5 sm:mt-2 md:mt-2.5 border-t border-gray-100">
                        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#4a5d4e]/60" />
                        <span className={`${cormorant.className} text-[8px] sm:text-[9px] md:text-[10px] text-[#4a5d4e]/70`} style={{ fontWeight: 300 }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
