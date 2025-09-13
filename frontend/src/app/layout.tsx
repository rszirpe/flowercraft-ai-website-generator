import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}