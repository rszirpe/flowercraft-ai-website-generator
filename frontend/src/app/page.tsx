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
  const [activeTab, setActiveTab] = useState('create')
  
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
    <main className="h-screen w-screen overflow-hidden relative bg-black">
      {/* iOS-STYLE PREMIUM GRADIENT BACKGROUND */}
      <div className="absolute inset-0">
        {/* Premium gradient mesh like iOS */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-600 via-blue-500 to-cyan-500 opacity-30"></div>
        
        {/* Subtle floating orbs for depth */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        
        {/* iOS-style mesh gradient overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 0%),
                          radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.15) 0px, transparent 50%),
                          radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.15) 0px, transparent 50%),
                          radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.15) 0px, transparent 50%),
                          radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.15) 0px, transparent 50%),
                          radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.15) 0px, transparent 50%),
                          radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.15) 0px, transparent 50%)`
        }}></div>
        
        {/* Noise texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* iOS-STYLE PREMIUM HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* PREMIUM LOGO */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  FlowerCraft Pro
                </h1>
                <p className="text-white/60 text-xs font-medium">
                  Powered by Gemini 2.0 Flash • Professional Edition
                </p>
              </div>
            </div>

            {/* iOS-STYLE ACTION BUTTONS */}
            <div className="flex items-center space-x-3">
              {/* QUICK DEMO - iOS Style */}
              <button
                onClick={handleQuickDemo}
                className="px-5 py-2.5 bg-white/20 backdrop-blur-xl text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Demo</span>
              </button>

              {/* DOWNLOAD - iOS Style */}
              <div className="relative">
                <button
                  onClick={handleDownloadLatest}
                  disabled={!hasGeneratedWebsites}
                  className="px-5 py-2.5 bg-white/20 backdrop-blur-xl text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Download</span>
                </button>
              
                {/* iOS-Style Download Menu */}
                {showDownloadMenu && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-black/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-slideIn">
                    <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Recent Creations</p>
                    </div>
                    <div className="p-2">
                      {recentWebsites.map((website, index) => (
                        <button
                          key={website.id}
                          onClick={() => downloadWebsite(website.id)}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-white/90 text-sm font-medium">{website.name}</p>
                              <p className="text-white/40 text-xs">{website.size}</p>
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* NEW - iOS Style */}
              {(isGenerating || generatedWebsite) && (
                <button
                  onClick={handleStartOver}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* iOS-STYLE MAIN CONTENT */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 pt-24 pb-8">
        {!websiteId && !isGenerating && !generatedWebsite && (
          <div className="w-full max-w-7xl">
            {/* iOS-STYLE HERO SECTION */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-white/10 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-white/80 text-sm font-medium">Gemini 2.0 Flash Active</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Create Beautiful
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Websites
                </span>
              </h1>
              
              <p className="text-xl text-white/60 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
                Professional-grade website generation powered by advanced AI.
                Beautiful, responsive, and ready in seconds.
              </p>

              {/* iOS-STYLE FEATURE PILLS */}
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { text: 'AI-Powered', icon: '🤖' },
                  { text: '5-Second Generation', icon: '⚡' },
                  { text: 'Premium Design', icon: '✨' },
                  { text: 'Mobile-First', icon: '📱' },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/15 transition-all duration-200"
                  >
                    <span>{badge.icon}</span>
                    <span className="text-white/80 text-sm font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* iOS-STYLE CARD CONTAINER */}
            <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* TAB BAR */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'create'
                      ? 'text-white bg-white/10 border-b-2 border-blue-500'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  Create
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'templates'
                      ? 'text-white bg-white/10 border-b-2 border-blue-500'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'history'
                      ? 'text-white bg-white/10 border-b-2 border-blue-500'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  History
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="p-8">
                {activeTab === 'create' && (
                  <WebsiteForm onWebsiteGenerated={handleWebsiteGenerated} />
                )}
                {activeTab === 'templates' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="text-white/80 text-lg font-semibold mb-2">Premium Templates</h3>
                    <p className="text-white/40 text-sm">Coming soon with 50+ professional templates</p>
                  </div>
                )}
                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {recentWebsites.map((website, index) => (
                      <div
                        key={website.id}
                        className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                              <span className="text-lg">🌐</span>
                            </div>
                            <div>
                              <p className="text-white/90 font-medium">{website.name}</p>
                              <p className="text-white/40 text-sm">Created 2 hours ago • {website.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadWebsite(website.id)}
                            className="px-4 py-2 bg-white/10 rounded-xl text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/20"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* iOS-STYLE GENERATION STATUS */}
        {isGenerating && websiteId && (
          <div className="w-full h-full flex items-center justify-center px-6">
            <div className="max-w-xl w-full">
              <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8">
                <GenerationStatus 
                  websiteId={websiteId} 
                  onComplete={handleGenerationComplete}
                />
              </div>
            </div>
          </div>
        )}

        {/* iOS-STYLE PREVIEW */}
        {generatedWebsite && (
          <div className="w-full h-full flex items-center justify-center px-6">
            <div className="max-w-6xl w-full">
              <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6">
                <WebsitePreview 
                  website={generatedWebsite}
                  onStartOver={handleStartOver}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* iOS-STYLE BOTTOM BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              {[
                { number: '15+', label: 'Templates' },
                { number: '10K+', label: 'Generated' },
                { number: '5s', label: 'Average Time' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-semibold text-white">{stat.number}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-black/20"
                    style={{ zIndex: 5 - i }}
                  />
                ))}
              </div>
              <div className="text-sm text-white/80">
                <span className="font-semibold">1,247</span>
                <span className="text-white/60"> users online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}