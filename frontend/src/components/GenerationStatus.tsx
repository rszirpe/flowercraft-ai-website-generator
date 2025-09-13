'use client'

import { useState, useEffect } from 'react'
import type { GeneratedWebsite } from '@/types'
import { apiFetch } from '@/lib/api'

interface GenerationStatusProps {
  websiteId: string
  onComplete: (website: GeneratedWebsite) => void
}

export default function GenerationStatus({ websiteId, onComplete }: GenerationStatusProps) {
  const [status, setStatus] = useState('generating')
  const [message, setMessage] = useState('Generating your website...')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await apiFetch(`/status/${websiteId}`)
        if (response.ok) {
          const data = await response.json()
          setStatus(data.status)
          setMessage(data.message)
          
          if (data.status === 'completed') {
            onComplete(data as GeneratedWebsite)
          } else if (data.status === 'failed') {
            setMessage(data.message || 'Failed to generate website')
          }
        }
      } catch (error) {
        console.error('Error checking status:', error)
        setMessage('Error checking generation status')
      }
    }

    // Check status immediately
    checkStatus()

    // Set up polling
    const interval = setInterval(checkStatus, 2000)

    return () => clearInterval(interval)
  }, [websiteId, onComplete])

  useEffect(() => {
    // Simulate progress for better UX
    if (status === 'generating') {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

      return () => clearInterval(progressInterval)
    } else if (status === 'completed') {
      setProgress(100)
    }
  }, [status])

  const getStatusIcon = () => {
    switch (status) {
      case 'generating':
        return (
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        )
      case 'completed':
        return (
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'generating':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getProgressBarColor = () => {
    switch (status) {
      case 'generating':
        return 'bg-blue-600'
      case 'completed':
        return 'bg-green-600'
      case 'failed':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const generationSteps = [
    'Connecting to Gemini AI',
    'Analyzing your business vision',
    'Creating custom content & layout',
    'Building responsive design',
    'Adding professional features',
    'Finalizing your website'
  ]

  const getCurrentStep = () => {
    if (status === 'completed') return generationSteps.length - 1
    if (status === 'failed') return -1
    return Math.min(Math.floor(progress / 16.67), generationSteps.length - 1)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {getStatusIcon()}
              {status === 'generating' && (
                <div className="absolute -inset-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin opacity-30"></div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className={`text-4xl md:text-5xl font-black ${getStatusColor()}`}>
              {status === 'generating' && (
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  ✨ Creating Your Website
                </span>
              )}
              {status === 'completed' && (
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  🎉 Website Ready!
                </span>
              )}
              {status === 'failed' && (
                <span className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  😞 Generation Failed
                </span>
              )}
            </h2>
            <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {status !== 'failed' && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Generation Steps */}
        {status === 'generating' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generation Process</h3>
            <div className="space-y-3">
              {generationSteps.map((step, index) => {
                const currentStep = getCurrentStep()
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                return (
                  <div 
                    key={step}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 
                      isCompleted ? 'bg-green-50' : 
                      'bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-500' :
                      isCompleted ? 'bg-green-500' :
                      'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isActive ? (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-700' :
                      isCompleted ? 'text-green-700' :
                      'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* AI Status Messages */}
        {status === 'generating' && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">AI Assistant Working</h4>
                <p className="text-sm text-gray-600">
                  Our AI is analyzing your requirements and generating a custom website tailored to your needs. 
                  This process combines advanced language models with modern web development practices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700 mb-4">
                We encountered an issue while generating your website. Please try again or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}