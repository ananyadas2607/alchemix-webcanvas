from fastapi import APIRouter, HTTPException
from app.schemas.template import TemplateRequest, TemplateResponse
from app.services.anthropic_service import AnthropicService
from app.services.unsplash_service import UnsplashService

router = APIRouter()
anthropic_service = AnthropicService()
unsplash_service = UnsplashService()

@router.post("/template/generate", response_model=TemplateResponse)
async def generate_template(request: TemplateRequest):
    try:
        # Generate template code
        code = await anthropic_service.generate_template(request.description)
        
        # Get relevant images
        images = await unsplash_service.get_images(request.image_keywords)
        
        return TemplateResponse(code=code, images=images)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))