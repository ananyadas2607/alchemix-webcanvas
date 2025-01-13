from fastapi import APIRouter, HTTPException
from app.schemas.template import TemplateRequest, TemplateResponse
from app.services.anthropic_service import generate_template
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generate-template", response_model=TemplateResponse)
async def create_template(request: TemplateRequest):
    try:
        logger.info(f"Received template request with description: {request.description}")
        if not request.description.strip():
            raise HTTPException(status_code=400, detail="Description cannot be empty")
            
        template = await generate_template(request.description)
        logger.info("Template generated successfully")
        return template
        
    except Exception as e:
        logger.error(f"Error in create_template: {str(e)}", exc_info=True)
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 