"use client"

import React, { useState, useEffect } from "react"
import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import { Cormorant_Garamond } from "next/font/google"
import { QRCodeSVG } from "qrcode.react"
import { Navigation, Copy, Check } from "lucide-react"
import Image from "next/image"
import { motion } from "motion/react"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
})

const timelineEvents = [
  { label: "ARRIVAL", image: "/timeline/GuestArrival.png" },
  { label: "CEREMONY", image: "/timeline/Wedding Ceremony.png", time: siteConfig.ceremony.time },
  { label: "PHOTOS", image: "/timeline/PhotoTaking.png" },
  { label: "PICA-PICA", image: "/timeline/peca peca.png" },
  { label: "LUNCH", image: "/timeline/lunch.png" },
  { label: "SEND-OFF", image: "/timeline/Send-off.png" },
]

// Color palette for attire section
const attireColors = ["#E6D9F2", "#D4E6F1", "#FFE5E8", "#D4E6F1", "#FFE5E8"]

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])
  const ceremonyLocation = siteConfig.ceremony.location
  const receptionLocation = siteConfig.reception.location
  const ceremonyMapsLink = `https://maps.google.com/?q=${encodeURIComponent(ceremonyLocation)}`
  const receptionMapsLink = `https://maps.google.com/?q=${encodeURIComponent(receptionLocation)}`

  const openInMaps = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer")
  }

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

  return (
    <Section
      id="details"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-[#FAF9F5]"
    >
      {/* Torn paper edge at top */}
      <TornPaperEdge position="top" />
      
      {/* Bear decorations */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {bearImages[0] && (
          <motion.div
            className="absolute top-[12%] right-[4%] w-11 h-11 sm:w-15 sm:h-15 md:w-19 md:h-19 opacity-50"
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
            className="absolute bottom-[15%] left-[4%] w-13 h-13 sm:w-17 sm:h-17 md:w-21 md:h-21 opacity-50"
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
      
      {/* Simple paper texture background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle paper texture effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                          repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
        }} />
        {/* Soft sage green accents */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#4a5d4e]/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#4a5d4e]/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 
            className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e] mb-2"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            The Details
          </h2>
        </div>

        {/* Timeline Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 
              className={`${cormorant.className} text-xl sm:text-2xl md:text-3xl text-[#4a5d4e] mb-3 sm:mb-4 text-center font-light`}
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
            >
              Timeline
            </h3>
            {/* Date and Time below Timeline label */}
            <div className={`${cormorant.className} text-sm sm:text-base md:text-lg text-[#4a5d4e]/90 font-light`}>
              <p className="mb-1">{siteConfig.ceremony.date}</p>
              <p className="text-xs sm:text-sm text-[#4a5d4e]/80">
                {siteConfig.ceremony.day} • {siteConfig.ceremony.time}
              </p>
            </div>
          </div>
          
          <div className="relative px-2 sm:px-4 md:px-6">
            {/* Enhanced horizontal connecting line with dots - desktop */}
            <div className="hidden sm:flex absolute top-20 md:top-24 left-4 right-4 items-center z-0">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/25 to-[#4a5d4e]/30" />
              {timelineEvents.slice(1).map((_, idx) => (
                <React.Fragment key={idx}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]/30 mx-1" />
                  <div className="flex-1 h-px bg-gradient-to-r from-[#4a5d4e]/30 via-[#4a5d4e]/25 to-[#4a5d4e]/30" />
                </React.Fragment>
              ))}
            </div>
            
            {/* Mobile connecting lines - between rows */}
            <div className="sm:hidden absolute top-20 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/20 to-transparent" />
            <div className="sm:hidden absolute top-[15.5rem] left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/20 to-transparent" />
            
            <div className="grid grid-cols-3 sm:flex sm:justify-center gap-4 sm:gap-4 md:gap-6 lg:gap-8 relative items-start">
              {timelineEvents.map((event) => {
                return (
                  <div 
                    key={event.label} 
                    className="flex flex-col items-center gap-3 sm:gap-4 flex-1 sm:flex-initial group"
                  >
                    {/* Image with enhanced styling */}
                    <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4a5d4e]/5 to-transparent rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
                      <Image
                        src={event.image}
                        alt={event.label}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain drop-shadow-md relative z-10"
                      />
                    </div>
                    {/* Label below image */}
                    <p 
                      className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e] font-light text-center mt-1`}
                      style={{ 
                        letterSpacing: "0.02em",
                        textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                      }}
                    >
                      {event.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* What to Wear Section */}
        <div className="mb-10 sm:mb-12">
          <h3 
            className="style-script-regular text-2xl sm:text-3xl text-[#4a5d4e] mb-4 text-center"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            What to wear
          </h3>
          <div 
            className={`${cormorant.className} text-center space-y-4 text-[#4a5d4e] font-light`}
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            <p className="text-base sm:text-lg font-semibold uppercase tracking-wider">
              SEMI-FORMAL ATTIRE
            </p>
            <p className="text-sm sm:text-base">We'd love to see you on these colors.</p>
            <div className="flex justify-center gap-3 py-2">
              {attireColors.map((color, index) => (
                <div
                  key={index}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#4a5d4e]/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="space-y-2 text-sm sm:text-base pt-2">
              <p>Gentlemen: Long sleeves polo and slacks</p>
              <p>Ladies: Floor length dress</p>
            </div>
          </div>
        </div>

        {/* A Note on Gifts Section */}
        <div className="mb-10 sm:mb-12 text-center">
          <h3 
            className="style-script-regular text-2xl sm:text-3xl text-[#4a5d4e] mb-4"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            A note on gifts
          </h3>
          <div 
            className={`${cormorant.className} text-[#4a5d4e]/85 text-sm sm:text-base space-y-2 max-w-2xl mx-auto font-light leading-relaxed`}
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            <p>As love is what the day is all about,</p>
            <p>your presence is one we can't celebrate without.</p>
            <p>But should you still believe</p>
            <p>that a gift is worth giving,</p>
            <p>a monetary one would be warmly appreciated</p>
            <p>as we begin our new life.</p>
          </div>
        </div>

        {/* Unplugged Ceremony Section */}
        <div className="mb-10 sm:mb-12 text-center">
          <h3 
            className="style-script-regular text-2xl sm:text-3xl text-[#4a5d4e] mb-4"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            Unplugged Ceremony
          </h3>
          <div 
            className={`${cormorant.className} text-[#4a5d4e]/85 text-sm sm:text-base space-y-2 max-w-2xl mx-auto font-light leading-relaxed`}
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            <p>We invite you to be fully present</p>
            <p>with us during our ceremony.</p>
            <p>Please turn off your phones and cameras and</p>
            <p>enjoy this special moment.</p>
          </div>
        </div>

        {/* How To Get There Section */}
        <div className="mb-8 text-center">
          <h3 
            className="style-script-regular text-2xl sm:text-3xl text-[#4a5d4e] mb-4"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            How To Get There?
          </h3>
          <div 
            className={`${cormorant.className} text-[#4a5d4e] text-sm sm:text-base space-y-4 font-light`}
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
            }}
          >
            <p>Scan the QR codes</p>
            <p>with your phone</p>
            <p>to get the direction via</p>
            <p className="font-semibold">Google Maps.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-6 max-w-2xl mx-auto">
              {/* Ceremony QR Code */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 sm:w-44 sm:h-44 border-2 border-[#4a5d4e]/30 bg-white p-3 flex items-center justify-center shadow-sm rounded-sm">
                  <QRCodeSVG
                    value={ceremonyMapsLink}
                    size={160}
                    level="H"
                    includeMargin={false}
                    fgColor="#4a5d4e"
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <p 
                    className={`${cormorant.className} text-sm font-semibold text-[#4a5d4e] uppercase tracking-wider`}
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
                  >
                    CEREMONY
                  </p>
                  <div 
                    className={`${cormorant.className} text-xs text-[#4a5d4e]/85 space-y-1 font-light`}
                    style={{ 
                      letterSpacing: "0.02em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                    }}
                  >
                    <p className="font-semibold">{siteConfig.ceremony.venue}</p>
                    <p className="leading-relaxed">{ceremonyLocation}</p>
                  </div>
                  <div className="mt-3 flex gap-2 w-full">
                    <button
                      onClick={() => openInMaps(ceremonyMapsLink)}
                      className={`${cormorant.className} flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4a5d4e] text-white rounded-sm hover:bg-[#3d4d3f] transition-colors text-xs sm:text-sm font-semibold shadow-sm`}
                    >
                      <Navigation className="w-4 h-4" />
                      Open in Maps
                    </button>
                    <button
                      onClick={() => copyToClipboard(ceremonyLocation, "ceremony")}
                      className={`${cormorant.className} flex items-center justify-center gap-2 px-4 py-2 border border-[#4a5d4e]/30 text-[#4a5d4e] rounded-sm hover:bg-[#4a5d4e]/5 hover:border-[#4a5d4e]/40 transition-colors text-xs sm:text-sm font-semibold shadow-sm`}
                    >
                      {copiedItems.has("ceremony") ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reception QR Code */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 sm:w-44 sm:h-44 border-2 border-[#4a5d4e]/30 bg-white p-3 flex items-center justify-center shadow-sm rounded-sm">
                  <QRCodeSVG
                    value={receptionMapsLink}
                    size={160}
                    level="H"
                    includeMargin={false}
                    fgColor="#4a5d4e"
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <p 
                    className={`${cormorant.className} text-sm font-semibold text-[#4a5d4e] uppercase tracking-wider`}
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
                  >
                    RECEPTION
                  </p>
                  <div 
                    className={`${cormorant.className} text-xs text-[#4a5d4e]/85 space-y-1 font-light`}
                    style={{ 
                      letterSpacing: "0.02em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
                    }}
                  >
                    <p className="font-semibold">{siteConfig.reception.venue}</p>
                    <p className="leading-relaxed">{receptionLocation}</p>
                  </div>
                  <div className="mt-3 flex gap-2 w-full">
                    <button
                      onClick={() => openInMaps(receptionMapsLink)}
                      className={`${cormorant.className} flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4a5d4e] text-white rounded-sm hover:bg-[#3d4d3f] transition-colors text-xs sm:text-sm font-semibold shadow-sm`}
                    >
                      <Navigation className="w-4 h-4" />
                      Open in Maps
                    </button>
                    <button
                      onClick={() => copyToClipboard(receptionLocation, "reception")}
                      className={`${cormorant.className} flex items-center justify-center gap-2 px-4 py-2 border border-[#4a5d4e]/30 text-[#4a5d4e] rounded-sm hover:bg-[#4a5d4e]/5 hover:border-[#4a5d4e]/40 transition-colors text-xs sm:text-sm font-semibold shadow-sm`}
                    >
                      {copiedItems.has("reception") ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Torn paper edge at bottom */}
      {/* <TornPaperEdge position="bottom" /> */}
    </Section>
  )
}
