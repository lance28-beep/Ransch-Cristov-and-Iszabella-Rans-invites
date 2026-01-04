"use client"

import { useEffect } from "react"
import { useAudio } from "@/contexts/audio-context"

const BackgroundMusic = () => {
  const { audioRef } = useAudio()

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) return

    // Try to play immediately on page load
    const tryAutoplay = () => {
      audioEl.play().catch((error) => {
        console.log("Autoplay blocked, waiting for user interaction:", error)
        // If autoplay fails, set up user interaction listeners
        setupUserInteraction()
      })
    }

    const handleUserInteraction = () => {
      audioEl.play().then(() => {
        document.removeEventListener("click", handleUserInteraction)
        document.removeEventListener("touchstart", handleUserInteraction)
      }).catch((error) => {
        console.log("Playback blocked:", error)
      })
    }

    const setupUserInteraction = () => {
      document.addEventListener("click", handleUserInteraction)
      document.addEventListener("touchstart", handleUserInteraction)
    }

    // Attempt autoplay immediately
    tryAutoplay()

    return () => {
      audioRef.current?.pause()
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [audioRef])

  return (
    <audio
      ref={audioRef}
      // Use an encoded URI to avoid issues with spaces/parentheses on some mobile browsers
      src={encodeURI("/background_music/For This Child - Baby Dedication Song - Ken Blount.mp3")}
      loop
      preload="auto"
      // playsInline helps iOS treat this as inline media rather than requiring fullscreen behavior
      playsInline
      // Keep element non-visible; playback is initiated on first user interaction
      style={{ display: "none" }}
    />
  )
}

export default BackgroundMusic