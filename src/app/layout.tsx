import type { Metadata, Viewport } from "next"
import { Geist, JetBrains_Mono, Public_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
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
  description: "Track your daily hydration with SipSense",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(geist.variable, jetbrainsMono.variable, "font-sans", publicSans.variable)}>
      <body>
        <AuthProvider>
          <div className="mobile-container">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
