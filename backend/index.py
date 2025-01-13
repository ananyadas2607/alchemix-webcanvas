from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.routes import template

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # We'll restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(template.router, prefix="/api")

# Handler for Vercel
handler = Mangum(app) 

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 