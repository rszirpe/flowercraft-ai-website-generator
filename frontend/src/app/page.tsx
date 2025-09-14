'use client'

import { useState, useEffect } from 'react'
import type { GeneratedWebsite } from '@/types'
import WebsiteForm from '@/components/WebsiteForm'
import WebsitePreview from '@/components/WebsitePreview'
import GenerationStatus from '@/components/GenerationStatus'

export default function Home() {
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [hasGeneratedWebsites, setHasGeneratedWebsites] = useState(false)
  const [recentWebsites, setRecentWebsites] = useState<Array<{id: string, name: string, size: string}>>>([])
  
  // Check for recent websites on load
  useEffect(() => {
    // This would typically fetch from localStorage or API
    const mockRecentWebsites = [
      { id: 'bloom-creative', name: 'Bloom Creative Studio', size: '2.1KB' },
      { id: 'elite-consulting', name: 'Elite Consulting Group', size: '1.7KB' },
      { id: 'powerfit-gym', name: 'PowerFit Gym', size: '1.8KB' }
    ]
    setRecentWebsites(mockRecentWebsites)
    setHasGeneratedWebsites(mockRecentWebsites.length > 0)
  }, [])

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

  const handleQuickDemo = async () => {
    // Generate a quick demo website
    const demoData = {
      website_type: "Technology",
      business_name: "TechVision Pro",
      description: "Cutting-edge technology solutions for modern businesses",
      target_audience: "Business professionals and tech enthusiasts",
      color_scheme: "Modern Blue & White",
      features: ["Services Section", "Contact Form"],
      pages: ["Home", "About", "Contact"]
    }

    try {
      const response = await fetch('http://localhost:8000/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      })
      
      if (response.ok) {
        const result = await response.json()
        handleWebsiteGenerated(result.id)
      }
    } catch (error) {
      console.error('Quick demo failed:', error)
    }
  }

  const handleDownloadLatest = () => {
    setShowDownloadMenu(!showDownloadMenu)
  }

  const downloadWebsite = async (websiteId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/download/${websiteId}`)
      if (response.ok) {
        const data = await response.json()
        
        // Create and download files
        const files = [
          { name: 'index.html', content: data.html, type: 'text/html' },
          { name: 'style.css', content: data.css, type: 'text/css' },
          { name: 'script.js', content: data.js, type: 'text/javascript' }
        ]
        
        files.forEach(file => {
          const blob = new Blob([file.content], { type: file.type })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = file.name
          link.click()
          URL.revokeObjectURL(url)
        })
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
    setShowDownloadMenu(false)
  }

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      {/* STUNNING COLOR EXPLOSION BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple animated gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-orange-500 to-red-500 opacity-70 animate-pulse animation-delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-600 opacity-60 animate-pulse animation-delay-2000"></div>
        
        {/* Floating color orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-xl opacity-80 animate-float"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-xl opacity-70 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-75 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-80 animate-float animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-xl opacity-70 animate-float animation-delay-1500 transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Radial color bursts */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-pink-500/30 via-purple-500/20 to-transparent animate-spin-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-cyan-500/30 via-blue-500/20 to-transparent animate-spin-slow animation-delay-2000"></div>
        
        {/* Prismatic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      {/* FLOATING HEADER WITH VIBRANT BUTTONS */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          {/* STUNNING LOGO */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/50 transform hover:scale-110 transition-all duration-500 animate-bloom">
                <span className="text-white font-black text-2xl filter drop-shadow-lg animate-shimmer">🌸</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-full blur opacity-75 animate-pulse"></div>
            </div>
            
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent filter drop-shadow-lg">
                FlowerCraft AI
              </h1>
              <p className="text-white/90 text-sm font-semibold filter drop-shadow-sm">
                ✨ Powered by Gemini 2.0 Flash ✨
              </p>
            </div>
          </div>

          {/* STUNNING ACTION BUTTONS */}
          <div className="flex items-center space-x-4">
            {/* QUICK DEMO - Glowing Button */}
            <button
              onClick={handleQuickDemo}
              className="relative group px-6 py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white font-bold rounded-full shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transform hover:scale-110 transition-all duration-300 animate-glow"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center space-x-2">
                <span className="animate-bounce">🚀</span>
                <span>Quick Demo</span>
              </div>
            </button>

            {/* DOWNLOAD - Spectacular Button */}
            <div className="relative">
              <button
                onClick={handleDownloadLatest}
                disabled={!hasGeneratedWebsites}
                className="relative group px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-bold rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-110 transition-all duration-300 animate-glow disabled:opacity-50"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center space-x-2">
                  <span className="animate-bounce animation-delay-500">📥</span>
                  <span>Download</span>
                  <span className="animate-bounce animation-delay-1000">⬇️</span>
                </div>
              </button>
              
              {/* Magical Download Dropdown */}
              {showDownloadMenu && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-3 z-50 animate-slideIn">
                  <div className="px-4 py-2 text-xs font-semibold text-purple-600 border-b border-purple-100">
                    ✨ Recent Masterpieces
                  </div>
                  {recentWebsites.map((website, index) => (
                    <button
                      key={website.id}
                      onClick={() => downloadWebsite(website.id)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 flex items-center justify-between transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="font-medium">{website.name}</span>
                      <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full">
                        {website.size}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* NEW WEBSITE - Magical Button */}
            {(isGenerating || generatedWebsite) && (
              <button
                onClick={handleStartOver}
                className="relative group px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transform hover:scale-110 transition-all duration-300 animate-glow"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center space-x-2">
                  <span className="animate-spin">✨</span>
                  <span>New Website</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SPECTACULAR FULL-SCREEN CONTENT */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        {!websiteId && !isGenerating && !generatedWebsite && (
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE - STUNNING HERO */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full border border-white/30 animate-fadeIn">
                  🌟 Powered by Gemini 2.0 Flash 🌟
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent filter drop-shadow-2xl animate-textShimmer">
                    Create
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent filter drop-shadow-2xl animate-textShimmer animation-delay-500">
                    Magical
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent filter drop-shadow-2xl animate-textShimmer animation-delay-1000">
                    Websites
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed filter drop-shadow-lg">
                  Experience the magic of AI-powered creativity. 
                  Professional websites that bloom with beauty and intelligence! 🌺✨
                </p>

                {/* SPECTACULAR FEATURE BADGES */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {[
                    { text: 'AI Magic', colors: 'from-pink-500 to-rose-500', icon: '🤖' },
                    { text: 'Lightning Fast', colors: 'from-yellow-500 to-orange-500', icon: '⚡' },
                    { text: 'Stunning Design', colors: 'from-purple-500 to-indigo-500', icon: '🎨' },
                    { text: 'Mobile Perfect', colors: 'from-emerald-500 to-teal-500', icon: '📱' },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 bg-gradient-to-r ${badge.colors} text-white rounded-full font-bold text-sm shadow-xl transform hover:scale-110 transition-all duration-300 animate-bounce`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <span className="mr-2">{badge.icon}</span>
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - MAGICAL FORM */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-slideUp">
                <WebsiteForm onWebsiteGenerated={handleWebsiteGenerated} />
              </div>
            </div>
          </div>
        )}

        {/* GENERATION STATUS - FULL SCREEN SPECTACLE */}
        {isGenerating && websiteId && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative max-w-2xl w-full">
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12">
                <GenerationStatus 
                  websiteId={websiteId} 
                  onComplete={handleGenerationComplete}
                />
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW - SPECTACULAR FULL SCREEN */}
        {generatedWebsite && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative max-w-6xl w-full">
              <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <WebsitePreview 
                  website={generatedWebsite}
                  onStartOver={handleStartOver}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING STATS - NO FOOTER NEEDED */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-6">
          {[
            { number: '15+', label: 'Website Types', color: 'from-pink-500 to-rose-500' },
            { number: '10K+', label: 'AI Characters', color: 'from-purple-500 to-indigo-500' },
            { number: '<30s', label: 'Generation', color: 'from-cyan-500 to-blue-500' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`px-4 py-3 bg-gradient-to-r ${stat.color} text-white rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 text-center animate-bounce`}
              style={{ animationDelay: `${index * 300}ms` }}
            >
              <div className="text-lg font-black">{stat.number}</div>
              <div className="text-xs font-medium opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}