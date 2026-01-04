"use client"

import { useState, useEffect, useRef } from "react"
import { Section } from "@/components/section"
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  RefreshCw,
  X,
  Heart,
  Sparkles,
  Phone,
  UserPlus,
  Users,
} from "lucide-react"
import { Cormorant_Garamond } from "next/font/google"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Image from "next/image"
import { motion } from "motion/react"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

interface ApiGuest {
  id: string | number
  name: string
  role: string
  email: string
  contact: string
  message: string
  allowedGuests: number
  companions: Array<{ name: string; relationship: string }>
  tableNumber: string
  isVip: boolean
  status: string
  addedBy: string
  createdAt: string
  updatedAt: string
}

interface Guest {
  id: string | number
  Name: string
  Email: string
  RSVP: string
  Guest: string
  Message: string
  Status: string
  AllowedGuests: number
}

export function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [bearImages, setBearImages] = useState<string[]>([])
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])
  const [hasResponded, setHasResponded] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    RSVP: "",
    Guest: "1",
    Message: "",
    Status: "pending",
  })

  // Companion state
  const [companions, setCompanions] = useState<Array<{ name: string; relationship: string }>>([])

  // Request form state
  const [requestFormData, setRequestFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Guest: "1",
    Message: "",
  })

  const searchRef = useRef<HTMLDivElement>(null)

  // Update companions array based on allowedGuests when a guest is selected
  useEffect(() => {
    if (selectedGuest && formData.RSVP === "Yes") {
      const allowedGuests = selectedGuest.AllowedGuests || 1
      const companionCount = Math.max(0, allowedGuests - 1) // Main guest + companions
      
      setCompanions((prev) => {
        const newCompanions = [...prev]
        if (newCompanions.length < companionCount) {
          // Add empty slots
          for (let i = newCompanions.length; i < companionCount; i++) {
            newCompanions.push({ name: '', relationship: '' })
          }
        } else if (newCompanions.length > companionCount) {
          // Remove excess slots
          newCompanions.splice(companionCount)
        }
        return newCompanions
      })
    } else {
      // Clear companions if not attending or no guest selected
      setCompanions([])
    }
  }, [selectedGuest, formData.RSVP])

  // Fetch all guests on component mount
  useEffect(() => {
    fetchGuests()
  }, [])

  // Filter guests based on search query with real-time auto-suggestion
  // Shows suggestions for ANY letter typed (even just 1 character)
  // Matches names that START with OR CONTAIN the typed letters (case-insensitive)
  // Results automatically narrow down as more letters are typed
  useEffect(() => {
    // Don't show suggestions if search is empty
    if (!searchQuery.trim()) {
      setFilteredGuests([])
      setIsSearching(false)
      return
    }

    // Convert search query to lowercase for case-insensitive matching
    const query = searchQuery.toLowerCase().trim()
    
    // Filter guests where name contains the search query anywhere in the name
    // This includes both:
    // - Names that START with the query (e.g., "Ro" matches "Rolando")
    // - Names that CONTAIN the query (e.g., "ro" matches "Aaron")
    const filtered = guests.filter((guest) => {
      // Safety check: ensure guest.Name exists and is not empty
      if (!guest.Name || guest.Name.trim() === "") {
        return false
      }
      
      const guestName = guest.Name.toLowerCase()
      return guestName.includes(query)
    })

    // Sort results to prioritize names that START with the query
    // This provides a better user experience
    const sorted = filtered.sort((a, b) => {
      const aName = a.Name.toLowerCase()
      const bName = b.Name.toLowerCase()
      const aStarts = aName.startsWith(query)
      const bStarts = bName.startsWith(query)
      
      // If one starts with query and other doesn't, prioritize the one that starts
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      
      // Otherwise maintain alphabetical order
      return aName.localeCompare(bName)
    })

    setFilteredGuests(sorted)
    setIsSearching(sorted.length > 0)
  }, [searchQuery, guests])

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchGuests = async () => {
    setIsLoading(true)
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests")
      
      if (!response.ok) {
        throw new Error("Failed to fetch guests")
      }
      const data: ApiGuest[] = await response.json()
      
      // Map API response to expected Guest format
      const mappedGuests: Guest[] = data
        .filter((guest) => guest.name && guest.name.trim() !== "") // Filter out guests without names
        .map((guest) => ({
          id: guest.id,
          Name: guest.name,
          Email: guest.email || "",
          RSVP: guest.status === "confirmed" ? "Yes" : guest.status === "declined" ? "No" : "",
          Guest: guest.allowedGuests?.toString() || "1",
          Message: guest.message || "",
          Status: guest.status || "pending",
          AllowedGuests: guest.allowedGuests || 1,
        }))
      
      setGuests(mappedGuests)
    } catch (error) {
      console.error("Error fetching guests:", error)
      setError("Failed to load guest list")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSelect = (guest: Guest) => {
    setSelectedGuest(guest)
    setSearchQuery(guest.Name)
    setIsSearching(false)
    
    // Set form data with existing guest info
    setFormData({
      Name: guest.Name,
      Email: guest.Email && guest.Email !== "Pending" && guest.Email !== "" ? guest.Email : "",
      RSVP: guest.RSVP || "",
      Guest: guest.Guest && guest.Guest !== "" ? guest.Guest : "1",
      Message: guest.Message || "",
      Status: guest.Status || "pending",
    })
    
    // Check if guest has already responded (status is confirmed or declined)
    setHasResponded(!!(guest.Status && (guest.Status === "confirmed" || guest.Status === "declined")))
    
    // Show modal
    setShowModal(true)
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitRSVP = async () => {
    if (!selectedGuest) return

    if (!formData.RSVP) {
      setError("Please select if you can attend")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Use the allowedGuests from selectedGuest
      const guestCount = formData.RSVP === "Yes" ? selectedGuest.AllowedGuests.toString() : "0"
      
      // Determine the status based on RSVP
      const status = formData.RSVP === "Yes" ? "confirmed" : formData.RSVP === "No" ? "declined" : "pending"
      
      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(selectedGuest.id),
          name: formData.Name,
          email: formData.Email || "Pending",
          status: status,
          allowedGuests: parseInt(guestCount),
          message: formData.Message,
          companions: companions, // Include companion names
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit RSVP")
      }

      // Show success and close modal after delay
      setSuccess("Thank you for your response!")
      setHasResponded(true)
      
      // Trigger event to refresh Book of Guests
      window.dispatchEvent(new Event("rsvpUpdated"))
      
      // Close modal and reset after showing success
      setTimeout(() => {
        setShowModal(false)
        setSearchQuery("")
        setSelectedGuest(null)
        setSuccess(null)
        fetchGuests()
      }, 3000)
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      setError("Failed to submit RSVP. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedGuest(null)
    setSearchQuery("")
    setFormData({ Name: "", Email: "", RSVP: "", Guest: "1", Message: "", Status: "pending" })
    setCompanions([])
    setHasResponded(false)
    setError(null)
  }

  const handleSubmitRequest = async () => {
    if (!requestFormData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setRequestSuccess(null)

    try {
      // Submit to guest-requests API
      const response = await fetch("/api/guest-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: requestFormData.Name,
          Email: requestFormData.Email || "",
          Phone: requestFormData.Phone || "",
          RSVP: "",
          Guest: requestFormData.Guest || "1",
          Message: requestFormData.Message || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setRequestSuccess("Request submitted! We'll review and get back to you.")
      
      // Close modal and reset after showing success
      setTimeout(() => {
        setShowRequestModal(false)
        setRequestFormData({ Name: "", Email: "", Phone: "", Guest: "1", Message: "" })
        setSearchQuery("")
        setRequestSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error submitting request:", error)
      setError("Failed to submit request. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseRequestModal = () => {
    setShowRequestModal(false)
    setRequestFormData({ Name: "", Email: "", Phone: "", Guest: "1", Message: "" })
    setError(null)
    setRequestSuccess(null)
  }

  return (
    <div className="relative z-30" style={{ overflow: 'visible' }}>
    <Section id="guest-list" className="relative py-12 md:py-16 lg:py-20 bg-[#FAF9F5]">
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

      {/* Header */}
      <div className="relative z-10 text-center mb-6 sm:mb-9 md:mb-12 px-2 sm:px-3 md:px-4">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {/* Small label - elegant uppercase */}
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-[#4a5d4e] font-light`}
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
          >
            Confirm Your Attendance
          </p>

          {/* Main title - elegant script */}
          <h2
            className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e]"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            RSVP
          </h2>
        </div>

        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
          <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/50 border border-[#4a5d4e]/40" />
          <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
        </div>
      </div>

      {/* RSVP Information */}
      <div className="relative z-10 max-w-2xl mx-auto px-2 sm:px-4 md:px-6 mb-6 sm:mb-8 md:mb-10">
        <div 
          className={`${cormorant.className} space-y-3 text-[#4a5d4e] text-sm sm:text-base font-light text-center`}
          style={{ 
            letterSpacing: "0.02em",
            textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
          }}
        >
          <p>We have reserved __ seat/s for you.</p>
          <p className="font-semibold">The favor of reply is required on or before DECEMBER 28, 2025.</p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <a
                href="tel:+639662731251"
                className="flex items-center justify-center p-1.5 sm:p-2 bg-[#4a5d4e] text-white rounded-lg hover:bg-[#3d4d3f] transition-colors shadow-sm hover:shadow-md"
                aria-label="Call Macy Reyes"
              >
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <p>MACY REYES – 09662731251</p>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <a
                href="tel:+639957640990"
                className="flex items-center justify-center p-1.5 sm:p-2 bg-[#4a5d4e] text-white rounded-lg hover:bg-[#3d4d3f] transition-colors shadow-sm hover:shadow-md"
                aria-label="Call Kenneth Jose"
              >
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <p>KENNETH JOSE – 09957640990</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 max-w-2xl mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
        {/* Card with paper theme */}
        <div className="relative bg-[#FAF9F5]/98 backdrop-blur-md border border-[#D0D0D0]/40 shadow-[0_16px_60px_rgba(0,0,0,0.08)] overflow-visible">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 2px, #4a5d4e 2px, #4a5d4e 4px)`,
          }} />
          
          {/* Card content */}
          <div className="relative p-2.5 sm:p-4 md:p-5 lg:p-6 z-10 overflow-visible">
            <div className="relative z-10 space-y-3 sm:space-y-4 overflow-visible">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-[#4a5d4e] p-1.5 sm:p-2 rounded-lg shadow-md">
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-semibold text-[#4a5d4e] font-sans mb-0.5 sm:mb-1">
                    Find Your Name
                  </label>
                  <p className="text-[10px] sm:text-xs text-[#4a5d4e]/70 font-sans">
                    Type as you search to see instant results
                  </p>
                </div>
              </div>
              <div ref={searchRef} className="relative z-[100]">
                <div className="relative">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#4a5d4e]/50 pointer-events-none transition-colors duration-200" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type your name..."
                    className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 md:py-3 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm font-sans text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 hover:border-[#4a5d4e]/70 focus:ring-2 focus:ring-[#4a5d4e]/20 bg-white shadow-sm focus:shadow-md"
                  />
                </div>
                {/* Autocomplete dropdown */}
                {isSearching && filteredGuests.length > 0 && (
                  <div 
                    className="absolute z-[9999] w-full mt-1 sm:mt-1.5 md:mt-2 bg-white/95 backdrop-blur-lg border border-[#D0D0D0]/70 rounded-lg sm:rounded-xl shadow-xl overflow-hidden" 
                    style={{ 
                      position: 'absolute', 
                      top: '100%',
                      left: 0,
                      right: 0
                    }}
                  >
                    {filteredGuests.map((guest, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(guest)}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 text-left hover:bg-[#F4F4F4]/40 active:bg-[#4a5d4e]/20 transition-all duration-200 flex items-center gap-2 sm:gap-3 border-b border-[#D0D0D0]/40 last:border-b-0 group"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="bg-[#4a5d4e] p-1 sm:p-1.5 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-[#243127] group-hover:text-[#4a5d4e] transition-colors duration-200 truncate">
                            {guest.Name}
                          </div>
                          {guest.Email && guest.Email !== "Pending" && (
                            <div className="text-[10px] sm:text-xs text-[#909E8D]/80 truncate mt-0.5">
                              {guest.Email}
                            </div>
                          )}
                        </div>
                        <div className="text-[#909E8D]/70 group-hover:text-[#4a5d4e] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery && filteredGuests.length === 0 && (
                  <div 
                    className="absolute z-[9999] w-full mt-1.5 sm:mt-2 bg-white/95 backdrop-blur-lg border-2 border-[#D0D0D0]/80 rounded-lg shadow-xl overflow-hidden" 
                    style={{ 
                      position: 'absolute', 
                      top: '100%',
                      left: 0,
                      right: 0
                    }}
                  >
                    <div className="p-2.5 sm:p-3 md:p-4">
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="bg-[#4a5d4e] p-1.5 sm:p-2 rounded-lg flex-shrink-0 shadow-sm">
                          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#243127] mb-1">Not finding your name?</h4>
                          <p className="text-[10px] sm:text-xs text-[#909E8D] leading-relaxed">
                            We'd love to have you with us! Send a request to join the celebration.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setRequestFormData({ ...requestFormData, Name: searchQuery })
                          setShowRequestModal(true)
                        }}
                        className="w-full !bg-[#4a5d4e] hover:!bg-[#4a5d4e]/80 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                      >
                        <UserPlus className="h-3 w-3 mr-1.5 sm:mr-2 inline" />
                        Request to Join
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-[#D0D0D0]/80 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              {/* Modal Header */}
              <div className="relative bg-[#4a5d4e] p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0">
                <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <h3 className={`${cormorant.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white truncate`} style={{ fontWeight: 300 }}>
                        You're Invited!
                      </h3>
                    </div>
                    <p className={`${cormorant.className} text-white/95 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-tight sm:leading-normal`} style={{ fontWeight: 300 }}>
                      Hello <span className="font-extrabold text-[#FFFFFF] drop-shadow-[0_1px_6px_rgba(106,79,130,0.55)]">{selectedGuest?.Name}</span>, you are invited to our wedding!
                    </p>
                    <p className={`${cormorant.className} text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-1.5`} style={{ fontWeight: 300 }}>
                      We've reserved <span className="font-bold text-white">{selectedGuest?.AllowedGuests || 1}</span> {selectedGuest?.AllowedGuests === 1 ? 'seat' : 'seats'} for you.
                    </p>
                  </div>
                  {!hasResponded && (
                    <button
                      onClick={handleCloseModal}
                      className="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1 md:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0">
                {hasResponded ? (
                  // Thank you message for guests who already responded
                  <div className="text-center py-3 sm:py-4 md:py-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#4a5d4e]/20 rounded-full mb-2 sm:mb-3 md:mb-4">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#4a5d4e]" />
                    </div>
                    <h4 className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#243127] mb-1.5 sm:mb-2 md:mb-3`} style={{ fontWeight: 300 }}>
                      Thank You for Responding!
                    </h4>
                    <p className={`${cormorant.className} text-[#909E8D] text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4 px-2`} style={{ fontWeight: 300 }}>
                      We've received your RSVP and look forward to celebrating with you!
                    </p>
                    <div className="bg-[#F4F4F4]/40 rounded-lg p-2.5 sm:p-3 md:p-4 border border-[#D0D0D0]/70 space-y-2 sm:space-y-2.5 md:space-y-3">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                        {selectedGuest?.RSVP === "Yes" && (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
                            <span className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-green-600`} style={{ fontWeight: 300 }}>
                              You're Attending!
                            </span>
                          </>
                        )}
                        {selectedGuest?.RSVP === "No" && (
                          <>
                            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600" />
                            <span className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-red-600`} style={{ fontWeight: 300 }}>
                              Unable to Attend
                            </span>
                          </>
                        )}
                      </div>
                      {selectedGuest?.RSVP === "Yes" && (
                        <div className="bg-[#F4F4F4]/60 rounded-lg p-2 sm:p-2.5 md:p-3 border border-[#D0D0D0]/80">
                          <div className="text-center">
                            <p className={`${cormorant.className} text-xs sm:text-sm text-[#909E8D] mb-1 font-medium`} style={{ fontWeight: 300 }}>Number of Guests</p>
                            <p className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#243127]`} style={{ fontWeight: 300 }}>
                              {selectedGuest.AllowedGuests || 1}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedGuest && selectedGuest.Message && selectedGuest.Message.trim() !== "" && (
                        <div className="pt-1.5 sm:pt-2 border-t border-[#D0D0D0]/70">
                          <p className={`${cormorant.className} text-xs sm:text-sm text-[#909E8D] italic px-1`} style={{ fontWeight: 300 }}>
                            "{selectedGuest.Message}"
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className={`${cormorant.className} mt-3 sm:mt-4 md:mt-6 !bg-[#4a5d4e] hover:!bg-[#4a5d4e]/80 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-300`}
                      style={{ fontWeight: 300 }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  // RSVP Form for guests who haven't responded
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmitRSVP()
                    }}
                    className="space-y-2.5 sm:space-y-3 md:space-y-4"
                  >
                    {/* Can you attend? */}
                    <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2`} style={{ fontWeight: 300 }}>
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                        <span>Can you attend? *</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, RSVP: "Yes", Guest: "1" }))
                          }
                          className={`relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.RSVP === "Yes"
                              ? "border-green-600 bg-green-50 shadow-md scale-105"
                              : "border-[#D0D0D0]/60 bg-white hover:border-[#4a5d4e]/70 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <CheckCircle
                              className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                formData.RSVP === "Yes" ? "text-green-700" : "text-[#909E8D]/60"
                              }`}
                            />
                            <span
                              className={`${cormorant.className} text-xs sm:text-sm md:text-base font-bold ${
                                formData.RSVP === "Yes" ? "text-green-700" : "text-[#243127]"
                              }`}
                              style={{ fontWeight: 300 }}
                            >
                              Yes!
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, RSVP: "No" }))}
                          className={`relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.RSVP === "No"
                              ? "border-red-500 bg-red-50 shadow-md scale-105"
                              : "border-[#D0D0D0]/60 bg-white hover:border-[#4a5d4e]/70 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <XCircle
                              className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                formData.RSVP === "No" ? "text-red-600" : "text-[#909E8D]/60"
                              }`}
                            />
                            <span
                              className={`${cormorant.className} text-xs sm:text-sm md:text-base font-bold ${
                                formData.RSVP === "No" ? "text-red-600" : "text-[#243127]"
                              }`}
                              style={{ fontWeight: 300 }}
                            >
                              Sorry, No
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Who's Coming With You - Companion Names */}
                    {formData.RSVP === "Yes" && companions.length > 0 && (
                      <div className="space-y-2.5 sm:space-y-3">
                        <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127]`} style={{ fontWeight: 300 }}>
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                          <span>Who's Coming With You?</span>
                        </label>
                        <p className={`${cormorant.className} text-xs sm:text-sm text-[#909E8D] -mt-1 sm:-mt-1.5`} style={{ fontWeight: 300 }}>
                          Please provide names for your <span className="font-semibold">{companions.length}</span> additional {companions.length === 1 ? 'guest' : 'guests'}
                        </p>
                        {companions.map((companion, index) => (
                            <div key={index} className="bg-[#F4F4F4]/40 rounded-lg p-2 sm:p-2.5 md:p-3 border border-[#D0D0D0]/40">
                            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#4a5d4e]" />
                              <span className={`${cormorant.className} text-xs sm:text-sm font-semibold text-[#243127]`} style={{ fontWeight: 300 }}>
                                Guest {index + 2} Name
                              </span>
                            </div>
                            <input
                              type="text"
                              value={companion.name}
                              onChange={(e) => {
                                const newCompanions = [...companions]
                                newCompanions[index] = { ...newCompanions[index], name: e.target.value }
                                setCompanions(newCompanions)
                              }}
                              placeholder={`Name of guest ${index + 2}`}
                              className={`${cormorant.className} w-full px-2 sm:px-2.5 py-1.5 sm:py-2 border border-[#D0D0D0]/50 focus:border-[#4a5d4e] rounded text-xs sm:text-sm text-[#243127] placeholder:text-[#909E8D]/60 transition-all duration-300 focus:ring-1 focus:ring-[#4a5d4e]/20 bg-white`}
                              style={{ fontWeight: 300 }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message to the couple */}
                    <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2 flex-wrap`} style={{ fontWeight: 300 }}>
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                        <span>Your Message to the Couple</span>
                      <span className="text-xs sm:text-sm font-normal text-[#909E8D]">(Optional)</span>
                      </label>
                      <textarea
                        name="Message"
                        value={formData.Message}
                        onChange={handleFormChange}
                        placeholder="Share your excitement..."
                        rows={3}
                      className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 resize-none bg-white`}
                      style={{ fontWeight: 300 }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2 flex-wrap`} style={{ fontWeight: 300 }}>
                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                        <span>Your Email Address</span>
                        <span className="text-xs sm:text-sm font-normal text-[#909E8D]">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleFormChange}
                        placeholder="your.email@example.com"
                        className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 bg-white`}
                        style={{ fontWeight: 300 }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 sm:pt-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`${cormorant.className} w-full !bg-[#4a5d4e] hover:!bg-[#4a5d4e]/80 text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2`}
                        style={{ fontWeight: 300 }}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                            <span className="text-xs sm:text-sm md:text-base">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm md:text-base">Submit RSVP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Enhanced Success Overlay */}
              {success && (
                <div className="absolute inset-0 bg-[#4a5d4e]/98 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4">
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Enhanced Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      {/* Animated rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                      {/* Icon container */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-[#4a5d4e]" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-white mb-2 sm:mb-3">
                      RSVP Confirmed!
                    </h4>
                    
                    {/* Message based on RSVP response */}
                    {formData.RSVP === "Yes" && (
                      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                        <p className="text-white/95 text-xs sm:text-sm font-medium">
                          We're thrilled you'll be joining us!
                        </p>
                        <p className="text-white/80 text-[10px] sm:text-xs">
                          Your response has been recorded
                        </p>
                      </div>
                    )}
                    {formData.RSVP === "No" && (
                      <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3">
                        We'll miss you, but thank you for letting us know.
                      </p>
                    )}
                    {!formData.RSVP && (
                      <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3">
                        Thank you for your response!
                      </p>
                    )}
                    
                    {/* Subtle closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse" />
                      <p className="text-white/70 text-[10px] sm:text-xs">
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !success && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <span className="text-red-600 font-semibold text-[10px] sm:text-xs md:text-sm">{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request to Join Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-[#D0D0D0]/80 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              {/* Modal Header with Gradient */}
              <div className="relative bg-[#4a5d4e] p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0">
                <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                        <UserPlus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <h3 className={`${cormorant.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white truncate`} style={{ fontWeight: 300 }}>
                        Request to Join
                      </h3>
                    </div>
                    <p className={`${cormorant.className} text-white/95 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-tight sm:leading-normal`} style={{ fontWeight: 300 }}>
                      {requestFormData.Name ? (
                        <>Hi <span className="font-extrabold text-[#FFFFFF]">{requestFormData.Name}</span> — want to celebrate with us? Send a request!</>
                      ) : (
                        <>Want to celebrate with us? Send a request!</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseRequestModal}
                    className="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1 md:p-1.5 lg:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitRequest()
                  }}
                  className="space-y-2.5 sm:space-y-3 md:space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2`} style={{ fontWeight: 300 }}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={requestFormData.Name}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Name: e.target.value })}
                      required
                      placeholder="Enter your full name"
                      className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 bg-white`}
                      style={{ fontWeight: 300 }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2 flex-wrap`} style={{ fontWeight: 300 }}>
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                      <span>Email Address</span>
                      <span className="text-xs sm:text-sm font-normal text-[#909E8D]">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={requestFormData.Email}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 bg-white`}
                      style={{ fontWeight: 300 }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2 flex-wrap`} style={{ fontWeight: 300 }}>
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                      <span>Phone Number</span>
                      <span className="text-xs sm:text-sm font-normal text-[#909E8D]">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      value={requestFormData.Phone}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 bg-white`}
                      style={{ fontWeight: 300 }}
                    />
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2`} style={{ fontWeight: 300 }}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                      <span>Number of Guests *</span>
                    </label>
                    <input
                      type="number"
                      name="Guest"
                      value={requestFormData.Guest}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Guest: e.target.value })}
                      min="1"
                      required
                      placeholder="How many guests?"
                      className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 bg-white`}
                      style={{ fontWeight: 300 }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`${cormorant.className} flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#243127] mb-1.5 sm:mb-2 flex-wrap`} style={{ fontWeight: 300 }}>
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#909E8D] flex-shrink-0" />
                      <span>Message</span>
                        <span className="text-xs sm:text-sm font-normal text-[#909E8D]">(Optional)</span>
                    </label>
                    <textarea
                      name="Message"
                      value={requestFormData.Message}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Message: e.target.value })}
                      placeholder="Share why you'd like to join..."
                      rows={3}
                        className={`${cormorant.className} w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-[#D0D0D0]/60 focus:border-[#4a5d4e] rounded-lg text-xs sm:text-sm md:text-base text-[#243127] placeholder:text-[#909E8D]/70 transition-all duration-300 focus:ring-2 focus:ring-[#4a5d4e]/20 resize-none bg-white`}
                      style={{ fontWeight: 300 }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${cormorant.className} w-full !bg-[#4a5d4e] hover:!bg-[#4a5d4e]/80 text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2`}
                      style={{ fontWeight: 300 }}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          <span className="text-xs sm:text-sm md:text-base">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm md:text-base">Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Enhanced Success Overlay */}
              {requestSuccess && (
                <div className="absolute inset-0 bg-[#4a5d4e]/98 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4">
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Enhanced Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      {/* Animated rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                      {/* Icon container */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-[#4a5d4e]" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h4 className={`${cormorant.className} text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white mb-2 sm:mb-3`} style={{ fontWeight: 300 }}>
                      Request Sent!
                    </h4>
                    
                    {/* Message */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <p className={`${cormorant.className} text-white/95 text-xs sm:text-sm md:text-base font-medium`} style={{ fontWeight: 300 }}>
                        We've received your request
                      </p>
                      <p className={`${cormorant.className} text-white/85 text-xs sm:text-sm`} style={{ fontWeight: 300 }}>
                        We'll review it and get back to you soon
                      </p>
                    </div>
                    
                    {/* Subtle closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse" />
                      <p className={`${cormorant.className} text-white/70 text-xs sm:text-sm`} style={{ fontWeight: 300 }}>
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/60 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !requestSuccess && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <span className={`${cormorant.className} text-red-600 font-semibold text-xs sm:text-sm md:text-base`} style={{ fontWeight: 300 }}>{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Floating Status Messages (outside modals) */}
      {success && !showModal && !showRequestModal && !requestSuccess && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2 sm:mx-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-2 sm:p-3 md:p-4 shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">{success}</span>
            </div>
          </div>
        </div>
      )}

      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" zIndex={1} />
    </Section>
    </div>
  )
}
