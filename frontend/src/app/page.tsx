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
    <main className="min-h-screen bg-gray-50">
      {/* ChatGPT-style Professional Header */}
      <header className="relative bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section - ChatGPT style */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌸</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">FlowerCraft AI</h1>
              </div>
            </div>

            {/* Professional Action Buttons - ChatGPT style */}
            <div className="flex items-center space-x-3">
              {/* Quick Run Button */}
              <button
                onClick={handleQuickDemo}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quick Demo
              </button>

              {/* Download Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={handleDownloadLatest}
                  disabled={!hasGeneratedWebsites}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Download dropdown */}
                {showDownloadMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Recent Websites
                    </div>
                    {recentWebsites.map((website) => (
                      <button
                        key={website.id}
                        onClick={() => downloadWebsite(website.id)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="truncate">{website.name}</span>
                        <span className="text-xs text-gray-400">
                          {website.size}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* New Website Button */}
              {(isGenerating || generatedWebsite) && (
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Website
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {!websiteId && (
          <>
            {/* ChatGPT-style Hero Section */}
            <div className="text-center mb-16 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                  ✨ Powered by Google Gemini AI
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                  Create stunning websites
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    with AI precision
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Professional websites generated in seconds using advanced AI. 
                  Perfect for businesses, portfolios, and creative projects.
                </p>
              </div>

              {/* ChatGPT-style Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">Generate professional websites in under 30 seconds with AI-powered efficiency.</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful Design</h3>
                  <p className="text-gray-600 text-sm">Every website is crafted with modern design principles and responsive layouts.</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
                  <p className="text-gray-600 text-sm">Advanced Gemini AI understands your vision and creates custom content.</p>
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

      {/* ChatGPT-style Clean Footer */}
      <footer className="relative bg-gray-50/50 border-t border-gray-200/50 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-gray-700">
              <span>🌸</span>
              <span>FlowerCraft AI</span>
            </div>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Beautiful websites crafted with AI precision. 
              Built with Next.js, FastAPI, and Google Gemini AI.
            </p>
            <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
              <span>© 2024 FlowerCraft AI</span>
              <span>•</span>
              <span>Made with 🌸 and AI</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}