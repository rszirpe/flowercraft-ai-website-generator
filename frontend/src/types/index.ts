// Type definitions for the AI Website Generator

export interface GeneratedWebsite {
  id: string
  status: 'generating' | 'completed' | 'failed'
  message: string
  progress?: number
  html_content?: string
  css_content?: string
  js_content?: string
  preview_url?: string
  description?: string
  error_details?: string
}

export interface WebsiteRequest {
  website_type: string
  business_name: string
  description: string
  target_audience: string
  color_scheme?: string
  features: string[]
  pages: string[]
}

export interface WebsiteFormData {
  website_type: string
  business_name: string
  description: string
  target_audience: string
  color_scheme: string
  features: string[]
  pages: string[]
}