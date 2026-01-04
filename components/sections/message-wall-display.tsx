"use client"

import { Card, CardContent } from "@/components/sections/ui/card"
import { Skeleton } from "@/components/sections/ui/skeleton"
import { Heart, MessageCircle, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageWallDisplayProps {
  messages: Message[]
  loading: boolean
}

export default function MessageWallDisplay({ messages, loading }: MessageWallDisplayProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (messages.length > 0) {
      setIsAnimating(true)
      // Stagger the animation of messages
      const timer = setTimeout(() => {
        setVisibleMessages(messages)
        setIsAnimating(false)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setVisibleMessages([])
    }
  }, [messages])

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-[#4a5d4e]/30 shadow-md bg-white rounded-sm">
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4a5d4e]/20" />
                  <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3 w-24 sm:w-32 bg-[#4a5d4e]/10" />
                    <Skeleton className="h-2.5 w-20 sm:w-24 bg-[#4a5d4e]/10" />
                  </div>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-[#4a5d4e]/10" />
                </div>
              </div>
              <Skeleton className="h-12 sm:h-14 md:h-16 w-full bg-[#4a5d4e]/5 rounded-sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20 px-2 sm:px-4">
        <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#4a5d4e] rounded-full flex items-center justify-center mx-auto shadow-md">
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
          </div>
        </div>
        <h3 className={`${cormorant.className} text-xl sm:text-2xl md:text-3xl font-semibold text-[#4a5d4e] mb-2 sm:mb-3 md:mb-4`} style={{ fontWeight: 300, textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
          No Messages Yet
        </h3>
        <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-[#4a5d4e]/80 font-light max-w-md mx-auto leading-relaxed mb-4 sm:mb-5 md:mb-6`} style={{ fontWeight: 300 }}>
          Be the first to share your heartfelt wishes for Ransch Cristov and Iszabella!
        </p>
        <div className="mt-4 sm:mt-5 md:mt-6 flex justify-center">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-[#4a5d4e]/30 rounded-sm shadow-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#4a5d4e]/70 animate-pulse" />
            <span className={`${cormorant.className} text-[10px] sm:text-xs md:text-sm text-[#4a5d4e]/80`} style={{ fontWeight: 300 }}>Your message will appear here</span>
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#4a5d4e]/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {visibleMessages.map((msg, index) => (
        <Card
          key={index}
          className={`relative border border-[#D0D0D0]/40 shadow-md bg-gradient-to-br from-white via-[#FAF9F5] to-white hover:shadow-xl hover:border-[#4a5d4e]/50 transition-all duration-500 group overflow-hidden transform rounded-lg sm:rounded-xl md:rounded-2xl hover:scale-[1.01] ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            animation: isAnimating ? 'none' : 'fadeInUp 0.6s ease-out forwards',
            boxShadow: '0 4px 12px rgba(74,93,78,0.12), 0 2px 6px rgba(74,93,78,0.08)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,93,78,0.2), 0 4px 12px rgba(74,93,78,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(74,93,78,0.12), 0 2px 6px rgba(74,93,78,0.08)';
          }}
        >
          {/* Elegant paper texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
          }} />
          
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300">
            <svg viewBox="0 0 100 100" className="text-[#4a5d4e]" fill="currentColor">
              <path d="M0,0 L100,0 L0,100 Z" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300">
            <svg viewBox="0 0 100 100" className="text-[#4a5d4e]" fill="currentColor">
              <path d="M100,100 L0,100 L100,0 Z" />
            </svg>
          </div>
          
          {/* Elegant top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4a5d4e]/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
          
          <CardContent className="relative p-4 sm:p-5 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-5">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Enhanced Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#4a5d4e] via-[#5a6f5e] to-[#4a5d4e] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ring-2 ring-white/60 group-hover:ring-[#4a5d4e]/30">
                    <span className={`${cormorant.className} text-white text-sm sm:text-base md:text-lg font-semibold`} style={{ fontWeight: 400 }}>
                      {msg.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </span>
                  </div>
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-[#4a5d4e]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                
                {/* Name and Date */}
                <div className="min-w-0 flex-1">
                  <h4 className={`${cormorant.className} text-[#243127] text-sm sm:text-base md:text-lg font-semibold mb-1 group-hover:text-[#4a5d4e] transition-colors duration-300`} style={{ fontWeight: 400 }}>
                    {msg.name}
                  </h4>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`${cormorant.className} text-[10px] sm:text-xs text-[#4a5d4e]/70 font-light`} style={{ fontWeight: 300 }}>
                      {new Date(msg.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-[#4a5d4e]/40">•</span>
                    <span className={`${cormorant.className} text-[10px] sm:text-xs text-[#4a5d4e]/70 font-light`} style={{ fontWeight: 300 }}>
                      {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Heart Icon */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="p-1.5 sm:p-2 rounded-full bg-[#4a5d4e]/5 group-hover:bg-[#4a5d4e]/10 transition-colors duration-300">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-[#4a5d4e]/60 fill-[#4a5d4e]/20 group-hover:fill-[#4a5d4e]/40 group-hover:text-[#4a5d4e] transition-all duration-300" />
                </div>
              </div>
            </div>
            
            {/* Message Content with Enhanced Quote Styling */}
            <div className="relative pl-2 sm:pl-3 md:pl-4">
              {/* Left border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-[#4a5d4e]/30 via-[#4a5d4e]/40 to-[#4a5d4e]/30 rounded-full group-hover:from-[#4a5d4e]/50 group-hover:via-[#4a5d4e]/60 group-hover:to-[#4a5d4e]/50 transition-all duration-300" />
              
              {/* Opening quote - decorative */}
              <div className="absolute -left-1 -top-2 sm:-left-2 sm:-top-3 md:-left-3 md:-top-4 text-[#4a5d4e]/15 group-hover:text-[#4a5d4e]/25 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>
              
              {/* Message text */}
              <div className="relative pl-4 sm:pl-6 md:pl-8 pr-2">
                <p className={`${cormorant.className} text-[#243127] text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose font-light italic group-hover:text-[#4a5d4e] transition-colors duration-300`} style={{ fontWeight: 300 }}>
                  {msg.message}
                </p>
              </div>
              
              {/* Closing quote - decorative */}
              <div className="absolute -right-1 -bottom-2 sm:-right-3 md:-right-4 text-[#4a5d4e]/15 group-hover:text-[#4a5d4e]/25 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7l-2 4v6h6v-6h-3z" />
                </svg>
              </div>
            </div>
            
            {/* Elegant bottom accent */}
            <div className="mt-4 sm:mt-5 md:mt-6 flex items-center justify-end">
              <div className="flex items-center gap-2">
                <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/30 to-[#4a5d4e]/30 group-hover:via-[#4a5d4e]/50 group-hover:to-[#4a5d4e]/50 transition-all duration-300" />
                <div className="w-1 h-1 rounded-full bg-[#4a5d4e]/30 group-hover:bg-[#4a5d4e]/50 transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
