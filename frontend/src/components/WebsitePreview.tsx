'use client'

import { useState } from 'react'
import type { GeneratedWebsite } from '@/types'
import { apiFetch } from '@/lib/api'

interface WebsitePreviewProps {
  website: GeneratedWebsite
  onStartOver: () => void
}

export default function WebsitePreview({ website, onStartOver }: WebsitePreviewProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [downloadStatus, setDownloadStatus] = useState('')

  const handleDownload = async () => {
    setDownloadStatus('downloading')
    
    try {
      const response = await apiFetch(`/download/${website.id}`)
      if (!response.ok) throw new Error('Download failed')
      
      const data = await response.json()
      
      // Create and download HTML file
      const htmlBlob = new Blob([data.html], { type: 'text/html' })
      const htmlUrl = URL.createObjectURL(htmlBlob)
      const htmlLink = document.createElement('a')
      htmlLink.href = htmlUrl
      htmlLink.download = 'index.html'
      htmlLink.click()
      
      // Create and download CSS file
      const cssBlob = new Blob([data.css], { type: 'text/css' })
      const cssUrl = URL.createObjectURL(cssBlob)
      const cssLink = document.createElement('a')
      cssLink.href = cssUrl
      cssLink.download = 'style.css'
      cssLink.click()
      
      // Create and download JS file
      const jsBlob = new Blob([data.js], { type: 'text/javascript' })
      const jsUrl = URL.createObjectURL(jsBlob)
      const jsLink = document.createElement('a')
      jsLink.href = jsUrl
      jsLink.download = 'script.js'
      jsLink.click()
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(htmlUrl)
        URL.revokeObjectURL(cssUrl)
        URL.revokeObjectURL(jsUrl)
      }, 1000)
      
      setDownloadStatus('success')
      setTimeout(() => setDownloadStatus(''), 3000)
      
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadStatus('error')
      setTimeout(() => setDownloadStatus(''), 3000)
    }
  }

  const handlePreview = async () => {
    try {
      const response = await apiFetch(`/preview/${website.id}`)
      if (!response.ok) throw new Error('Preview failed')
      
      const data = await response.json()
      
      // Open preview in new tab
      const previewWindow = window.open('', '_blank')
      if (previewWindow) {
        previewWindow.document.write(data.html)
        previewWindow.document.close()
      }
    } catch (error) {
      console.error('Preview failed:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Website Generated Successfully!</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {website.description || 'Your custom website has been generated using advanced AI technology.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={handlePreview}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Preview Website</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={downloadStatus === 'downloading'}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>
            {downloadStatus === 'downloading' ? 'Downloading...' : 'Download Files'}
          </span>
        </button>

        <button
          onClick={onStartOver}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create New Website</span>
        </button>
      </div>

      {/* Download Status */}
      {downloadStatus && (
        <div className="text-center mb-6">
          {downloadStatus === 'success' && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Files downloaded successfully!
            </div>
          )}
          {downloadStatus === 'error' && (
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Download failed. Please try again.
            </div>
          )}
        </div>
      )}

      {/* Code Tabs */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'preview', label: 'Preview', icon: '👁️' },
              { key: 'html', label: 'HTML', icon: '📄' },
              { key: 'css', label: 'CSS', icon: '🎨' },
              { key: 'js', label: 'JavaScript', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Website Preview</h3>
                <p className="text-gray-600 mb-4">
                  Click the "Preview Website" button above to view your generated website in a new tab.
                </p>
                <button
                  onClick={handlePreview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Preview
                </button>
              </div>

              {/* Website Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Generated Features</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Responsive design for all devices</li>
                    <li>• Modern CSS3 animations</li>
                    <li>• Interactive JavaScript elements</li>
                    <li>• SEO-optimized structure</li>
                    <li>• Professional styling</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Ready to Use</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Download all files</li>
                    <li>• Upload to any web server</li>
                    <li>• Customize as needed</li>
                    <li>• No additional setup required</li>
                    <li>• Works on all modern browsers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">HTML Code</h3>
                <span className="text-sm text-gray-600">index.html</span>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{website.html_content || 'HTML content not available'}</code>
              </pre>
            </div>
          )}

          {activeTab === 'css' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">CSS Code</h3>
                <span className="text-sm text-gray-600">style.css</span>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{website.css_content || 'CSS content not available'}</code>
              </pre>
            </div>
          )}

          {activeTab === 'js' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">JavaScript Code</h3>
                <span className="text-sm text-gray-600">script.js</span>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{website.js_content || 'JavaScript content not available'}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 How to Use Your Website</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">1. Download Files</h4>
            <p>Click the "Download Files" button to get all three files (HTML, CSS, JS).</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. Upload to Server</h4>
            <p>Upload all files to your web hosting service or GitHub Pages.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Customize Content</h4>
            <p>Edit the HTML file to replace placeholder content with your actual information.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">4. Modify Design</h4>
            <p>Adjust colors, fonts, and layout in the CSS file to match your brand.</p>
          </div>
        </div>
      </div>
    </div>
  )
}