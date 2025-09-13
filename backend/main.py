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

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCtrme34gihpa0Q7c-QbVlmElIkaGDvf9A")  # Use env var or fallback
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
    pages: List[str] = Field(default_factory=list)

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

# In-memory storage (use database in production)
website_storage: Dict[str, WebsiteResponse] = {}

def get_gemini_model():
    """Get configured Gemini model"""
    try:
        return genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        logger.error(f"Failed to initialize Gemini model: {e}")
        raise HTTPException(status_code=500, detail="AI service unavailable")

def generate_website_content(request: WebsiteRequest) -> dict:
    """Generate website content using Gemini AI"""
    try:
        logger.info("✨ Generating website content with Gemini AI...")
        logger.info("🧠 Starting Gemini AI content generation...")
        logger.info(f"📋 Business: {request.business_name}, Type: {request.website_type}")
        
        model = get_gemini_model()
        logger.info("✅ Gemini model loaded successfully")
        
        # Enhanced prompt for better JSON output
        prompt = f"""
You are an expert web developer. Create a complete, responsive website for the following business:

Business Name: {request.business_name}
Website Type: {request.website_type}
Description: {request.description}
Target Audience: {request.target_audience}
Color Scheme: {request.color_scheme or "Modern and professional"}
Features: {', '.join(request.features) if request.features else 'Standard business features'}
Pages: {', '.join(request.pages) if request.pages else 'Home, About, Contact'}

IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:

{{
  "html": "complete HTML code here",
  "css": "complete CSS code here", 
  "js": "complete JavaScript code here"
}}

Requirements:
1. Create professional, modern, and responsive design
2. Include semantic HTML5 structure
3. Use CSS with media queries for mobile responsiveness
4. Add relevant JavaScript for interactivity
5. Include the specified features and pages
6. Make it industry-appropriate for {request.website_type}
7. Use the specified color scheme: {request.color_scheme or "professional colors"}
8. Ensure the content is relevant to: {request.description}
9. Target the content for: {request.target_audience}

Respond with ONLY the JSON object, no other text or formatting.
"""
        
        logger.info("📤 Sending request to Gemini AI...")
        response = model.generate_content(prompt)
        logger.info("📥 Received response from Gemini AI")
        logger.info(f"📝 Response length: {len(response.text)} characters")
        
        response_text = response.text.strip()
        logger.info(f"📋 Response preview: {response_text[:200]}...")
        
        # Enhanced JSON parsing with multiple fallback methods
        parsed_content = None
        
        # Method 1: Direct JSON parsing
        try:
            parsed_content = json.loads(response_text)
            logger.info("✅ Method 1: Direct JSON parsing successful")
        except json.JSONDecodeError as e:
            logger.info("⚠️ Method 1: Direct JSON parsing failed")
            
            # Method 2: Remove markdown code blocks and try again
            try:
                # Remove ```json and ``` markers
                cleaned_text = response_text
                if "```json" in cleaned_text:
                    cleaned_text = cleaned_text.split("```json")[1].split("```")[0]
                elif "```" in cleaned_text:
                    cleaned_text = cleaned_text.split("```")[1].split("```")[0]
                
                parsed_content = json.loads(cleaned_text.strip())
                logger.info("✅ Method 2: Cleaned JSON parsing successful")
            except (json.JSONDecodeError, IndexError) as e:
                logger.info("⚠️ Method 2: Cleaned JSON parsing failed")
                
                # Method 3: Find JSON boundaries
                try:
                    start_idx = response_text.find('{')
                    end_idx = response_text.rfind('}') + 1
                    if start_idx != -1 and end_idx > start_idx:
                        json_text = response_text[start_idx:end_idx]
                        parsed_content = json.loads(json_text)
                        logger.info("✅ Method 3: Boundary JSON parsing successful")
                    else:
                        raise ValueError("No JSON boundaries found")
                except (json.JSONDecodeError, ValueError) as e:
                    logger.warning(f"⚠️ Method 3: Boundary JSON parsing failed: {e}")
        
        # Check if we have valid content
        if parsed_content and all(key in parsed_content for key in ['html', 'css', 'js']):
            logger.info("🎉 Successfully parsed Gemini JSON response with all required keys")
            return parsed_content
        else:
            logger.warning("⚠️ JSON parsing failed: Invalid or incomplete response, using fallback")
            raise ValueError("Failed to parse AI response")
            
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        logger.info("🔄 Using fallback website generation...")
        
        # Fallback content generation
        return {
            "html": f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{request.business_name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <a href="#" class="logo">{request.business_name}</a>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </nav>
        <div class="hero">
            <h1>{request.business_name}</h1>
            <p>{request.description[:100]}...</p>
            <button>Learn More</button>
        </div>
    </header>

    <main>
        <!-- Content will vary based on page -->
    </main>

    <footer>
        <p>&copy; 2023 {request.business_name}</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>""",
            "css": """/* General Styles */
body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
}

header {
    background-color: #007bff;
    color: white;
    padding: 20px 0;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    text-decoration: none;
    color: white;
}

nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
}

nav li {
    margin-left: 20px;
}

nav a {
    text-decoration: none;
    color: white;
}

.hero {
    text-align: center;
    padding: 100px 0;
}

.hero h1 {
    font-size: 48px;
    margin-bottom: 20px;
}

.hero p {
    font-size: 24px;
    margin-bottom: 30px;
}

.hero button {
    padding: 15px 30px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* Responsive Styles */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
        align-items: center;
    }
    nav li {
        margin: 10px 0;
    }
}""",
            "js": "// Placeholder JavaScript\nconsole.log(\"JavaScript loaded\");"
        }

async def generate_website_background(request: WebsiteRequest, website_id: str):
    """Background task to generate website"""
    try:
        logger.info(f"🚀 Starting website generation for {website_id}")
        website_storage[website_id].message = "🤖 Testing Gemini API connection..."
        website_storage[website_id].progress = 10
        
        # Test Gemini connection
        try:
            model = get_gemini_model()
            test_response = model.generate_content("Say 'Hello' in a professional tone.")
        except Exception as e:
            logger.error(f"Gemini connection test failed: {e}")
            website_storage[website_id].status = "failed"
            website_storage[website_id].message = f"AI service connection failed: {str(e)}"
            return
        
        website_storage[website_id].message = "✨ Generating website content with Gemini AI..."
        website_storage[website_id].progress = 20
        
        # Generate content
        content = generate_website_content(request)
        website_storage[website_id].progress = 40
        
        # Update with generated content
        website_storage[website_id].html_content = content["html"]
        website_storage[website_id].css_content = content["css"]
        website_storage[website_id].js_content = content["js"]
        website_storage[website_id].message = "🎨 Styling and optimizing..."
        website_storage[website_id].progress = 70
        
        # Create directory and save files
        website_storage[website_id].message = "💾 Saving website files..."
        website_storage[website_id].progress = 85
        
        # Create directory
        websites_dir = "generated_websites"
        website_dir = os.path.join(websites_dir, website_id)
        os.makedirs(website_dir, exist_ok=True)
        logger.info(f"📁 Created directory: {website_dir}")
        
        # Save files
        async with aiofiles.open(os.path.join(website_dir, "index.html"), "w") as f:
            await f.write(content["html"])
        logger.info("✅ Saved HTML file")
        
        async with aiofiles.open(os.path.join(website_dir, "style.css"), "w") as f:
            await f.write(content["css"])
        logger.info("✅ Saved CSS file")
        
        async with aiofiles.open(os.path.join(website_dir, "script.js"), "w") as f:
            await f.write(content["js"])
        logger.info("✅ Saved JS file")
        
        # Mark as completed
        website_storage[website_id].status = "completed"
        website_storage[website_id].message = "🎉 Website generated successfully!"
        website_storage[website_id].progress = 100
        website_storage[website_id].preview_url = f"/preview/{website_id}"
        
        logger.info(f"📝 Content generated successfully for {website_id}")
        logger.info(f"🎉 Website generation completed successfully for {website_id}")
        
    except Exception as e:
        logger.error(f"Error in background generation: {e}")
        website_storage[website_id].status = "failed"
        website_storage[website_id].message = f"Generation failed: {str(e)}"
        website_storage[website_id].error_details = str(e)

@app.post("/generate-website")
async def generate_website(request: WebsiteRequest, background_tasks: BackgroundTasks):
    """Start website generation"""
    website_id = str(uuid.uuid4())
    
    # Initialize website record
    website_storage[website_id] = WebsiteResponse(
        id=website_id,
        status="generating",
        message="Website generation started. Please check status for updates.",
        progress=0
    )
    
    # Start background generation
    background_tasks.add_task(generate_website_background, request, website_id)
    
    return website_storage[website_id]

@app.get("/status/{website_id}")
async def get_website_status(website_id: str):
    """Get website generation status"""
    if website_id not in website_storage:
        raise HTTPException(status_code=404, detail="Website not found")
    
    return website_storage[website_id]

@app.get("/preview/{website_id}")
async def preview_website(website_id: str):
    """Preview generated website"""
    if website_id not in website_storage:
        raise HTTPException(status_code=404, detail="Website not found")
    
    website_data = website_storage[website_id]
    
    if website_data.status != "completed" or not website_data.html_content:
        raise HTTPException(status_code=404, detail="Website not ready")
    
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content=website_data.html_content)

@app.get("/download/{website_id}")
async def download_website(website_id: str):
    """Download website as ZIP file"""
    if website_id not in website_storage:
        raise HTTPException(status_code=404, detail="Website not found")
    
    website_data = website_storage[website_id]
    
    if website_data.status != "completed":
        raise HTTPException(status_code=404, detail="Website not ready")
    
    import io
    import zipfile
    from fastapi.responses import StreamingResponse
    
    # Create ZIP file in memory
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr("index.html", website_data.html_content or "")
        zip_file.writestr("style.css", website_data.css_content or "")
        zip_file.writestr("script.js", website_data.js_content or "")
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        io.BytesIO(zip_buffer.read()),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=website-{website_id}.zip"}
    )

# Template generation for previews
@app.get("/template/{website_id}")
async def get_website_template(website_id: str):
    """Get website template data"""
    if website_id not in website_storage:
        raise HTTPException(status_code=404, detail="Website not found")
    
    website_data = website_storage[website_id]
    
    if website_data.status != "completed":
        raise HTTPException(status_code=404, detail="Website not ready")
    
    return {
        "html": website_data.html_content,
        "css": website_data.css_content,
        "js": website_data.js_content,
        "website_id": website_id
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Website Generator API is running!",
        "gemini_model": "gemini-1.5-flash",
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
            "model": "gemini-1.5-flash"
        }
    except Exception as e:
        logger.error(f"Gemini API test failed: {e}")
        return {
            "status": "error",
            "message": f"Gemini API test failed: {str(e)}",
            "model": "gemini-1.5-flash"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)