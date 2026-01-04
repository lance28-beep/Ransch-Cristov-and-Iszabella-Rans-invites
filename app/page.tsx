"use client"

import { Suspense, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { AudioProvider } from "@/contexts/audio-context"
import { Hero as MainHero } from "@/components/sections/hero"
import { Invitation } from "@/components/sections/invitation"
import { Welcome } from "@/components/sections/welcome"
import { Countdown } from "@/components/sections/countdown"
import { WeddingTimeline } from "@/components/sections/wedding-timeline"
import { Gallery } from "@/components/sections/gallery"
import { Messages } from "@/components/sections/messages"
import { Details } from "@/components/sections/details"
import { Entourage } from "@/components/sections/entourage"
import { PrincipalSponsors } from "@/components/sections/principal-sponsors"
import { BookOfGuests } from "@/components/sections/book-of-guests"
import { Registry } from "@/components/sections/registry"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"
import { Hero as InvitationHero } from "@/components/loader/Hero"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { Navbar } from "@/components/navbar"
import { AppState } from "@/components/types"
import BackgroundMusic from "@/components/background-music"
import { SnapShare } from "@/components/sections/snap-share"
import { Narrative } from "@/components/sections/narrative"
import { Celebration } from "@/components/sections/celebration"

const Silk = dynamic(() => import("@/components/silk"), { ssr: false })
const GuestList = dynamic(() => import("@/components/sections/guest-list").then(mod => ({ default: mod.GuestList })), { ssr: false })

export default function Home() {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING)
  const enableDecor = process.env.NEXT_PUBLIC_ENABLE_DECOR !== 'false'

  const handleLoadingComplete = useCallback(() => {
    setAppState(AppState.LANDING)
  }, [])

  const handleOpenInvitation = useCallback(() => {
    setAppState(AppState.DETAILS)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <AudioProvider>
      <div className="relative min-h-screen bg-cloud text-charcoal selection:bg-birch selection:text-nut overflow-hidden font-sans">
        {appState === AppState.LOADING && <LoadingScreen onComplete={handleLoadingComplete} />}

        <main className="relative w-full h-full">
          <InvitationHero onOpen={handleOpenInvitation} visible={appState === AppState.LANDING} />

          <div className={`transition-opacity duration-700 ${appState === AppState.DETAILS ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {enableDecor && <BackgroundMusic />}
            {enableDecor && (
              <div className="fixed inset-0 z-0 pointer-events-none">
                <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-primary/10 to-secondary/5" />}>
                  <Silk speed={5} scale={1.1} color="#FAF9F5" noiseIntensity={0.8} rotation={0.3} />
                </Suspense>
              </div>
            )}

            <div className="relative z-10">
              {appState === AppState.DETAILS && <Navbar />}
              <MainHero />
              <Invitation />  
              {/* <Welcome /> */}
              {/* <CoupleVideo /> */}
              <Narrative />
              {/* <Countdown /> */}
              <Gallery />
              <Messages />
              <Details />
              {/* <WeddingTimeline /> */}
              {/* <Entourage /> */}
              {/* <PrincipalSponsors /> */}
              <Celebration />
              <GuestList />
              {/* <BookOfGuests /> */}
              {/* <Registry /> */}
              <FAQ />
              <SnapShare />
              {/* <Invitation /> */}
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </AudioProvider>
  )
}
