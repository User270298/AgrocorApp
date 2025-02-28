from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import index, assistant, vessel, offers_requests
from database import Base, engine
from fastapi.staticfiles import StaticFiles
from pathlib import Path
# Initialize FastAPI app
app = FastAPI()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)
# Mount static directories for specific categories
BASE_IMAGE_DIR = Path(r"C:\Users\User\Desktop\Work\MyNewApp\assets\images")

# Монтируем категории
app.mount("/static/image", StaticFiles(directory=BASE_IMAGE_DIR / "image"), name="image")
app.mount("/static/news_image", StaticFiles(directory=BASE_IMAGE_DIR / "news_image"), name="news_image")
app.mount("/static/vessel_image", StaticFiles(directory=BASE_IMAGE_DIR / "vessel_image"), name="vessel_image")
app.mount("/static/analysis_image", StaticFiles(directory=BASE_IMAGE_DIR / "analysis_image"), name="analysis_image")

app.include_router(vessel.router)
app.include_router(index.router)
app.include_router(assistant.router)
app.include_router(offers_requests.router)