'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

interface WebsiteFormProps {
  onWebsiteGenerated: (id: string) => void
}

interface FormData {
  website_type: string
  business_name: string
  description: string
  target_audience: string
  color_scheme: string
  features: string[]
  pages: string[]
}

export default function WebsiteForm({ onWebsiteGenerated }: WebsiteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    website_type: '',
    business_name: '',
    description: '',
    target_audience: '',
    color_scheme: '',
    features: [],
    pages: ['Home', 'About', 'Contact']
  })
  
  const [customPage, setCustomPage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const websiteTypes = [
    'Business Website',
    'Portfolio',
    'E-commerce Store',
    'Blog',
    'Landing Page',
    'Restaurant',
    'Photography',
    'Consulting',
    'Non-profit',
    'Education',
    'Healthcare',
    'Real Estate',
    'Technology',
    'Creative Agency',
    'Personal',
    'Other'
  ]

  const colorSchemes = [
    'Modern Blue & White',
    'Professional Gray & Navy',
    'Vibrant Orange & Yellow',
    'Elegant Black & Gold',
    'Nature Green & Brown',
    'Creative Purple & Pink',
    'Minimalist Black & White',
    'Warm Red & Cream',
    'Cool Teal & Light Blue',
    'Custom (AI will choose)'
  ]

  const availableFeatures = [
    'Contact Form',
    'Image Gallery',
    'Testimonials',
    'Services Section',
    'Team Members',
    'FAQ Section',
    'Newsletter Signup',
    'Social Media Links',
    'Blog Section',
    'Portfolio Gallery',
    'Pricing Tables',
    'Location Map',
    'Live Chat',
    'Search Functionality',
    'Multi-language Support'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validation
    if (!formData.business_name.trim()) {
      setError('Business name is required')
      setIsSubmitting(false)
      return
    }

    if (!formData.website_type) {
      setError('Please select a website type')
      setIsSubmitting(false)
      return
    }

    if (!formData.description.trim()) {
      setError('Description is required')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiFetch('/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate website')
      }

      const result = await response.json()
      onWebsiteGenerated(result.id)
      
    } catch (err) {
      setError('Failed to generate website. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const addPage = () => {
    if (customPage.trim() && !formData.pages.includes(customPage.trim())) {
      setFormData(prev => ({
        ...prev,
        pages: [...prev.pages, customPage.trim()]
      }))
      setCustomPage('')
    }
  }

  const removePage = (page: string) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p !== page)
    }))
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
              ✨ Describe Your Vision
            </h2>
            <p className="text-gray-700 text-sm">
              Our enhanced Gemini 2.0 Flash AI will craft something extraordinary
            </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* MAGICAL COMPACT FORM */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
              placeholder="✨ Business Name"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white"
              required
            />
          </div>

          <div>
            <select
              value={formData.website_type}
              onChange={(e) => setFormData(prev => ({ ...prev, website_type: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white"
              required
            >
              <option value="">🎯 Website Type</option>
              {websiteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* MAGICAL DESCRIPTION */}
        <div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="🌟 Describe your vision... Our enhanced AI will create magic from your words!"
            rows={3}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white resize-none"
            required
          />
        </div>

        {/* COMPACT MAGICAL INPUTS */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.target_audience}
            onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
            placeholder="👥 Target Audience"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white"
          />

          <select
            value={formData.color_scheme}
            onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <option value="">🎨 Let AI Choose Colors</option>
            {colorSchemes.map(scheme => (
              <option key={scheme} value={scheme}>{scheme}</option>
            ))}
          </select>
        </div>

        {/* MAGICAL QUICK FEATURES */}
        <div className="grid grid-cols-3 gap-2">
          {['Contact Form', 'Image Gallery', 'Team Members', 'Testimonials', 'Services Section', 'Portfolio Gallery'].map(feature => (
            <button
              key={feature}
              type="button"
              onClick={() => formData.features.includes(feature) ? removeFeature(feature) : addFeature(feature)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border-2 transition-all duration-300 ${
                formData.features.includes(feature)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-white/70 text-purple-700 border-purple-200 hover:bg-white hover:border-purple-300'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>

        {/* SPECTACULAR GENERATE BUTTON */}
        <div className="pt-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 via-indigo-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 animate-gradient transition-all duration-500"></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full bg-gradient-to-r from-pink-500 via-purple-500 via-indigo-500 to-cyan-500 text-white py-4 px-8 rounded-2xl font-black text-lg hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/50 animate-pulse-glow"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">🌸 Creating Magic...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl animate-bounce">🚀</span>
                  <span>Generate My Magical Website</span>
                  <span className="text-2xl animate-bounce animation-delay-500">✨</span>
                </span>
              )}
            </button>
          </div>
          <p className="text-center text-white/80 mt-3 text-sm font-medium filter drop-shadow-sm">
            🌟 Enhanced with Gemini 2.0 Flash • 🎨 Thoughtful AI Creation • ⚡ Instant Magic
          </p>
        </div>
        </form>
      </div>
    </div>
  )
}