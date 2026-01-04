"use client"

import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import {
  Clock,
  Utensils,
  Car,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const ceremonyLocation = siteConfig.ceremony.location
  const receptionLocation = siteConfig.reception.location

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showImageModal) {
        setShowImageModal(null)
      }
    }

    if (showImageModal) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [showImageModal])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Generate Google Maps links
  const ceremonyMapsLink = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.ceremony.location)}`
  const receptionMapsLink = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.reception.location)}`

  const openInMaps = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer")
  }

  return (
    <Section
      id="details"
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden"
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

      {/* Header */}
      <div className="relative z-30 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Main Label */}
        <div className="space-y-4 sm:space-y-6">
          <h2
            className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#4a5d4e]"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
            }}
          >
            Details
          </h2>
        </div>

        {/* Sub-label */}
        <div className="space-y-4 sm:space-y-6">
          <p
            className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] font-light uppercase tracking-[0.15em]`}
            style={{ 
              letterSpacing: "0.15em",
              textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            Ceremony & Reception Details
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/40" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/30 border border-[#4a5d4e]/40" />
          <span className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
        </div>
      </div>

      {/* Ceremony & Reception Locations (separate cards) */}
      <div className="relative z-10 mb-4 sm:mb-8 max-w-6xl mx-auto px-3 sm:px-5 space-y-3 sm:space-y-4">
        <div className="text-center text-[#4a5d4e]/90">
          <p className={`${cormorant.className} text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light`}>
            Ceremony &amp; Reception Location
          </p>
          <p className={`${cormorant.className} text-sm sm:text-base md:text-lg font-medium text-[#4a5d4e]`}>
            {ceremonyLocation} • {receptionLocation}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              key: "ceremony",
              label: "Ceremony",
              venue: siteConfig.ceremony.venue,
              location: siteConfig.ceremony.location,
              date: siteConfig.ceremony.date,
              time: siteConfig.ceremony.time,
              mapLink: ceremonyMapsLink,
              gradient: "from-[#187153] via-[#327B72] to-[#FACBC5]",
              image: "/Details/OurLadyofLourdesParishChurch.jpg",
            },
            {
              key: "reception",
              label: "Reception",
              venue: siteConfig.reception.venue,
              location: siteConfig.reception.location,
              date: siteConfig.reception.date,
              time: siteConfig.reception.time,
              mapLink: receptionMapsLink,
              gradient: "from-[#327B72] via-[#A98634] to-[#FACBC5]",
              image: "/Details/McClareResort.jpg",
            },
          ].map((info) => (
            <div
              key={info.key}
              className="overflow-hidden rounded-xl sm:rounded-2xl border border-[#4a5d4e]/30 bg-gradient-to-b shadow-[0_20px_60px_rgba(74,93,78,0.25)] transition-transform duration-500 group hover:scale-[1.01]"
              style={{ backgroundImage: undefined }}
            >
              {/* Top image */}
              <div className="relative h-52 sm:h-64 md:h-72 w-full">
                <Image
                  src={info.image}
                  alt={info.location}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a5d4e]/95 via-[#4a5d4e]/65 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end px-3 sm:px-6 pb-3 sm:pb-6 text-white">
                  <p className={`${cormorant.className} text-lg sm:text-xl md:text-2xl font-light uppercase tracking-[0.15em] leading-none drop-shadow-md`}>
                    {info.label}
                  </p>
                  <h3 className="style-script-regular text-2xl sm:text-3xl md:text-4xl font-normal leading-tight drop-shadow-lg">
                    {info.venue}
                  </h3>
                </div>
              </div>

              {/* Details panel */}
              <div className="bg-white/90 text-[#4a5d4e] px-3 sm:px-6 py-4 sm:py-6 space-y-4 backdrop-blur-sm">
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-left">
                    <div className="rounded-md border border-[#4a5d4e]/30 bg-white/95 px-2.5 py-2 shadow-sm">
                      <p className={`${cormorant.className} text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-[#4a5d4e] uppercase mb-0.5`}>
                        Date
                      </p>
                      <p className={`${cormorant.className} text-sm sm:text-base font-medium text-[#4a5d4e]`}>{info.date}</p>
                    </div>
                    <div className="rounded-md border border-[#4a5d4e]/30 bg-white/95 px-2.5 py-2 shadow-sm">
                      <p className={`${cormorant.className} text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-[#4a5d4e] uppercase mb-0.5`}>
                        {info.label}
                      </p>
                      <p className={`${cormorant.className} text-sm sm:text-base font-medium text-[#4a5d4e]`}>{info.time}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                  <button
                    onClick={() => openInMaps(info.mapLink)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-[#4a5d4e] text-white py-2.5 sm:py-3 shadow-lg hover:translate-y-[-2px] hover:bg-[#4a5d4e]/90 transition-all text-xs sm:text-sm font-semibold"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                  <button
                    onClick={() => copyToClipboard(info.location, info.key)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-[#4a5d4e]/35 text-[#4a5d4e] py-2.5 sm:py-3 hover:bg-[#4a5d4e]/10 transition-all text-xs sm:text-sm font-semibold"
                  >
                    {copiedItems.has(info.key) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Address
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information - Compact for mobile */}
      <div className="relative z-10 mb-4 sm:mb-7 max-w-4xl mx-auto px-3 sm:px-5">
        <div className="text-center mb-3 sm:mb-5">
          <h3 className={`${cormorant.className} text-base sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-[#4a5d4e]`}>
            Important Information
          </h3>
          <p className={`${cormorant.className} text-[11px] sm:text-xs md:text-sm text-[#4a5d4e]/90 max-w-xl mx-auto leading-relaxed font-light`}>
            Kindly take note of these details to help the day flow smoothly and beautifully.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Arrival Time & Reception Guidelines */}
          <div className="relative rounded-2xl border border-[#4a5d4e]/30 bg-white/85 backdrop-blur-lg shadow-[0_18px_40px_rgba(74,93,78,0.15)] p-3.5 sm:p-5 overflow-hidden">
            <div className="space-y-4 sm:space-y-5">
              {/* Arrival Time */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#4a5d4e]/40 shadow-xl bg-white/95 p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <h4 className={`${cormorant.className} text-[0.75rem] sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#4a5d4e] mb-3`}>
                    Arrival Time
                  </h4>
                  <div className="space-y-2 sm:space-y-2.5">
                    <p className={`${cormorant.className} text-xs sm:text-sm text-[#4a5d4e] leading-relaxed font-light`}>
                      Kindly arrive earlier than <span className="font-medium text-[#4a5d4e]">9:00 AM</span> so we can begin the baptism ceremony promptly at exactly <span className="font-medium text-[#4a5d4e]">9:00 AM</span>.
                    </p>
                    <p className={`${cormorant.className} text-xs sm:text-sm text-[#4a5d4e] leading-relaxed font-light`}>
                      Please arrive early as 9:00 AM
                    </p>
                  </div>
                </div>
              </div>

              {/* Reception Guidelines */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#4a5d4e]/40 shadow-xl bg-white/95 p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <h4 className={`${cormorant.className} text-[0.75rem] sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#4a5d4e] mb-3`}>
                    Reception Guidelines
                  </h4>
                  <div className="space-y-2 sm:space-y-2.5">
                    <p className={`${cormorant.className} text-xs sm:text-sm text-[#4a5d4e] leading-relaxed font-light`}>
                      Join us for the celebration following the baptism. Kindly confirm your attendance through the invitation form to help us prepare for this special day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Travel & Parking - Compact, matching narrative style */}
          <div className="relative rounded-2xl border border-[#4a5d4e]/30 bg-white/85 backdrop-blur-lg shadow-[0_18px_40px_rgba(74,93,78,0.15)] p-3.5 sm:p-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-2.5 sm:mb-3 relative z-10">
              <div className="p-1.5 rounded-full shadow-md bg-white/95 border border-[#4a5d4e]/40">
                <Car className="w-3.5 h-3.5 text-[#4a5d4e]" />
              </div>
              <h4 className={`${cormorant.className} font-semibold text-xs sm:text-base text-[#4a5d4e]`}>Parking &amp; Travel</h4>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Parking */}
              <div className="rounded-xl p-2.5 sm:p-3 border border-[#4a5d4e]/40 bg-white/95 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#4a5d4e]/90 text-white">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`${cormorant.className} text-[11px] sm:text-sm font-medium text-[#4a5d4e]`}>Parking Available</p>
                    <p className={`${cormorant.className} text-[10px] sm:text-xs text-[#4a5d4e]/85 font-light`}>
                      Parking is available at the venue. Please arrive early to find a comfortable spot.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transportation */}
              <div className="rounded-xl p-2.5 sm:p-3 border border-[#4a5d4e]/40 bg-white/95 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#4a5d4e]/90 text-white">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`${cormorant.className} text-[11px] sm:text-sm font-medium text-[#4a5d4e]`}>Transportation</p>
                    <p className={`${cormorant.className} text-[10px] sm:text-xs text-[#4a5d4e]/85 font-light`}>
                      Private vehicles and local transport are welcome. Coordinate with friends or family and plan your
                      route ahead of time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-xl p-2.5 sm:p-3 border border-[#4a5d4e]/30 bg-white/95">
                <p className={`${cormorant.className} text-[11px] sm:text-sm font-medium mb-2 flex items-center gap-2 text-[#4a5d4e]`}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4a5d4e]/10 text-[#4a5d4e]">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  Quick Tips
                </p>
                <ul className={`${cormorant.className} text-[10px] sm:text-xs space-y-1 text-[#4a5d4e]/90 font-light`}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4a5d4e] mt-0.5">•</span>
                    <span>Plan your route ahead to avoid unexpected delays.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4a5d4e] mt-0.5">•</span>
                    <span>Please avoid walking during the ceremony. Approach the coordinator or wait to be guided.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4a5d4e] mt-0.5">•</span>
                    <span>Coordinate carpooling with friends or family when possible.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(250, 203, 197, 0.96)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "#187153", opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "#327B72", opacity: 0.14, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-gradient-to-br from-white via-white rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "#1871531f", backgroundColor: "#FACBC5" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, #187153, #327B72, #FACBC5)" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-white backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "#FACBC5", borderColor: "#18715333", color: "#187153" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#187153] transition-colors" />
            </button>

            {/* Venue badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "#FACBC5", borderColor: "#18715333" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="#327B72" style={{ color: "#187153" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#187153" }}>
                      Ceremony Venue
                    </span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4" style={{ color: "#327B72" }} />
                    <span className="text-xs sm:text-sm font-bold" style={{ color: "#187153" }}>
                      Reception Venue
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "#FACBC5" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={showImageModal === "ceremony" ? "/Details/OurLadyofLourdesParishChurch.jpg" : "/Details/McClareResort.jpg"}
                alt={showImageModal === "ceremony" ? siteConfig.ceremony.location : siteConfig.reception.location}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-white to-white/95 backdrop-blur-sm border-t-2 relative"
              style={{ borderColor: "#1871531f", backgroundColor: "#FACBC5" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#187153]/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3"
                      style={{ color: "#187153" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6" fill="#327B72" style={{ color: "#187153" }} />
                      ) : (
                        <Utensils className="w-6 h-6" style={{ color: "#327B72" }} />
                      )}
                      {showImageModal === "ceremony" ? siteConfig.ceremony.venue : siteConfig.reception.venue}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-70" style={{ color: "#187153" }}>
                      <MapPin className="w-4 h-4" style={{ color: "#187153" }} />
                      <span>
                        {showImageModal === "ceremony"
                          ? siteConfig.ceremony.location
                          : siteConfig.reception.location}
                      </span>
                    </div>

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "#187153",
                          backgroundColor: "#FACBC5",
                          opacity: 0.9,
                          borderColor: "#18715333",
                        }}
                      >
                        <Clock className="w-4 h-4" style={{ color: "#187153" }} />
                        <span>
                          {siteConfig.ceremony.date} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "#187153",
                          backgroundColor: "#FACBC5",
                          opacity: 0.9,
                          borderColor: "#327B7233",
                        }}
                      >
                        <Clock className="w-4 h-4" style={{ color: "#327B72" }} />
                        <span>
                          {siteConfig.reception.date} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? siteConfig.ceremony.location
                            : siteConfig.reception.location,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-[#FACBC5]/25 whitespace-nowrap"
                      title="Copy address"
                      style={{ borderColor: "#18715333", color: "#187153" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap text-white"
                      style={{
                        background:
                          showImageModal === "ceremony"
                            ? "linear-gradient(to right, #187153, #327B72)"
                            : "linear-gradient(to right, #327B72, #FACBC5)",
                      }}
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                <div className="flex items-center gap-2 text-xs opacity-65" style={{ color: "#187153" }}>
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}