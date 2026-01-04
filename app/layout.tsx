import type React from "react"
import type { Metadata, Viewport } from "next"
import { Great_Vibes, Inter, Imperial_Script, Cinzel } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { siteConfig } from "@/content/site"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ransch-cristov-and-iszabella-rans-inv.netlify.app/"
const canonicalUrl = siteUrl.replace(/\/$/, "")
const desktopHero = "/Details/LinkPreview.jpg"
const mobileHero = "/Details/LinkPreview.jpg"
const eventImageUrl = `${canonicalUrl}${desktopHero}`

const childrenNames = "Ransch Cristov Penales & Iszabella Rans Penales"
const eventTitle = `${childrenNames} - Baptism & Birthday Invitation`
const eventDescription = `Please join us in celebrating a day filled with faith and love — the Baptism of Ransch Cristov Penales and Iszabella Rans Penales, and the 1st Birthday of our dear Ransch Cristov Penales.`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${childrenNames} - Baptism & Birthday Celebration`,
  startDate: "2026-03-06T14:00:00+08:00",
  endDate: "2026-03-06T22:00:00+08:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: [
    {
      "@type": "Place",
      name: siteConfig.ceremony.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.ceremony.venue,
        addressLocality: siteConfig.ceremony.location,
        addressRegion: siteConfig.ceremony.location,
        addressCountry: "PH",
      },
    },
    {
      "@type": "Place",
      name: siteConfig.reception.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.reception.location,
        addressLocality: siteConfig.reception.location,
        addressRegion: siteConfig.reception.location,
        addressCountry: "PH",
      },
    },
  ],
  image: [eventImageUrl],
  description:
    `Please join us in celebrating a day filled with faith and love — the Baptism of Ransch Cristov Penales and Iszabella Rans Penales, and the 1st Birthday of our dear Ransch Cristov Penales.`,
  organizer: {
    "@type": "Person",
    name: childrenNames,
  },
  eventHashtag: "#RanschCristovAndIszabellaRans",
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-serif" })
const imperialScript = Imperial_Script({ subsets: ["latin"], weight: "400", variable: "--font-imperial-script" })
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cinzel" })

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: eventTitle,
    template: `%s | ${childrenNames}`,
  },
  description: eventDescription,
  keywords:
    `Ransch Cristov Penales, Iszabella Rans Penales, baptism, birthday, 1st birthday, baptism celebration, ${siteConfig.ceremony.venue} baptism, ${siteConfig.reception.venue} celebration, baptism invitation, birthday invitation, RSVP, celebration gallery, message wall, #RanschCristovAndIszabellaRans, #CristovAndIszabellaBaptism`,
  applicationName: `${childrenNames} - Baptism & Birthday Invitation`,
  authors: [
    { name: "Ransch Cristov Penales" },
    { name: "Iszabella Rans Penales" },
  ],
  creator: childrenNames,
  publisher: childrenNames,
  category: "Event",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: canonicalUrl,
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/favicon_io/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicon_io/android-chrome-512x512.png" },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title: `${childrenNames} | ${siteConfig.wedding.date}`,
    description:
      `Please join us in celebrating a day filled with faith and love — the Baptism of Ransch Cristov Penales and Iszabella Rans Penales, and the 1st Birthday of our dear Ransch Cristov Penales on ${siteConfig.wedding.date}. RSVP and find important details for the celebration.`,
    url: canonicalUrl,
    siteName: `${childrenNames} - Baptism & Birthday Celebration`,
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: eventImageUrl,
        secureUrl: eventImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${childrenNames} - Baptism & Birthday Invitation - ${siteConfig.wedding.date}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${childrenNames} - Baptism & Birthday Invitation`,
    description:
      `Please join us in celebrating a day filled with faith and love — the Baptism of Ransch Cristov Penales and Iszabella Rans Penales, and the 1st Birthday of our dear Ransch Cristov Penales on ${siteConfig.wedding.date}. RSVP and get all the details for the celebration! #RanschCristovAndIszabellaRans #CristovAndIszabellaBaptism`,
    images: [eventImageUrl],
    creator: "@RanschCristovAndIszabellaRans",
    site: "@RanschCristovAndIszabellaRans",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    title: childrenNames,
    statusBarStyle: "default",
    capable: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#D2A4A4",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#D2A4A4" />
        <meta name="format-detection" content="telephone=yes,email=no,address=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Style+Script&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href={mobileHero} media="(max-width: 767px)" />
        <link rel="preload" as="image" href={desktopHero} media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/Details/St. Augustine Parish Church.jpg" />
        <link rel="preload" as="image" href="/Details/La Mariposa Tagaytay Events Place.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body
        className={`${inter.variable} ${greatVibes.variable} ${imperialScript.variable} ${cinzel.variable} font-inter antialiased text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
