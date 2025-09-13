'use client'

import { useState } from 'react'
import type { GeneratedWebsite } from '@/types'
import WebsiteForm from '@/components/WebsiteForm'
import WebsitePreview from '@/components/WebsitePreview'
import GenerationStatus from '@/components/GenerationStatus'

export default function Home() {
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null)

  const handleWebsiteGenerated = (id: string) => {
    setWebsiteId(id)
    setIsGenerating(true)
  }

  const handleGenerationComplete = (website: GeneratedWebsite) => {
    setGeneratedWebsite(website)
    setIsGenerating(false)
  }

  const handleStartOver = () => {
    setWebsiteId(null)
    setIsGenerating(false)
    setGeneratedWebsite(null)
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Flower-inspired organic background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Petal layers */}
        <div className="absolute -top-64 -right-64 w-96 h-96 bg-gradient-to-br from-rose-200/40 via-pink-300/30 to-purple-200/40 rounded-full mix-blend-multiply filter blur-2xl animate-petal"></div>
        <div className="absolute -bottom-32 -left-48 w-80 h-80 bg-gradient-to-tr from-yellow-200/40 via-orange-200/30 to-red-200/40 rounded-full mix-blend-multiply filter blur-xl animate-petal animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-bl from-violet-200/40 via-purple-300/30 to-indigo-200/40 rounded-full mix-blend-multiply filter blur-xl animate-petal animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-tl from-emerald-200/40 via-teal-300/30 to-cyan-200/40 rounded-full mix-blend-multiply filter blur-xl animate-dewdrop"></div>
        
        {/* Organic texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/40 backdrop-blur-[1px]"></div>
        
        {/* Sunlight effect */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-yellow-100/20 via-transparent to-transparent"></div>
      </div>

      {/* Elegant Header - like morning dew on petals */}
      <header className="relative backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-xl shadow-rose-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-50/80 via-white/90 to-violet-50/80"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              {/* Flower-inspired logo */}
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-500 to-violet-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/30 transform hover:scale-110 transition-all duration-500 animate-bloom">
                  <span className="text-white font-black text-2xl filter drop-shadow-lg">🌸</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-dewdrop shadow-lg"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-shimmer"></div>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-4xl font-black bg-gradient-to-r from-rose-600 via-violet-600 to-purple-700 bg-clip-text text-transparent filter drop-shadow-sm">
                  FlowerCraft AI
                </h1>
                <p className="text-sm text-gray-600 font-semibold bg-gradient-to-r from-rose-500/80 to-violet-500/80 bg-clip-text text-transparent">
                  ✨ Powered by Google Gemini AI ✨
                </p>
              </div>
            </div>
            {(isGenerating || generatedWebsite) && (
              <button
                onClick={handleStartOver}
                className="px-6 py-3 text-sm font-bold text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border-2 border-purple-600 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                🚀 Create New
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {!websiteId && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-8">
              <div className="space-y-4">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-100/80 via-pink-100/80 to-violet-100/80 rounded-full text-rose-700 text-sm font-bold border border-rose-200/50 backdrop-blur-sm shadow-lg shadow-rose-500/10 animate-shimmer">
              🌸 Crafted with Google Gemini AI Magic 🌸
            </div>
            <h2 className="text-6xl md:text-8xl font-black leading-tight filter drop-shadow-lg">
              <span className="bg-gradient-to-br from-rose-600 via-pink-600 to-violet-700 bg-clip-text text-transparent animate-bloom">
                Bloom
              </span>
              {' '}
              <span className="text-gray-800">into</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent animate-shimmer">
                Beautiful
              </span>
              {' '}
              <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 bg-clip-text text-transparent animate-dewdrop">
                Websites
              </span>
            </h2>
            <p className="text-xl md:text-2xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text text-transparent max-w-4xl mx-auto font-medium leading-relaxed">
              Like nature's perfect symmetry in a flower, our AI creates websites with exquisite detail, 
              organic flow, and stunning visual harmony. Each site blooms with professional beauty! 🌺✨
            </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {[
                  { icon: '🤖', text: 'AI-Powered', color: 'from-blue-500 to-cyan-500' },
                  { icon: '📱', text: 'Mobile-First', color: 'from-green-500 to-emerald-500' },
                  { icon: '⚡', text: 'Lightning Fast', color: 'from-yellow-500 to-orange-500' },
                  { icon: '🎨', text: 'Beautiful Design', color: 'from-purple-500 to-pink-500' },
                  { icon: '🚀', text: 'Instant Deploy', color: 'from-indigo-500 to-purple-500' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${feature.color} text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 cursor-default`}
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="font-bold">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                  <div className="text-3xl font-black text-purple-600 mb-2">15+</div>
                  <div className="text-gray-700 font-semibold">Website Types</div>
                </div>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                  <div className="text-3xl font-black text-pink-600 mb-2">30+</div>
                  <div className="text-gray-700 font-semibold">Features Available</div>
                </div>
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                  <div className="text-3xl font-black text-blue-600 mb-2">&lt;2min</div>
                  <div className="text-gray-700 font-semibold">Generation Time</div>
                </div>
              </div>
            </div>

            {/* Website Form */}
            <WebsiteForm onWebsiteGenerated={handleWebsiteGenerated} />
          </>
        )}

        {isGenerating && websiteId && (
          <GenerationStatus 
            websiteId={websiteId} 
            onComplete={handleGenerationComplete}
          />
        )}

        {generatedWebsite && (
          <WebsitePreview 
            website={generatedWebsite}
            onStartOver={handleStartOver}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
              <span>✨</span>
              <span>AI WebCraft</span>
              <span>✨</span>
            </div>
            <p className="text-purple-200 max-w-2xl mx-auto">
              Empowering creators with AI-driven website generation. 
              Built with love using Next.js, FastAPI, and Google Gemini AI.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="text-purple-300">© 2024 AI WebCraft</span>
              <span className="text-purple-400">•</span>
              <span className="text-purple-300">Made with 💜 and AI</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}