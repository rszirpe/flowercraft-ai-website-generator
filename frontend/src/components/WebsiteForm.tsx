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
        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Create Your Website
            </h2>
            <p className="text-white/60 text-sm">
              Powered by Gemini 2.0 Flash AI for exceptional results
            </p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* iOS-STYLE INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Business Name</label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
              placeholder="Enter your business name"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Website Type</label>
            <select
              value={formData.website_type}
              onChange={(e) => setFormData(prev => ({ ...prev, website_type: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all duration-200 appearance-none"
              style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              required
            >
              <option value="" className="bg-black/90">Select a type</option>
              {websiteTypes.map(type => (
                <option key={type} value={type} className="bg-black/90">{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* iOS-STYLE DESCRIPTION */}
        <div>
          <label className="block text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your website vision in detail..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all duration-200 resize-none"
            required
          />
        </div>

        {/* iOS-STYLE ADDITIONAL OPTIONS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Target Audience</label>
            <input
              type="text"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              placeholder="e.g., Young professionals"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Color Scheme</label>
            <select
              value={formData.color_scheme}
              onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all duration-200 appearance-none"
              style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
            >
              <option value="" className="bg-black/90">AI Chooses</option>
              {colorSchemes.map(scheme => (
                <option key={scheme} value={scheme} className="bg-black/90">{scheme}</option>
              ))}
            </select>
          </div>
        </div>

        {/* iOS-STYLE FEATURE TOGGLES */}
        <div>
          <label className="block text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Features</label>
          <div className="grid grid-cols-2 gap-3">
            {['Contact Form', 'Image Gallery', 'Team Members', 'Testimonials', 'Services', 'Portfolio'].map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => formData.features.includes(feature) ? removeFeature(feature) : addFeature(feature)}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-between ${
                  formData.features.includes(feature)
                    ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <span>{feature}</span>
                {formData.features.includes(feature) && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* iOS-STYLE GENERATE BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Website</span>
              </span>
            )}
          </button>
          <p className="text-center text-white/40 mt-3 text-xs">
            Powered by Gemini 2.0 Flash • Generates in ~5 seconds
          </p>
        </div>
        </form>
      </div>
    </div>
  )
}