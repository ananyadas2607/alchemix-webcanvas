from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import template

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(template.router, prefix="/api")