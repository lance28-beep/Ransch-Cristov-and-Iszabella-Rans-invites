"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/section"
import { Cormorant_Garamond } from "next/font/google"
import { siteConfig } from "@/content/site"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Image from "next/image"
import { motion } from "motion/react"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
})

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "When is the baptism and birthday celebration?",
    answer:
      `Ransch Cristov and Iszabella Rans's baptism will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day}) at ${siteConfig.ceremony.time}. We are also celebrating the 1st Birthday of Ransch Cristov Penales. We kindly ask guests to arrive earlier than 9:00 AM to help us begin promptly.`,
  },
  {
    question: "Where will the baptism and reception take place?",
    answer:
      `The baptism ceremony will be held at ${siteConfig.ceremony.location}. The reception will follow at ${siteConfig.reception.location}. You can find detailed directions, addresses, and maps in the Details section above.`,
  },
  {
    question: "What time should I arrive?",
    answer:
      `Kindly arrive earlier than 9:00 AM so we can begin the baptism ceremony promptly at exactly ${siteConfig.ceremony.time}. Your punctuality means so much to us!`,
  },
  {
    question: "How do I RSVP?",
    answer:
      `Please RSVP on or before January 7, 2026 through the RSVP section on this invitation. Simply search for your name in the guest list, confirm your attendance, and let us know if you'll be bringing companions. We kindly ask for your response to help us prepare for this special day.`,
  },
  {
    question: "Can I bring a plus one or additional guests?",
    answer:
      "Yes, you are welcome to bring additional guests. Please make sure to register their names in the RSVP section so we can properly accommodate everyone and ensure seats are reserved for your party.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, parking is available at both venues. Please follow the parking signs and instructions from our venue coordinators.",
  },
  {
    question: "What should I give as a gift?",
    answer:
      "Your presence and prayers are what we request most. However, if you desire to give a gift to Ransch Cristov and Iszabella, your thoughtful gesture would be humbly appreciated.",
  },
  {
    question: "Can I take photos and videos during the ceremony?",
    answer:
      "Yes, we are allowing and encouraging everyone to take photos! We would love to capture all these special moments through your perspective. We also kindly request that you upload all those captured moments through our Snap & Share section so we can all relive these beautiful memories together.",
  },
  {
    question: "Where can I access baptism photos and resources?",
    answer:
      "You can access all our baptism photos, videos, and other resources through our [DRIVE_LINK]Google Drive folder[/DRIVE_LINK]. Feel free to download and share your favorite memories!",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section
      id="faq"
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
            className="absolute bottom-[12%] left-[3%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-50"
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
      
      {/* Torn paper edge at bottom */}
      {/* <TornPaperEdge position="bottom" /> */}

      {/* Section Header */}
      <div className="relative z-10 text-center mb-6 sm:mb-9 md:mb-12 px-3 sm:px-4">
        {/* Small label */}
        <p
          className={`${cormorant.className} text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-[#4a5d4e] mb-2 font-light`}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
        >
          Questions & Answers
        </p>

        <h2
          className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e] mb-1.5 sm:mb-3 md:mb-4"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          Frequently Asked Questions
        </h2>

        {/* Simple divider */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-transparent" />
          <div className="w-1.5 h-1.5 bg-[#4a5d4e]/60 rounded-full" />
          <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-transparent" />
        </div>
      </div>

      {/* FAQ content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-5">
        {/* Main card */}
        <div className="relative bg-[#FAF9F5]/98 backdrop-blur-md border border-[#D0D0D0]/40 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md overflow-hidden">
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                              repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
            }}
          />
          
          {/* FAQ items */}
          <div className="relative p-2.5 sm:p-4 md:p-5 lg:p-6">
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-item-${index}`
                return (
                  <div
                    key={index}
                    className="rounded-lg sm:rounded-xl border border-[#D0D0D0]/40 bg-white/50 hover:border-[#4a5d4e]/60 hover:bg-white/70 transition-all duration-300 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="group w-full px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4a5d4e]/50 focus-visible:ring-offset-2 transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <span className={`${cormorant.className} font-semibold text-[#243127] pr-2 sm:pr-3 md:pr-4 text-xs sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-relaxed transition-colors duration-200 group-hover:text-[#4a5d4e]`} style={{ fontWeight: 300 }}>
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#4a5d4e]/60 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#4a5d4e]" : ""} w-4 h-4 sm:w-5 sm:h-5`}
                        aria-hidden
                      />
                    </button>

                    <div
                      id={contentId}
                      role="region"
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-2.5 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white/30 border-t border-[#D0D0D0]/40">
                          {item.answer.includes("[RSVP_LINK]") ? (
                            <p className={`${cormorant.className} text-[#243127] font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ fontWeight: 300 }}>
                              {item.answer.split("[RSVP_LINK]")[0]}
                              <a 
                                href="#guest-list" 
                                className="text-[#4a5d4e] underline font-bold hover:text-[#4a5d4e]/80 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault()
                                  document.getElementById('guest-list')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                              >
                                {item.answer.match(/\[RSVP_LINK\](.*?)\[\/RSVP_LINK\]/)?.[1]}
                              </a>
                              {item.answer.split("[/RSVP_LINK]")[1]}
                            </p>
                          ) : item.answer.includes("[DRIVE_LINK]") ? (
                            <p className={`${cormorant.className} text-[#243127] font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ fontWeight: 300 }}>
                              {item.answer.split("[DRIVE_LINK]")[0]}
                              <a 
                                href={siteConfig.snapShare?.googleDriveLink || "https://drive.google.com/drive/folders/16b-2VJUznEKhimziZo8NjML0i7E0Fs19?usp=sharing"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4a5d4e] underline font-bold hover:text-[#4a5d4e]/80 transition-colors"
                              >
                                {item.answer.match(/\[DRIVE_LINK\](.*?)\[\/DRIVE_LINK\]/)?.[1]}
                              </a>
                              {item.answer.split("[/DRIVE_LINK]")[1]}
                            </p>
                          ) : (
                            <p className={`${cormorant.className} text-[#243127] font-medium leading-relaxed sm:leading-loose text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line tracking-wide`} style={{ fontWeight: 300 }}>
                              {item.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
