"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "motion/react"
import { CheckCircle2, UserCheck, Users, Phone, MessageSquare, Check, X } from "lucide-react"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { getRandomBearImages } from "@/lib/bear-utils"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

interface RSVPFormProps {
  onSuccess?: () => void
}

function RSVPForm({ onSuccess }: RSVPFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [attendance, setAttendance] = useState("")
  const [names, setNames] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [comments, setComments] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [formProgress, setFormProgress] = useState(0)
  const { toast } = useToast()

  // Calculate form progress
  useEffect(() => {
    let progress = 0
    if (names.trim()) progress += 33
    if (attendance) progress += 33
    if (contactNumber.trim() || comments.trim()) progress += 34
    setFormProgress(progress)
  }, [names, attendance, contactNumber, comments])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const googleFormData = new FormData()
    googleFormData.append("entry.534061937", names) // Full Name
    googleFormData.append("entry.812523124", attendance) // Can You Attend?
    googleFormData.append("entry.984926065", contactNumber) // Contact Number
    googleFormData.append("entry.1089847371", comments) // Comments and/or questions

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSdvlWADgjUsTrYjIvpSFD9h12E3pypT8WVY0Ri-XugbpYjKwg/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: googleFormData,
        }
      )

      toast({
        title: "RSVP Confirmed! 🎉",
        description: "Thank you for your response",
        duration: 3000,
      })

      setIsSubmitted(true)
      setFormProgress(100)
      
      // Reset form after animation
      setTimeout(() => {
        setAttendance("")
        setNames("")
        setContactNumber("")
        setComments("")
        setFormProgress(0)
        setFieldErrors({})
        formRef.current?.reset()
        setIsSubmitted(false)
      }, 2500)
      
      if (onSuccess) onSuccess()
    } catch (error) {
      toast({
        title: "Unable to submit RSVP",
        description: "Please try again in a moment",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-0">
      {/* Style to override placeholder color and animations */}
      <style>{`
        .rsvp-form-input::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
        .rsvp-form-textarea::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      {/* Decorative background elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#BCCFC0]/30 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#E6CFC9]/25 rounded-full blur-md animate-pulse"></div>
      
      <Card className={`relative w-full border border-[#8EA58B]/30 shadow-[0_10px_24px_rgba(167,130,86,0.15)] bg-white/70 backdrop-blur-md transition-all duration-500 group overflow-hidden rounded-xl ${
        isFocused ? 'scale-[1.01] border-[#8EA58B]/50 bg-white/75' : 'hover:bg-white/75'
      } ${isSubmitted ? 'animate-bounce' : ''}`}>
        {/* Glass effect gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E6CFC9]/20 via-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
        
        {/* Frosted glass effect */}
        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5"></div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BCCFC0]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Success animation overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-green-300/20 to-emerald-200/10 flex items-center justify-center z-20 pointer-events-none rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
            <div className="relative flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl animate-ping opacity-75"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                  <Check className="h-10 w-10 text-white animate-in zoom-in duration-500 delay-150" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-green-700 font-bold text-xl font-playfair animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                  RSVP Confirmed!
                </p>
                <p className="text-green-600/80 text-sm font-lora animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                  Thank you for your response
                </p>
              </div>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s`, animationDuration: '0.6s' }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="relative p-3 sm:p-5 md:p-6 lg:p-7 xl:p-8">
        {/* Header with icon */}
          <div className="text-center mb-2.5 sm:mb-4 md:mb-5 lg:mb-6">
            <div className="relative inline-block mb-1.5 sm:mb-3 md:mb-4">
              <div className="absolute inset-0 bg-[#BCCFC0]/50 rounded-full blur-lg scale-150"></div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border border-[#324D3E]/20">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#324D3E]" />
              </div>
            </div>
            <h3 className="text-sm sm:text-lg md:text-xl font-playfair font-bold text-foreground mb-1 sm:mb-2">
              RSVP
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-foreground/70 font-lora">
              Please respond on or before January 7, 2026
            </p>
          </div>

          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="space-y-2.5 sm:space-y-4 md:space-y-5 lg:space-y-6"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Full Name Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <label className="block text-[11px] sm:text-sm md:text-base font-medium text-foreground font-lora flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white/85 border border-[#324D3E]/10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  focusedField === 'names' ? 'scale-110 bg-white border-[#324D3E]/30 shadow-md ring-2 ring-[#8EA58B]/30' : ''
                }`}>
                  <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#324D3E] transition-transform duration-300" />
                </div>
                Full Name *
              </label>
              <div className="relative group">
                <Input
                  name="names"
                  required
                  value={names}
                  onChange={(e) => {
                    setNames(e.target.value)
                    setFieldErrors(prev => ({ ...prev, names: false }))
                  }}
                  onFocus={() => setFocusedField('names')}
                  onBlur={(e) => {
                    setFocusedField(null)
                    if (e.target.value.trim() === '') {
                      setFieldErrors(prev => ({ ...prev, names: true }))
                    }
                  }}
                  placeholder="Enter your full name"
                  className={`rsvp-form-input w-full border-2 rounded-xl py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 pr-10 text-[11px] sm:text-sm md:text-base font-lora placeholder:italic transition-all duration-300 bg-white/85 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg ${
                    focusedField === 'names' 
                      ? 'border-[#8EA58B] focus:border-[#8EA58B] focus:ring-4 focus:ring-[#8EA58B]/20 shadow-lg scale-[1.01]' 
                      : fieldErrors.names
                      ? 'border-red-300/60 hover:border-red-400/60'
                      : 'border-[#BCCFC0]/40 hover:border-[#8EA58B]/40'
                  }`}
                />
                {names && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in zoom-in duration-200">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                {fieldErrors.names && !names && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in zoom-in duration-200">
                    <X className="h-4 w-4 text-red-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Can You Attend Field - Improved UI */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <label className="block text-[11px] sm:text-sm md:text-base font-medium text-foreground font-lora flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white/85 border border-[#324D3E]/10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  focusedField === 'attendance' ? 'scale-110 bg-white border-[#324D3E]/30 shadow-md ring-2 ring-[#8EA58B]/30' : ''
                }`}>
                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#324D3E] transition-transform duration-300" />
                </div>
                Can You Attend? *
              </label>
              <div
                className="grid grid-cols-2 gap-2 sm:gap-3"
                onFocus={() => setFocusedField('attendance')}
                onBlur={() => setFocusedField(null)}
              >
                <div className={`relative group cursor-pointer transition-all duration-300 ${
                  attendance === "Yes, I'll be there" 
                    ? 'scale-[1.02] z-10' 
                    : 'hover:scale-[1.01]'
                }`}>
                  <input
                    type="radio"
                    id="yes"
                    name="attendance"
                    value="Yes, I'll be there"
                    checked={attendance === "Yes, I'll be there"}
                    onChange={(e) => {
                      setAttendance(e.target.value)
                      setFieldErrors(prev => ({ ...prev, attendance: false }))
                    }}
                    className="peer sr-only"
                    required
                  />
                  <Label
                    htmlFor="yes"
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer font-lora text-[11px] sm:text-sm md:text-base overflow-hidden ${
                      attendance === "Yes, I'll be there"
                        ? 'bg-gradient-to-br from-[#8EA58B]/25 via-[#BCCFC0]/20 to-[#8EA58B]/15 border-[#8EA58B] shadow-xl ring-4 ring-[#8EA58B]/25'
                        : 'bg-white/85 border-[#BCCFC0]/40 hover:border-[#8EA58B]/60 hover:bg-white/95 hover:shadow-lg'
                    }`}
                  >
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 bg-[#8EA58B]/10 rounded-full scale-0 group-active:scale-150 transition-transform duration-500 opacity-0 group-active:opacity-100"></div>
                    
                    {/* Icon container */}
                    <div className={`relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                      attendance === "Yes, I'll be there"
                        ? 'border-[#324D3E] bg-gradient-to-br from-[#324D3E] to-[#4A6B5A] shadow-md scale-110'
                        : 'border-[#324D3E]/40 group-hover:border-[#324D3E]/60 group-hover:scale-105'
                    }`}>
                      {attendance === "Yes, I'll be there" ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white animate-in zoom-in duration-200" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#324D3E]/20 group-hover:bg-[#324D3E]/40 transition-colors"></div>
                      )}
                    </div>
                    <span className={`font-semibold text-center relative z-10 transition-colors ${
                      attendance === "Yes, I'll be there" ? 'text-[#324D3E]' : 'text-foreground'
                    }`}>
                      Yes, I'll be there
                    </span>
                    {attendance === "Yes, I'll be there" && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    )}
                  </Label>
                </div>
                <div className={`relative group cursor-pointer transition-all duration-300 ${
                  attendance === "Sorry, can't make it" 
                    ? 'scale-[1.02] z-10' 
                    : 'hover:scale-[1.01]'
                }`}>
                  <input
                    type="radio"
                    id="no"
                    name="attendance"
                    value="Sorry, can't make it"
                    checked={attendance === "Sorry, can't make it"}
                    onChange={(e) => {
                      setAttendance(e.target.value)
                      setFieldErrors(prev => ({ ...prev, attendance: false }))
                    }}
                    className="peer sr-only"
                    required
                  />
                  <Label
                    htmlFor="no"
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer font-lora text-[11px] sm:text-sm md:text-base overflow-hidden ${
                      attendance === "Sorry, can't make it"
                        ? 'bg-gradient-to-br from-[#E6CFC9]/25 via-[#BCCFC0]/20 to-[#E6CFC9]/15 border-[#8EA58B] shadow-xl ring-4 ring-[#8EA58B]/25'
                        : 'bg-white/85 border-[#BCCFC0]/40 hover:border-[#8EA58B]/60 hover:bg-white/95 hover:shadow-lg'
                    }`}
                  >
                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 bg-[#E6CFC9]/10 rounded-full scale-0 group-active:scale-150 transition-transform duration-500 opacity-0 group-active:opacity-100"></div>
                    
                    {/* Icon container */}
                    <div className={`relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                      attendance === "Sorry, can't make it"
                        ? 'border-[#324D3E] bg-gradient-to-br from-[#324D3E] to-[#4A6B5A] shadow-md scale-110'
                        : 'border-[#324D3E]/40 group-hover:border-[#324D3E]/60 group-hover:scale-105'
                    }`}>
                      {attendance === "Sorry, can't make it" ? (
                        <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white animate-in zoom-in duration-200" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#324D3E]/20 group-hover:bg-[#324D3E]/40 transition-colors"></div>
                      )}
                    </div>
                    <span className={`font-semibold text-center relative z-10 transition-colors ${
                      attendance === "Sorry, can't make it" ? 'text-[#324D3E]' : 'text-foreground'
                    }`}>
                      Sorry, can't make it
                    </span>
                    {attendance === "Sorry, can't make it" && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                    )}
                  </Label>
                </div>
              </div>
            </div>

            {/* Contact Number Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
              <label className="block text-[11px] sm:text-sm md:text-base font-medium text-foreground font-lora flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white/85 border border-[#324D3E]/10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  focusedField === 'contact' ? 'scale-110 bg-white border-[#324D3E]/30 shadow-md ring-2 ring-[#8EA58B]/30' : ''
                }`}>
                  <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#324D3E] transition-transform duration-300" />
                </div>
                Contact Number <span className="text-[#4a5d4e]/70 font-normal">(optional)</span>
              </label>
              <div className="relative group">
                <Input
                  name="contact"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  onFocus={() => setFocusedField('contact')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your contact number"
                  className={`rsvp-form-input w-full border-2 rounded-xl py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 pr-10 text-[11px] sm:text-sm md:text-base font-lora placeholder:italic transition-all duration-300 bg-white/85 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg ${
                    focusedField === 'contact' 
                      ? 'border-[#8EA58B] focus:border-[#8EA58B] focus:ring-4 focus:ring-[#8EA58B]/20 shadow-lg scale-[1.01]' 
                      : 'border-[#BCCFC0]/40 hover:border-[#8EA58B]/40'
                  }`}
                />
                {contactNumber && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in zoom-in duration-200">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Field */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              <label className="block text-[11px] sm:text-sm md:text-base font-medium text-foreground font-lora flex items-center gap-1.5 sm:gap-2">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white/85 border border-[#324D3E]/10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  focusedField === 'comments' ? 'scale-110 bg-white border-[#324D3E]/30 shadow-md ring-2 ring-[#8EA58B]/30' : ''
                }`}>
                  <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#324D3E] transition-transform duration-300" />
                </div>
                Comments and / or questions
              </label>
              <div className="relative group">
                <Textarea
                  name="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  onFocus={() => setFocusedField('comments')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Any special requirements or questions?"
                  className={`rsvp-form-textarea w-full border-2 rounded-xl min-h-[72px] sm:min-h-[100px] text-[11px] sm:text-sm md:text-base font-lora placeholder:italic transition-all duration-300 resize-none bg-white/85 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 pr-10 ${
                    focusedField === 'comments' 
                      ? 'border-[#8EA58B] focus:border-[#8EA58B] focus:ring-4 focus:ring-[#8EA58B]/20 shadow-lg scale-[1.01]' 
                      : 'border-[#BCCFC0]/40 hover:border-[#8EA58B]/40'
                  }`}
                />
                {comments && (
                  <div className="absolute right-3 top-3 animate-in zoom-in duration-200">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 right-3 text-[10px] text-foreground/40 font-lora">
                  {comments.length} characters
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
              <Button
                type="submit"
                disabled={isSubmitting || !attendance || !names.trim()}
                className="w-full text-white py-2 sm:py-3 md:py-4 lg:py-4 px-4 sm:px-5 md:px-6 lg:px-7 rounded-xl text-[11px] sm:text-sm md:text-base font-lora font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 relative overflow-hidden group border border-[#E6CFC9]/60 shadow-lg disabled:shadow-md"
                style={{ 
                  backgroundColor: "#324D3E",
                  boxShadow: "0 4px 18px rgba(50, 77, 62, 0.45)"
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "rgba(50, 77, 62, 0.95)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(50, 77, 62, 0.65)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#324D3E";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(50, 77, 62, 0.45)";
                }}
              >
                {/* Button background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A6B5A] via-[#324D3E] to-[#4A6B5A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Ripple effect on click */}
                <div className="absolute inset-0 bg-white/20 rounded-xl scale-0 group-active:scale-150 transition-transform duration-500 opacity-0 group-active:opacity-100"></div>
                
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="animate-pulse">Submitting...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform group-hover:scale-110 duration-300" />
                    <span>Submit RSVP</span>
                    {attendance && names.trim() && (
                      <div className="ml-1 w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    )}
                  </span>
                )}
              </Button>
              
              {/* Helper text */}
              {(!attendance || !names.trim()) && (
                <p className="text-xs text-foreground/50 text-center mt-2 font-lora">
                  Please fill in all required fields *
                </p>
              )}
              
              {/* Progress Bar */}
              <div className="mt-4 sm:mt-5">
                <div className="h-2 bg-[#BCCFC0]/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8EA58B] to-[#BCCFC0] rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${formProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function RSVP() {
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])

  return (
    <Section
      id="rsvp"
      className="relative py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden"
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
              RSVP
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
              className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl text-[#4a5d4e] leading-relaxed font-light text-center max-w-3xl mx-auto`}
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
                lineHeight: "1.8",
              }}
            >
              Unless we&apos;ve said otherwise, this invite is good for one (1) seat only.
              <br />
              Please respond on or before <strong className="font-semibold">January 7, 2026</strong> to include you on the final guest list and assure you of seat/s at the reception.
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

          {/* Form Section */}
          <motion.div 
            className="flex justify-center py-4 sm:py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <div className="relative max-w-md w-full">
              {/* Card halo */}
              <div className="absolute -inset-3 bg-gradient-to-br from-[#B28383]/25 via-[#E6CFC9]/20 to-transparent rounded-3xl blur-2xl opacity-70" />
              <div className="absolute -inset-1 bg-gradient-to-br from-[#8EA58B]/15 via-transparent to-transparent rounded-3xl blur-md opacity-80" />
              <RSVPForm />
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

// Export as GuestList for backward compatibility
export const GuestList = RSVP