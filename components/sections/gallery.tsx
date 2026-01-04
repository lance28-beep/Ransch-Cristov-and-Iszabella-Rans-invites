"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Section } from "@/components/section"
import { motion, AnimatePresence } from "motion/react"
import { Cormorant_Garamond } from "next/font/google"
import { TornPaperEdge } from "@/components/torn-paper-edge"
import Image from "next/image"
import { getRandomBearImages } from "@/lib/bear-utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const galleryItems = [
  { image: "/mobile-background/celebrant (1).jpg", text: " " },  
  { image: "/mobile-background/celebrant (2).jpg", text: " " },
  { image: "/mobile-background/celebrant (3).jpg", text: " " },
  { image: "/mobile-background/celebrant (4).jpg", text: " " },
  { image: "/mobile-background/celebrant (5).jpg", text: " " },
  { image: "/mobile-background/celebrant (6).jpg", text: " " },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [bearImages, setBearImages] = useState<string[]>([])
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({})
  const lightboxImageRef = useRef<HTMLImageElement>(null)
  
  // Initialize bear images on client side only to avoid hydration mismatch
  useEffect(() => {
    setBearImages(getRandomBearImages(2))
  }, [])
  
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null)
  const [pinchStartScale, setPinchStartScale] = useState(1)
  const [lastTap, setLastTap] = useState(0)
  const [panStart, setPanStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const [isLightboxTransitioning, setIsLightboxTransitioning] = useState(false)

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const resetZoom = useCallback(() => {
    setZoomScale(1)
    setPan({ x: 0, y: 0 })
    setPanStart(null)
  }, [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setIsLightboxTransitioning(true)
    resetZoom()
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex
        if (direction === 'next') {
          newIndex = (prevIndex + 1) % galleryItems.length
        } else {
          newIndex = (prevIndex - 1 + galleryItems.length) % galleryItems.length
        }
        setSelectedImage(galleryItems[newIndex])
        setIsLightboxTransitioning(false)
        return newIndex
      })
    }, 150)
  }, [resetZoom])

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages((prev) => new Set([...prev, src]))
    setImageLoading((prev) => ({ ...prev, [src]: false }))
  }, [])

  const handleImageLoadStart = useCallback((src: string) => {
    setImageLoading((prev) => ({ ...prev, [src]: true }))
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
      if (e.key === 'Escape') setSelectedImage(null)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage, currentIndex, navigateImage])

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  // Preload adjacent images for smoother nav
  useEffect(() => {
    if (selectedImage && typeof window !== "undefined") {
      const preloadImages = [
        galleryItems[(currentIndex + 1) % galleryItems.length].image,
        galleryItems[(currentIndex - 1 + galleryItems.length) % galleryItems.length].image,
      ]
      
      preloadImages.forEach((src) => {
        if (!loadedImages.has(src)) {
          const img = new window.Image()
          img.src = src
          img.onload = () => handleImageLoad(src)
        }
      })
    }
  }, [selectedImage, currentIndex, loadedImages, handleImageLoad])

  return (
    <Section
      id="gallery"
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
          className="absolute top-[10%] left-[2%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 opacity-30"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (9).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-[15%] right-[2%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 opacity-30"
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (7).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
        <motion.div
          className="absolute top-[50%] left-[1%] w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-25"
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
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
          transition={{ delay: 1.1, duration: 0.6 }}
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
          transition={{ delay: 1.2, duration: 0.6 }}
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
          transition={{ delay: 1.3, duration: 0.6 }}
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
          transition={{ delay: 1.4, duration: 0.6 }}
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
          transition={{ delay: 1.5, duration: 0.6 }}
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
          transition={{ delay: 1.6, duration: 0.6 }}
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
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          <Image
            src="/Bear/bear (3).png"
            alt="Bear background decoration"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* Header - Matching narrative section style */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center space-y-8 sm:space-y-10 md:space-y-12 mb-10 sm:mb-12 md:mb-16"
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
              Captured Moments
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
              className={`${cormorant.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#4a5d4e] font-light uppercase tracking-[0.15em]`}
              style={{ 
                letterSpacing: "0.15em",
                textShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Our Gallery
            </p>
          </motion.div>

          {/* Short descriptive sublabel */}
          <motion.div
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p
              className={`${cormorant.className} text-sm sm:text-base md:text-lg text-[#4a5d4e]/80 font-light italic max-w-2xl mx-auto`}
              style={{ 
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              Memories to treasure forever
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
        </motion.div>
      </div>

      {/* Gallery content */}
      <div className="relative z-10 w-full">
        <div className="flex justify-center px-4 sm:px-5 md:px-6">
          <div className="max-w-5xl w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 sm:h-60 md:h-72">
                <div className="w-10 h-10 border-[3px] border-[#4a5d4e]/20 border-t-[#4a5d4e] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {galleryItems.map((item, index) => {
                  const isLoaded = loadedImages.has(item.image)
                  const isLoading = imageLoading[item.image]
                  
                  return (
                    <motion.button
                      key={item.image + index}
                      type="button"
                      className="group relative w-full overflow-hidden rounded-lg bg-white border border-[#4a5d4e]/20 shadow-[0_2px_8px_rgba(74,93,78,0.15)] hover:shadow-[0_8px_24px_rgba(74,93,78,0.3)] hover:border-[#4a5d4e]/50 transition-all duration-500 hover:-translate-y-1"
                      onClick={() => {
                        setSelectedImage(item)
                        setCurrentIndex(index)
                        resetZoom()
                      }}
                      aria-label={`Open image ${index + 1}`}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.08,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Enhanced paper-like shadow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#4a5d4e]/10 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative aspect-[3/4] md:aspect-square overflow-hidden bg-gradient-to-br from-[#4a5d4e]/5 to-[#4a5d4e]/10">
                        {/* Loading skeleton */}
                        {!isLoaded && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-[#4a5d4e]/10 via-[#4a5d4e]/5 to-[#4a5d4e]/10"
                            animate={{
                              backgroundPosition: ["0% 0%", "100% 100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            style={{
                              backgroundSize: "200% 200%",
                            }}
                          />
                        )}
                        
                        <motion.img
                          src={item.image}
                          alt={item.text || `Gallery image ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ 
                            opacity: isLoaded ? 1 : 0,
                            scale: isLoaded ? 1 : 1.1
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          onLoadStart={() => handleImageLoadStart(item.image)}
                          onLoad={() => handleImageLoad(item.image)}
                          style={{
                            filter: isLoaded ? "none" : "blur(10px)",
                          }}
                        />
                        
                        {/* Enhanced overlay on hover */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* View indicator on hover */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-[#4a5d4e]/30">
                            <span className={`${cormorant.className} text-sm font-medium text-[#4a5d4e] tracking-wide`}>
                              View
                            </span>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Enhanced image counter badge */}
                      <motion.div 
                        className="absolute top-3 right-3 bg-[#4a5d4e]/95 backdrop-blur-md rounded-md px-2.5 py-1.5 border border-[#4a5d4e]/70 shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className={`${cormorant.className} text-xs font-semibold text-white tracking-wide`}>
                          {index + 1}/{galleryItems.length}
                        </span>
                      </motion.div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-1 sm:p-2 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setSelectedImage(null)
              resetZoom()
            }}
          >
            <motion.div
              className="relative max-w-6xl w-full h-full sm:h-auto flex flex-col items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  const now = Date.now()
                  if (now - lastTap < 300) {
                    setZoomScale((s) => (s > 1 ? 1 : 2))
                    setPan({ x: 0, y: 0 })
                  }
                  setLastTap(now)
                  const t = e.touches[0]
                  setTouchStartX(t.clientX)
                  setTouchDeltaX(0)
                  if (zoomScale > 1) {
                    setPanStart({ x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y })
                  }
                }
                if (e.touches.length === 2) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX
                  const dy = e.touches[0].clientY - e.touches[1].clientY
                  const dist = Math.hypot(dx, dy)
                  setPinchStartDist(dist)
                  setPinchStartScale(zoomScale)
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 2 && pinchStartDist) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX
                  const dy = e.touches[0].clientY - e.touches[1].clientY
                  const dist = Math.hypot(dx, dy)
                  const scale = Math.min(3, Math.max(1, (dist / pinchStartDist) * pinchStartScale))
                  setZoomScale(scale)
                } else if (e.touches.length === 1) {
                  const t = e.touches[0]
                  if (zoomScale > 1 && panStart) {
                    const dx = t.clientX - panStart.x
                    const dy = t.clientY - panStart.y
                    setPan({ x: panStart.panX + dx, y: panStart.panY + dy })
                  } else if (touchStartX !== null) {
                    setTouchDeltaX(t.clientX - touchStartX)
                  }
                }
              }}
              onTouchEnd={() => {
                setPinchStartDist(null)
                setPanStart(null)
                if (zoomScale === 1 && Math.abs(touchDeltaX) > 50) {
                  navigateImage(touchDeltaX > 0 ? 'prev' : 'next')
                }
                setTouchStartX(null)
                setTouchDeltaX(0)
              }}
            >
            {/* Enhanced Top bar with counter, zoom controls, and close */}
            <motion.div 
              className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-2 sm:p-3 md:p-4 lg:p-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Image counter with enhanced styling */}
              <motion.div 
                className="bg-black/60 backdrop-blur-md rounded-full px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 border border-white/30 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white">
                  {currentIndex + 1} / {galleryItems.length}
                </span>
              </motion.div>
              
              {/* Zoom and action buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Zoom controls */}
                <div className="flex items-center gap-1 sm:gap-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-1.5 sm:px-3 sm:py-2 border border-white/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoomScale((prev) => Math.min(prev + 0.25, 3))
                    }}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors touch-manipulation"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={16} className="sm:w-5 sm:h-5 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoomScale((prev) => Math.max(prev - 0.25, 1))
                      if (zoomScale <= 1.25) resetZoom()
                    }}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors touch-manipulation"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={16} className="sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
                
                {/* Download button */}
                <motion.a
                  href={selectedImage.image}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black/60 hover:bg-black/80 active:bg-black backdrop-blur-md rounded-full p-1.5 sm:p-2 md:p-2.5 border border-white/30 hover:border-white/50 transition-all duration-200 touch-manipulation"
                  aria-label="Download image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.a>
                
                {/* Close button - Enhanced */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(null)
                    resetZoom()
                  }}
                  className="bg-black/60 hover:bg-red-600/80 active:bg-red-700 backdrop-blur-md rounded-full p-1.5 sm:p-2 md:p-2.5 lg:p-3 transition-all duration-200 border border-white/30 hover:border-white/50 touch-manipulation"
                  aria-label="Close lightbox"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Navigation buttons */}
            {galleryItems.length > 1 && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                  className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 active:bg-black backdrop-blur-md rounded-full p-2.5 sm:p-3 md:p-4 lg:p-5 transition-all duration-200 border border-white/30 hover:border-white/50 touch-manipulation shadow-xl"
                  aria-label="Previous image"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={20} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                  className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 active:bg-black backdrop-blur-md rounded-full p-2.5 sm:p-3 md:p-4 lg:p-5 transition-all duration-200 border border-white/30 hover:border-white/50 touch-manipulation shadow-xl"
                  aria-label="Next image"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={20} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </motion.button>
              </>
            )}

            {/* Enhanced Image container with smooth transitions */}
            <div className="relative w-full h-full flex items-center justify-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-20 md:pb-24 lg:pb-28 overflow-hidden">
              <div
                className="relative inline-block max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage.image}
                    ref={lightboxImageRef}
                    src={selectedImage.image || "/placeholder.svg"}
                    alt={selectedImage.text || "Gallery image"}
                    style={{ 
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`, 
                      transition: pinchStartDist ? 'none' : 'transform 200ms ease-out' 
                    }}
                    className="max-w-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] md:max-h-[80vh] object-contain rounded-lg sm:rounded-xl shadow-2xl will-change-transform"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: isLightboxTransitioning ? 0.5 : 1,
                      scale: isLightboxTransitioning ? 0.95 : 1
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                
                {/* Zoom reset button - Enhanced */}
                {zoomScale > 1 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      resetZoom()
                    }}
                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/70 hover:bg-black/90 active:bg-black backdrop-blur-md text-white rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold border border-white/30 hover:border-white/50 transition-all duration-200 touch-manipulation z-20 shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset Zoom
                  </motion.button>
                )}
                
                {/* Zoom indicator */}
                {zoomScale > 1 && (
                  <motion.div
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/70 backdrop-blur-md text-white rounded-full px-3 py-2 text-xs sm:text-sm font-medium border border-white/30 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Math.round(zoomScale * 100)}%
                  </motion.div>
                )}
              </div>
            </div>

            {/* Enhanced Bottom hint for mobile */}
            {galleryItems.length > 1 && (
              <motion.div 
                className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 sm:hidden z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
                  <p className="text-xs text-white/90 font-medium">
                    Swipe to navigate
                  </p>
                  <div className="flex gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
      {/* Enhanced View more button */}
      <div className="relative z-10 mt-12 sm:mt-16 md:mt-20 flex justify-center px-4">
        <motion.a
          href="/gallery"
          className={`${cormorant.className} group inline-flex items-center gap-3 px-10 sm:px-12 md:px-16 lg:px-20 py-4 sm:py-5 md:py-6 rounded-lg font-semibold transition-all duration-300 uppercase tracking-[0.2em] text-sm sm:text-base md:text-lg whitespace-nowrap relative overflow-hidden bg-gradient-to-r from-[#4a5d4e] to-[#3d4d3f] text-white border-2 border-[#4a5d4e] shadow-[0_4px_16px_rgba(74,93,78,0.4)] hover:shadow-[0_8px_24px_rgba(74,93,78,0.5)]`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#3d4d3f] to-[#4a5d4e] opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          
          <span className="relative z-10">View Full Gallery</span>
          <motion.div
            className="relative z-10"
            animate={{
              x: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:translate-x-2" />
          </motion.div>
          
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.a>
      </div>

      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" />
    </Section>
  )
}
