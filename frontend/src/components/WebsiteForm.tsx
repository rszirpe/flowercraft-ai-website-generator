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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Create your website
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Describe your vision and our AI will generate a beautiful, professional website tailored to your needs.
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
        
        {/* Business Name & Type - ChatGPT style */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
              placeholder="Enter your business name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website Type *
            </label>
            <select
              value={formData.website_type}
              onChange={(e) => setFormData(prev => ({ ...prev, website_type: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              required
            >
              <option value="">Choose a type</option>
              {websiteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description - ChatGPT style */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your vision *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Tell us about your business, what you do, and what makes you unique. The more detail you provide, the better your website will be."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white resize-none"
            required
          />
        </div>

        {/* Target Audience & Color Scheme - ChatGPT style */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target audience
            </label>
            <input
              type="text"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              placeholder="Who is this website for?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color scheme
            </label>
            <select
              value={formData.color_scheme}
              onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
            >
              <option value="">Let AI choose</option>
              {colorSchemes.map(scheme => (
                <option key={scheme} value={scheme}>{scheme}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Features - ChatGPT style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Features to include (optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFeatures.map(feature => (
              <label
                key={feature}
                className="relative flex items-center p-3 text-sm rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => formData.features.includes(feature) ? removeFeature(feature) : addFeature(feature)}
                  className="sr-only"
                />
                <div className={`flex-shrink-0 w-4 h-4 border border-gray-300 rounded mr-3 flex items-center justify-center transition-colors ${
                  formData.features.includes(feature) 
                    ? 'bg-emerald-600 border-emerald-600' 
                    : 'bg-white'
                }`}>
                  {formData.features.includes(feature) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${formData.features.includes(feature) ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                  {feature}
                </span>
              </label>
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

        {/* ChatGPT-style Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating website...
              </span>
            ) : (
              'Generate website'
            )}
          </button>
          <p className="text-center text-gray-500 mt-4 text-sm">
            Your website will be generated in seconds using AI
          </p>
        </div>
        </form>
      </div>
    </div>
  )
}