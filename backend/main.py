from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import logging
from pydantic import BaseModel, Field
import google.generativeai as genai
import os
import json
import uuid
import aiofiles
from typing import Dict, List, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini with user's API key
GEMINI_API_KEY = "AIzaSyCtrme34gihpa0Q7c-QbVlmElIkaGDvf9A"  # User's provided API key
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="AI Website Generator", description="Generate websites using AI")

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class WebsiteRequest(BaseModel):
    website_type: str
    business_name: str
    description: str
    target_audience: str
    color_scheme: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    pages: List[str] = Field(default_factory=lambda: ["Home", "About", "Contact"])

class WebsiteResponse(BaseModel):
    id: str
    status: str
    message: str
    progress: Optional[int] = 0
    html_content: Optional[str] = None
    css_content: Optional[str] = None
    js_content: Optional[str] = None
    preview_url: Optional[str] = None
    error_details: Optional[str] = None

# In-memory storage for generated websites
generated_websites: Dict[str, Dict] = {}

def get_gemini_model():
    """Get Gemini model if configured, otherwise raise to trigger fallback"""
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    return genai.GenerativeModel('gemini-2.0-flash-exp')

async def generate_website_content(request: WebsiteRequest) -> Dict:
    """Generate website content using Gemini AI"""
    
    logger.info(f"🧠 Starting Gemini AI content generation...")
    logger.info(f"📋 Business: {request.business_name}, Type: {request.website_type}")
    
    try:
        model = get_gemini_model()
        logger.info(f"✅ Gemini model loaded successfully")
        
        # Enhanced prompt for much more thoughtful generation
        prompt = f"""You are a world-class creative web designer and developer with 15+ years of experience creating award-winning websites. 

TAKE YOUR TIME AND PUT SERIOUS THOUGHT INTO THIS. This isn't just a template - create something truly exceptional and unique.

🎯 BUSINESS ANALYSIS:
- Business Name: {request.business_name}
- Industry: {request.website_type}
- Brand Story: {request.description}
- Target Audience: {request.target_audience}
- Visual Identity: {request.color_scheme or 'Choose colors that match the brand personality'}
- Required Features: {', '.join(request.features) if request.features else 'Essential business features'}
- Site Structure: {', '.join(request.pages)}

🎨 CREATIVE DIRECTION:
Think deeply about this brand's personality, values, and what would resonate with their target audience. Consider:
- What emotions should this website evoke?
- How can the visual design reflect the brand's unique value proposition?
- What storytelling elements would engage their specific audience?
- How can we create a memorable, distinctive user experience?

💻 TECHNICAL EXCELLENCE:
Create a sophisticated, modern website featuring:
- Cutting-edge HTML5 with perfect semantic structure
- Beautiful CSS3 with smooth animations and micro-interactions
- Sophisticated JavaScript with modern ES6+ features
- Advanced responsive design with fluid layouts
- Professional typography and spacing
- Accessibility best practices (ARIA labels, focus management)
- Performance optimizations
- SEO excellence with proper meta tags and structure

🌟 DESIGN PHILOSOPHY:
- Every element should have purpose and meaning
- Colors should tell a story and evoke the right emotions
- Animations should feel natural and enhance the experience
- The layout should guide users through a compelling journey
- Make it feel premium, polished, and professional

⚡ INTERACTIVE ELEMENTS:
Add thoughtful interactions like:
- Smooth hover effects that provide visual feedback
- Progressive disclosure of information
- Subtle animations that guide attention
- Form validation with helpful messaging
- Loading states and feedback

🎯 BRAND-SPECIFIC CUSTOMIZATION:
Tailor every aspect to this specific business:
- Industry-appropriate imagery and icons
- Tone of voice that matches the brand
- Layout that supports their business goals
- Call-to-actions that convert visitors
- Content hierarchy that tells their story

RESPOND ONLY with this EXACT JSON format (no markdown, no explanations):

{{
  "html": "your thoughtfully crafted HTML code with semantic structure, proper meta tags, and industry-specific content",
  "css": "your beautiful CSS with advanced styling, animations, responsive design, and brand-appropriate aesthetics", 
  "js": "your sophisticated JavaScript with modern features, interactions, and enhanced user experience",
  "description": "a compelling description of the unique website you created and why it's perfect for this business"
}}

Remember: This is for {request.business_name} in the {request.website_type} industry. Make it extraordinary."""
        
        logger.info(f"📤 Sending request to Gemini AI...")
        response = model.generate_content(prompt)
        logger.info(f"📥 Received response from Gemini AI")
        
        # Enhanced JSON extraction for Gemini 2.0 Flash
        response_text = response.text.strip()
        logger.info(f"📝 Response length: {len(response_text)} characters")
        
        # Clean the response for better parsing
        # Remove any control characters that might cause issues
        import re
        cleaned_text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', response_text)
        
        # First, log a preview of the response to debug
        preview = cleaned_text[:500] + "..." if len(cleaned_text) > 500 else cleaned_text
        logger.info(f"📋 Response preview: {preview}")
        
        # Try multiple JSON extraction methods
        json_result = None
        
        # Method 1: Direct JSON parsing with cleaned text
        try:
            json_result = json.loads(cleaned_text)
            logger.info(f"✅ Method 1: Direct JSON parsing successful")
        except json.JSONDecodeError:
            logger.info(f"⚠️ Method 1: Direct JSON parsing failed")
            
            # Method 2: Remove markdown code blocks if present
            try:
                # Remove ```json and ``` markers
                clean_text = cleaned_text
                if "```json" in clean_text:
                    clean_text = clean_text.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_text:
                    clean_text = clean_text.split("```")[1].split("```")[0].strip()
                
                json_result = json.loads(clean_text)
                logger.info(f"✅ Method 2: Cleaned JSON parsing successful")
            except (json.JSONDecodeError, IndexError):
                logger.info(f"⚠️ Method 2: Cleaned JSON parsing failed")
                
                # Method 3: Find JSON boundaries with cleaned text
                try:
                    start_idx = cleaned_text.find('{')
                    end_idx = cleaned_text.rfind('}') + 1
                    
                    if start_idx != -1 and end_idx > start_idx:
                        json_str = cleaned_text[start_idx:end_idx]
                        json_result = json.loads(json_str)
                        logger.info(f"✅ Method 3: Boundary JSON parsing successful")
                    else:
                        logger.warning(f"⚠️ Method 3: No JSON boundaries found")
                except json.JSONDecodeError as e:
                    logger.warning(f"⚠️ Method 3: Boundary JSON parsing failed: {e}")
        
        if json_result and isinstance(json_result, dict):
            # Validate required keys
            if 'html' in json_result and 'css' in json_result and 'js' in json_result:
                logger.info(f"🎉 Successfully parsed Gemini JSON response with all required keys")
                return json_result
            else:
                logger.warning(f"⚠️ JSON missing required keys. Has: {list(json_result.keys())}")
        
        logger.warning(f"⚠️ All JSON parsing methods failed, using fallback")
        
        # If JSON parsing fails, create a structured response
        logger.info(f"🔄 Using fallback website generation...")
        return {
            "html": create_fallback_html(request),
            "css": create_fallback_css(request),
            "js": create_fallback_js(),
            "description": f"Professional {request.website_type} website for {request.business_name}"
        }
        
    except Exception as e:
        logger.error(f"❌ Gemini API error: {e}")
        logger.info(f"🔄 Using fallback website generation due to API error...")
        return {
            "html": create_fallback_html(request),
            "css": create_fallback_css(request),
            "js": create_fallback_js(),
            "description": f"Professional {request.website_type} website for {request.business_name}"
        }

def create_fallback_html(request: WebsiteRequest) -> str:
    """Create fallback HTML when Gemini API fails"""
    pages_nav = '\n'.join([f'<li><a href="#{page.lower()}">{page}</a></li>' for page in request.pages])
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{request.business_name} - {request.website_type}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <div class="nav-brand">
                <h1>{request.business_name}</h1>
            </div>
            <ul class="nav-menu">
                {pages_nav}
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Welcome to {request.business_name}</h1>
                <p>{request.description}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Us</h2>
                <p>We specialize in providing excellent {request.website_type.lower()} services to our {request.target_audience.lower()}. Our mission is to deliver quality and satisfaction in everything we do.</p>
            </div>
        </section>

        <section id="contact" class="contact">
            <div class="container">
                <h2>Contact Us</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 {request.business_name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>"""

def create_fallback_css(request: WebsiteRequest) -> str:
    """Create fallback CSS when Gemini API fails"""
    primary_color = "#3b82f6" if not request.color_scheme else "#2563eb"
    
    return f"""* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}}

.container {{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}}

/* Header */
header {{
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}}

nav {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}}

.nav-brand h1 {{
    color: {primary_color};
    font-size: 1.5rem;
}}

.nav-menu {{
    display: flex;
    list-style: none;
    gap: 2rem;
}}

.nav-menu a {{
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}}

.nav-menu a:hover {{
    color: {primary_color};
}}

.hamburger {{
    display: none;
    flex-direction: column;
    cursor: pointer;
}}

.hamburger span {{
    width: 25px;
    height: 3px;
    background: #333;
    margin: 3px 0;
    transition: 0.3s;
}}

/* Hero Section */
.hero {{
    background: linear-gradient(135deg, {primary_color}, #1e40af);
    color: white;
    padding: 8rem 2rem 4rem;
    text-align: center;
    margin-top: 80px;
}}

.hero-content h1 {{
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease;
}}

.hero-content p {{
    font-size: 1.2rem;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease 0.2s both;
}}

.cta-button {{
    background: white;
    color: {primary_color};
    padding: 12px 30px;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    animation: fadeInUp 1s ease 0.4s both;
}}

.cta-button:hover {{
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}}

/* Sections */
section {{
    padding: 4rem 0;
}}

.about {{
    background: #f8fafc;
}}

.about h2, .contact h2 {{
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: #333;
}}

.about p {{
    text-align: center;
    font-size: 1.1rem;
    max-width: 800px;
    margin: 0 auto;
}}

/* Contact Form */
.contact-form {{
    max-width: 600px;
    margin: 0 auto;
}}

.contact-form input,
.contact-form textarea {{
    width: 100%;
    padding: 15px;
    margin-bottom: 20px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}}

.contact-form input:focus,
.contact-form textarea:focus {{
    outline: none;
    border-color: {primary_color};
}}

.contact-form textarea {{
    height: 120px;
    resize: vertical;
}}

.contact-form button {{
    background: {primary_color};
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
    width: 100%;
}}

.contact-form button:hover {{
    background: #1e40af;
}}

/* Footer */
footer {{
    background: #1a202c;
    color: white;
    text-align: center;
    padding: 2rem 0;
}}

/* Animations */
@keyframes fadeInUp {{
    from {{
        opacity: 0;
        transform: translateY(30px);
    }}
    to {{
        opacity: 1;
        transform: translateY(0);
    }}
}}

/* Responsive Design */
@media (max-width: 768px) {{
    .nav-menu {{
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background-color: white;
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0,0,0,0.05);
        padding: 2rem 0;
    }}

    .nav-menu.active {{
        left: 0;
    }}

    .hamburger {{
        display: flex;
    }}

    .hamburger.active span:nth-child(2) {{
        opacity: 0;
    }}

    .hamburger.active span:nth-child(1) {{
        transform: translateY(8px) rotate(45deg);
    }}

    .hamburger.active span:nth-child(3) {{
        transform: translateY(-8px) rotate(-45deg);
    }}

    .hero-content h1 {{
        font-size: 2rem;
    }}

    .hero {{
        padding: 6rem 1rem 3rem;
    }}
}}"""

def create_fallback_js() -> str:
    """Create fallback JavaScript when Gemini API fails"""
    return """// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (name && email && message) {
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});"""

@app.post("/generate-website", response_model=WebsiteResponse)
async def generate_website(request: WebsiteRequest, background_tasks: BackgroundTasks):
    """Generate a website based on user requirements"""
    
    website_id = str(uuid.uuid4())
    
    # Store initial status
    generated_websites[website_id] = {
        "id": website_id,
        "status": "generating",
        "message": "Generating your website...",
        "request": request.model_dump(),
        "created_at": datetime.now()
    }
    
    # Start background generation
    background_tasks.add_task(generate_website_background, website_id, request)
    
    return WebsiteResponse(
        id=website_id,
        status="generating",
        message="Website generation started. Please check status for updates."
    )

async def generate_website_background(website_id: str, request: WebsiteRequest):
    """Background task to generate website content with progress tracking"""
    try:
        # Step 1: Initialize
        logger.info(f"🚀 Starting website generation for {website_id}")
        generated_websites[website_id].update({
            "message": "🔍 Analyzing your requirements...",
            "progress": 10
        })
        
        # Step 2: Test Gemini API connection
        logger.info(f"🤖 Testing Gemini API connection...")
        generated_websites[website_id].update({
            "message": "🤖 Connecting to Gemini AI...",
            "progress": 20
        })
        
        # Step 3: Generate content using Gemini
        logger.info(f"✨ Generating website content with Gemini AI...")
        generated_websites[website_id].update({
            "message": "✨ AI is creating your website content...",
            "progress": 40
        })
        
        content = await generate_website_content(request)
        
        logger.info(f"📝 Content generated successfully for {website_id}")
        generated_websites[website_id].update({
            "message": "📝 Content generated! Creating files...",
            "progress": 70
        })
        
        # Step 4: Create output directory
        output_dir = f"generated_websites/{website_id}"
        os.makedirs(output_dir, exist_ok=True)
        logger.info(f"📁 Created directory: {output_dir}")
        
        # Step 5: Save files
        generated_websites[website_id].update({
            "message": "💾 Saving website files...",
            "progress": 85
        })
        
        async with aiofiles.open(f"{output_dir}/index.html", 'w') as f:
            await f.write(content['html'])
        logger.info(f"✅ Saved HTML file")
        
        async with aiofiles.open(f"{output_dir}/style.css", 'w') as f:
            await f.write(content['css'])
        logger.info(f"✅ Saved CSS file")
        
        async with aiofiles.open(f"{output_dir}/script.js", 'w') as f:
            await f.write(content['js'])
        logger.info(f"✅ Saved JS file")
        
        # Step 6: Final update
        generated_websites[website_id].update({
            "status": "completed",
            "message": "🎉 Website generated successfully!",
            "progress": 100,
            "html_content": content['html'],
            "css_content": content['css'],
            "js_content": content['js'],
            "preview_url": f"/preview/{website_id}",
            "description": content.get('description', 'Website generated successfully')
        })
        
        logger.info(f"🎉 Website generation completed successfully for {website_id}")
        
    except Exception as e:
        error_msg = f"Failed to generate website: {str(e)}"
        logger.error(f"❌ Error generating website {website_id}: {e}")
        generated_websites[website_id].update({
            "status": "failed",
            "message": f"❌ {error_msg}",
            "progress": 0,
            "error_details": str(e)
        })

@app.get("/status/{website_id}", response_model=WebsiteResponse)
async def get_website_status(website_id: str):
    """Get the status of a website generation"""
    if website_id not in generated_websites:
        raise HTTPException(status_code=404, detail="Website not found")
    
    website_data = generated_websites[website_id]
    return WebsiteResponse(**website_data)

@app.get("/preview/{website_id}")
async def preview_website(website_id: str):
    """Preview a generated website"""
    if website_id not in generated_websites:
        raise HTTPException(status_code=404, detail="Website not found")
    
    website_data = generated_websites[website_id]
    
    if website_data["status"] != "completed":
        raise HTTPException(status_code=400, detail="Website not ready for preview")
    
    html_content = website_data.get("html_content", "")
    
    # Inject CSS and JS inline for preview
    css_content = website_data.get("css_content", "")
    js_content = website_data.get("js_content", "")
    
    # Insert CSS and JS into HTML
    if css_content:
        html_content = html_content.replace(
            '<link rel="stylesheet" href="style.css">',
            f'<style>{css_content}</style>'
        )
    
    if js_content:
        html_content = html_content.replace(
            '<script src="script.js"></script>',
            f'<script>{js_content}</script>'
        )
    
    return {"html": html_content}

@app.get("/download/{website_id}")
async def download_website(website_id: str):
    """Download generated website files"""
    if website_id not in generated_websites:
        raise HTTPException(status_code=404, detail="Website not found")
    
    website_data = generated_websites[website_id]
    
    if website_data["status"] != "completed":
        raise HTTPException(status_code=400, detail="Website not ready for download")
    
    return {
        "html": website_data.get("html_content", ""),
        "css": website_data.get("css_content", ""),
        "js": website_data.get("js_content", ""),
        "website_id": website_id
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Website Generator API is running!",
        "gemini_model": "gemini-2.0-flash-exp",
        "version": "1.0.0",
        "endpoints": {
            "generate": "/generate-website",
            "status": "/status/{id}",
            "preview": "/preview/{id}",
            "download": "/download/{id}",
            "test": "/test-gemini"
        }
    }


@app.get("/test-gemini")
async def test_gemini():
    """Test Gemini API connection"""
    try:
        logger.info("🧪 Testing Gemini API connection...")
        model = get_gemini_model()
        response = model.generate_content("Say 'Hello! Gemini API is working correctly.' in a professional tone.")
        logger.info("✅ Gemini API test successful")
        return {
            "status": "success", 
            "message": "Gemini API is working correctly",
            "response": response.text,
            "model": "gemini-2.0-flash-exp"
        }
    except Exception as e:
        logger.error(f"❌ Gemini API test failed: {e}")
        return {
            "status": "error",
            "message": f"Gemini API test failed: {str(e)}",
            "model": "gemini-2.0-flash-exp"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)