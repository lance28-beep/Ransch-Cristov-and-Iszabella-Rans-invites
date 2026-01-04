import fs from "fs/promises"
import path from "path"
import MasonryGallery from "@/components/masonry-gallery"
import { TornPaperEdge } from "@/components/torn-paper-edge"

// Generate on each request so newly added images in public/ appear without a rebuild
export const dynamic = "force-dynamic"

async function getImagesFrom(dir: string) {
  const abs = path.join(process.cwd(), "public", dir)
  try {
    const entries = await fs.readdir(abs, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile())
      .map((e) => `/${dir}/${e.name}`)
      .filter((p) => p.match(/\.(jpe?g|png|webp|gif)$/i))
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const [desktop, mobile] = await Promise.all([
    getImagesFrom("desktop-background"),
    getImagesFrom("mobile-background"),
  ])
  const images = [
    ...desktop.map((src) => ({ src, category: "desktop" as const })),
    ...mobile.map((src) => ({ src, category: "mobile" as const })),
  ]

  return (
    <main className="min-h-screen text-[#4a5d4e] relative overflow-hidden font-sans">
      {/* Torn paper edge at top */}
      <TornPaperEdge position="top" />
      
      {/* Paper texture base - matching Narrative section */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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

      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
          {/* Decorative element above title */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/50 border border-[#4a5d4e]/40" />
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </div>
          
          <h1
            className="style-script-regular text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4a5d4e] mb-2 sm:mb-3 md:mb-4"
            style={{ 
              letterSpacing: "0.02em",
              textShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)"
            }}
          >
            Baptism of Ransch Cristov Penales and Iszabella Rans Penales
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#4a5d4e]/85 font-light max-w-2xl mx-auto leading-relaxed px-2 font-sans italic" style={{ 
            letterSpacing: "0.02em",
            textShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)"
          }}>
            and the 1st Birthday of our dear Ransch Cristov Penales
          </p>
          
          {/* Decorative element below subtitle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4a5d4e]/50 border border-[#4a5d4e]/40" />
            <div className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-[#4a5d4e]/40 to-[#4a5d4e]/60" />
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center text-[#4a5d4e]/80">
            <p className="font-light font-sans">
              No images found. Add files to{" "}
              <code className="px-2 py-1 bg-[#4a5d4e]/10 rounded border border-[#4a5d4e]/20 text-[#4a5d4e] font-sans">
                public/desktop-background
              </code>{" "}
              or{" "}
              <code className="px-2 py-1 bg-[#4a5d4e]/10 rounded border border-[#4a5d4e]/20 text-[#4a5d4e] font-sans">
                public/mobile-background
              </code>
              .
            </p>
          </div>
        ) : (
          <MasonryGallery images={images} />
        )}
      </section>

      {/* Torn paper edge at bottom */}
      <TornPaperEdge position="bottom" />
    </main>
  )
}


