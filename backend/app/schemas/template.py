from pydantic import BaseModel, Field

class TemplateRequest(BaseModel):
    description: str = Field(..., min_length=1)

class TemplateResponse(BaseModel):
    html: str
    css: str
    # Add other fields as needed