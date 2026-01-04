"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { siteConfig } from "@/content/site"
import StaggeredMenu from "./StaggeredMenu"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#countdown", label: "Countdown" },
  { href: "#gallery", label: "Gallery" },
  { href: "#messages", label: "Messages" },
  { href: "#details", label: "Details" },
  { href: "#entourage", label: "Entourage" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#guest-list", label: "RSVP" },
  { href: "#registry", label: "Registry" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current != null) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener("scroll", onScroll as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sectionIds = navLinks.map(l => l.href.substring(1))
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))
        if (visible.length > 0) {
          const topMost = visible[0]
          if (topMost.target && topMost.target.id) {
            const newActive = `#${topMost.target.id}`
            setActiveSection(prev => (prev === newActive ? prev : newActive))
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const menuItems = useMemo(() => navLinks.map((l) => ({ label: l.label, ariaLabel: `Go to ${l.label}`, link: l.href })), [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? "backdrop-blur-xl shadow-[0_10px_40px_rgba(163,141,120,0.15)] border-b border-[#CBB9A3]/50"
          : "backdrop-blur-lg border-b border-[#CBB9A3]/40"
      }`}
      style={{
        background: isScrolled 
          ? 'linear-gradient(135deg, rgba(209, 230, 240, 0.96) 0%, rgba(254, 217, 213, 0.96) 100%)'
          : 'linear-gradient(135deg, rgba(209, 230, 240, 0.92) 0%, rgba(254, 217, 213, 0.92) 100%)'
      }}
    >
      {/* Elegant glow effect when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#D1E6F0]/20 via-[#FED9D5]/10 to-[#D1E6F0]/20 pointer-events-none" />
      )}
      {/* Subtle texture overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#FED9D5]/8 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <div 
                className="text-center group-hover:scale-110 group-active:scale-105 transition-all duration-500"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: 'rgb(74, 93, 78)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                R | I
              </div>
            </div>
            
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#CBB9A3]/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
          </Link>

          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 text-xs lg:text-sm uppercase rounded-lg transition-all duration-500 relative group ${
                    isActive
                      ? "text-[#4a5d4e] bg-[#F4F1EA]/95 backdrop-blur-md shadow-[0_6px_18px_rgba(74,93,78,0.2)] border border-[#CBB9A3]"
                      : "text-[#4a5d4e]/80 hover:text-[#4a5d4e] hover:bg-[#F4F1EA]/95 hover:border hover:border-[#CBB9A3]/60 hover:shadow-[0_6px_18px_rgba(74,93,78,0.15)] hover:scale-105 active:scale-95 bg-white/0 border border-transparent"
                  }`}
                  style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 400 }}
                >
                  {link.label.toUpperCase()}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#4a5d4e] via-[#CBB9A3] to-[#4a5d4e] transition-all duration-500 rounded-full ${
                      isActive
                        ? "w-full shadow-[0_0_10px_rgba(74,93,78,0.4)]"
                        : "w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(74,93,78,0.3)]"
                    }`}
                  />
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4a5d4e] animate-pulse shadow-[0_0_6px_rgba(74,93,78,0.5)]" />
                  )}
                  {/* Subtle accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#CBB9A3]/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center h-full">
            {/* Decorative halo to improve tap target and visual affordance */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#B9AACB]/20 via-[#A8AF8D]/14 to-transparent blur-md pointer-events-none" />
              <StaggeredMenu
                position="left"
                items={menuItems}
                socialItems={[]}
                displaySocials={false}
                displayItemNumbering={true}
                menuButtonColor="#4a5d4e"
                openMenuButtonColor="#4a5d4e"
                changeMenuColorOnOpen={true}
                colors={["#4a5d4e", "#B9AACB", "#F4F4F4", "#A8AF8D", "#5B6B3C"]}
                accentColor="#B9AACB"
                isFixed={true}
                onMenuOpen={() => {}}
                onMenuClose={() => {}}
              />
            </div>
          </div>
        </div>

      </div>
    </nav>
  )
}
