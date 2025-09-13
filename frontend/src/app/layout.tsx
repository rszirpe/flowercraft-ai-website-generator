import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '🌸 FlowerCraft AI - Beautiful Website Generator',
  description: 'Create stunning, professional websites with AI-powered generation. Flower-inspired design meets cutting-edge technology.',
  keywords: 'AI, website generator, Gemini AI, beautiful design, responsive websites',
  authors: [{ name: 'Rishi' }],
  openGraph: {
    title: '🌸 FlowerCraft AI Website Generator',
    description: 'Create stunning websites with the beauty of nature and the power of AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}