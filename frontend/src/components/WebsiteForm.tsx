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
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 space-y-10">
        <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              🎨 Build Your Professional Website
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Share your vision and let our advanced AI create a custom, responsive website that perfectly represents your brand!
            </p>
        </div>
        
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-lg">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Business Name & Type */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="flex items-center text-lg font-bold text-gray-800 mb-3">
              <span className="mr-2">🏢</span>
              Business/Project Name *
            </label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
              placeholder="e.g., TechStart Solutions"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg bg-white/50 backdrop-blur-sm hover:bg-white/80"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-lg font-bold text-gray-800 mb-3">
              <span className="mr-2">🎯</span>
              Website Type *
            </label>
            <select
              value={formData.website_type}
              onChange={(e) => setFormData(prev => ({ ...prev, website_type: e.target.value }))}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg bg-white/50 backdrop-blur-sm hover:bg-white/80"
              required
            >
              <option value="">Select website type</option>
              {websiteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center text-lg font-bold text-gray-800 mb-3">
            <span className="mr-2">📝</span>
            Tell Us About Your Vision *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your business, what you do, and what makes you special. The more details, the better your AI-generated website will be!"
            rows={4}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 resize-none"
            required
          />
        </div>

        {/* Target Audience & Color Scheme */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              placeholder="e.g., Young professionals, families, businesses"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Scheme
            </label>
            <select
              value={formData.color_scheme}
              onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Let AI choose</option>
              {colorSchemes.map(scheme => (
                <option key={scheme} value={scheme}>{scheme}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Features to Include
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableFeatures.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => formData.features.includes(feature) ? removeFeature(feature) : addFeature(feature)}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  formData.features.includes(feature)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
          {formData.features.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Selected features:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map(feature => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pages */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Pages to Include
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.pages.map(page => (
              <span
                key={page}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {page}
                {page !== 'Home' && (
                  <button
                    type="button"
                    onClick={() => removePage(page)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPage}
              onChange={(e) => setCustomPage(e.target.value)}
              placeholder="Add custom page (e.g., Services, Portfolio)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addPage()
                }
              }}
            />
            <button
              type="button"
              onClick={addPage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-glow"></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-6 px-8 rounded-3xl text-xl font-black hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-2xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">🚀 Creating Your Website...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <span>Create My Professional Website</span>
                  <span className="text-2xl">✨</span>
                </span>
              )}
            </button>
          </div>
              <p className="text-center text-gray-600 mt-4 text-sm">
                🔒 Secure & Private • ⚡ Lightning Fast Generation • 🎉 Ready-to-Deploy Code
              </p>
        </div>
        </form>
      </div>
    </div>
  )
}