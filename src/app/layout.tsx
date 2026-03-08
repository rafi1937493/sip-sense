import type { Metadata, Viewport } from "next"
import { Geist, JetBrains_Mono, Public_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ReminderManager } from "@/components/features/reminder-manager"
import { PWASupport } from "@/components/features/pwa-support"
import { PWAInstallPrompt } from "@/components/features/pwa-install-prompt"
import { OfflineBanner } from "@/components/features/offline-banner"
import { cn } from "@/lib/utils"

const publicSans = Public_Sans({subsets:['latin'],variable:'--font-sans'});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "SipSense - Hydration Tracker",
  description: "Track your daily hydration naturally",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SipSense",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(geist.variable, jetbrainsMono.variable, "font-sans", publicSans.variable)}>
      <head>
        <meta name="application-name" content="SipSense" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SipSense" />
        <meta name="description" content="Track your daily hydration naturally" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a1628" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div className="mobile-container">{children}</div>
          <ReminderManager />
          <PWASupport />
          <PWAInstallPrompt />
          <OfflineBanner />
        </AuthProvider>
      </body>
    </html>
  )
}
