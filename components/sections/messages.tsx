"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { motion } from "motion/react"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/sections/ui/card"
import { Input } from "@/components/sections/ui/input"
import { Textarea } from "@/components/sections/ui/textarea"
import { Button } from "@/components/sections/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { Cormorant_Garamond } from "next/font/google"
import { siteConfig } from "@/content/site"
import Image from "next/image"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSe2e_jk_kHsttxkRKqr_3I9HwzDVcfK5gT3jUm9gkojJaZBpg/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      )

      toast({
        title: "Message Sent! 💌",
        description: "Your heartfelt wishes have been delivered",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()
      
      // Reset submitted state after animation
      setTimeout(() => setIsSubmitted(false), 1000)
      
      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto px-3 sm:px-0">
      {/* Style to override placeholder color */}
      <style>{`
        .message-form-input::placeholder {
          color: #4a5d4e !important;
          opacity: 0.5 !important;
        }
        .message-form-textarea::placeholder {
          color: #4a5d4e !important;
          opacity: 0.5 !important;
        }
      `}</style>
      
      {/* Simple decorative elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#4a5d4e]/10 rounded-full blur-sm" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#4a5d4e]/8 rounded-full blur-md" />
      
      <Card className={`relative w-full border border-[#4a5d4e]/30 shadow-[0_4px_16px_rgba(74,93,78,0.15)] bg-white transition-all duration-300 group overflow-hidden rounded-sm ${
        isFocused ? 'scale-[1.01] border-[#4a5d4e]/50 shadow-[0_6px_20px_rgba(74,93,78,0.2)]' : 'hover:shadow-[0_6px_20px_rgba(74,93,78,0.2)]'
      } ${isSubmitted ? 'animate-bounce' : ''}`}>
        {/* Simple paper texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                          repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
        }} />
        
        {/* Success animation overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 bg-[#4a5d4e]/10 flex items-center justify-center z-20 pointer-events-none">
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 bg-[#4a5d4e] rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p className={`${cormorant.className} text-[#4a5d4e] font-semibold text-lg`}>Sent!</p>
            </div>
          </div>
        )}
        
        <CardContent className="relative p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10">
          {/* Header with icon */}
          <div className="text-center mb-4 sm:mb-5 md:mb-6">
            <div className="relative inline-block mb-3 sm:mb-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#4a5d4e] rounded-full flex items-center justify-center mx-auto shadow-md">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
            </div>
            <h3 className={`${cormorant.className} text-lg sm:text-xl md:text-2xl font-semibold text-[#4a5d4e] mb-2 sm:mb-3`}>
              Share Your Love
            </h3>
            <p className={`${cormorant.className} text-xs sm:text-sm md:text-base text-[#4a5d4e]/80 font-light`}>
              Write a message that Ransch Cristov and Iszabella will enjoy reading as they grow older.
            </p>
          </div>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Name Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <label className={`${cormorant.className} block text-xs sm:text-sm md:text-base font-medium text-[#4a5d4e] flex items-center gap-1.5 sm:gap-2`}>
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#4a5d4e]/20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  focusedField === 'name' ? 'scale-110 bg-[#4a5d4e]/30' : ''
                }`}>
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#4a5d4e]" />
                </div>
                Your Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full Name"
                  className={`${cormorant.className} message-form-input w-full border border-[#4a5d4e]/30 rounded-sm py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base placeholder:italic transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-md ${
                    focusedField === 'name' 
                      ? 'border-[#4a5d4e] focus:border-[#4a5d4e] focus:ring-2 focus:ring-[#4a5d4e]/20' 
                      : 'hover:border-[#4a5d4e]/40'
                  }`}
                />
                {nameValue && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <label className={`${cormorant.className} block text-xs sm:text-sm md:text-base font-medium text-[#4a5d4e] flex items-center gap-1.5 sm:gap-2`}>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#4a5d4e]/20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    focusedField === 'message' ? 'scale-110 bg-[#4a5d4e]/30' : ''
                  }`}>
                    <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#4a5d4e]" />
                  </div>
                  Your Message
                </label>
                {messageValue && (
                  <span className={`${cormorant.className} text-[10px] sm:text-xs transition-colors ${
                    messageValue.length > 500 ? 'text-red-500' : 'text-[#4a5d4e]/60'
                  }`}>
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  name="message"
                  required
                  value={messageValue}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setMessageValue(e.target.value)
                    }
                  }}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={`Write a heartfelt message for Ransch Cristov and Iszabella... share your wishes, prayers, or words of love that they will enjoy reading in the future 💕`}
                  className={`${cormorant.className} message-form-textarea w-full border border-[#4a5d4e]/30 rounded-sm min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-xs sm:text-sm md:text-base placeholder:italic placeholder:leading-relaxed transition-all duration-300 resize-none bg-white shadow-sm hover:shadow-md focus:shadow-md py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 ${
                    focusedField === 'message' 
                      ? 'border-[#4a5d4e] focus:border-[#4a5d4e] focus:ring-2 focus:ring-[#4a5d4e]/20' 
                      : 'hover:border-[#4a5d4e]/40'
                  }`}
                />
                {messageValue && (
                  <div className="absolute right-3 top-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cormorant.className} w-full text-white py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 md:px-6 rounded-sm text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group border border-[#4a5d4e]`}
              style={{ 
                backgroundColor: "#4a5d4e",
                boxShadow: "0 4px 12px rgba(74,93,78,0.3), 0 2px 6px rgba(74,93,78,0.2)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "#3d4d3f";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,93,78,0.4), 0 3px 10px rgba(74,93,78,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4a5d4e";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(74,93,78,0.3), 0 2px 6px rgba(74,93,78,0.2)";
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Unexpected messages response; expected an array", data)
          setMessages([])
          setLoading(false)
          return
        }
        
        const parsed = data
          .filter((m) => m.name || m.message || m.timestamp)
          .reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <Section
      id="messages"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
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

      {/* Bear decorations */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {bearImages[0] && (
          <motion.div
            className="absolute top-[18%] left-[3%] w-11 h-11 sm:w-15 sm:h-15 md:w-19 md:h-19 opacity-50"
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
            className="absolute bottom-[22%] right-[3%] w-13 h-13 sm:w-17 sm:h-17 md:w-21 md:h-21 opacity-50"
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

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p
              className={`${cormorant.className} text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-[#4a5d4e] font-light`}
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
            >
              Leave a Message
            </p>
            <h2 className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e]" style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}>
              Share Your Wishes
            </h2>
            <p
              className={`${cormorant.className} text-sm sm:text-base md:text-lg lg:text-xl text-[#4a5d4e]/85 font-light max-w-2xl mx-auto leading-relaxed italic`}
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
              }}
            >
              Leave a heartfelt message that Ransch Cristov and Iszabella will treasure and enjoy reading as they grow. Your words of love, prayers, and wishes will become a beautiful keepsake they can look back on for years to come.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/50 border border-[#4a5d4e]/40" />
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </div>
        </div>

        {/* Form Section */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="relative max-w-xl w-full">
            {/* Card halo */}
            {/* <div className="absolute -inset-3 bg-gradient-to-br from-[#B28383]/25 via-[#EDD6AC]/20 to-transparent rounded-3xl blur-2xl opacity-70" />
            <div className="absolute -inset-1 bg-gradient-to-br from-[#A78256]/15 via-transparent to-transparent rounded-3xl blur-md opacity-80" /> */}
            <MessageForm onMessageSent={fetchMessages} />
            {/* Corner sparkles */}
            {/* <div className="pointer-events-none">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#BB8A3D] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CDAC77] rounded-full blur-[2px] opacity-80" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#CDAC77] rounded-full blur-[2px] opacity-70" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#BB8A3D] rounded-full blur-[2px] opacity-70" />
            </div> */}
          </div>
        </div>

        {/* Messages Display Section */}
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#4a5d4e] rounded-full flex items-center justify-center mx-auto shadow-md">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:h-6 md:h-8 md:w-8 text-white" />
              </div>
            </div>
            <h3 className={`${cormorant.className} text-xl sm:text-2xl md:text-3xl font-semibold text-[#4a5d4e] mb-2 sm:mb-3`} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}>
              Messages from Loved Ones
            </h3>
            <p className={`${cormorant.className} text-sm sm:text-base md:text-lg text-[#4a5d4e]/80 font-light max-w-2xl mx-auto px-2 sm:px-4`}>
              Beautiful messages that Ransch Cristov and Iszabella will treasure and enjoy reading as they grow
            </p>
          </div>
          
          <MessageWallDisplay messages={messages} loading={loading} />
        </div>

      </div>
    </Section>
  )
}
