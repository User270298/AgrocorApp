import os
import shutil
import logging
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime
import uuid

from routers import index, assistant, vessel, offers_requests
from database import Base, engine
from utils import save_uploaded_image, get_image_list, ensure_image_dir

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("app")

# Создаем директории для изображений
BASE_IMAGE_DIR = Path("static/images")
BASE_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
ensure_image_dir("news_image")
ensure_image_dir("vessel_image")
ensure_image_dir("analysis_image")
ensure_image_dir("proposal_image")

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

# Монтируем статические директории
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create database tables
Base.metadata.create_all(bind=engine)

# Включаем маршруты
app.include_router(vessel.router)
app.include_router(index.router)
app.include_router(assistant.router)
app.include_router(offers_requests.router)

# Проверка состояния сервера
@app.get("/api/health")
async def health_check():
    """Проверка состояния сервера и наличия необходимых директорий"""
    directories = {
        "image": {"exists": False, "path": ""},
        "news_image": {"exists": False, "path": ""},
        "vessel_image": {"exists": False, "path": ""},
        "analysis_image": {"exists": False, "path": ""},
        "proposal_image": {"exists": False, "path": ""}
    }
    
    # Проверяем наличие директорий и создаем их при необходимости
    for dir_name in directories.keys():
        dir_path = ensure_image_dir(dir_name)
        directories[dir_name]["exists"] = dir_path.exists()
        directories[dir_name]["path"] = str(dir_path)
    
    return {
        "status": "ok",
        "timestamp": datetime.utcnow(),
        "directories": directories
    }

# Загрузка изображений
@app.post("/api/upload_image")
async def upload_image(file: UploadFile = File(...), category: str = Form("image")):
    """Загрузка изображения на сервер"""
    return {"file_path": save_uploaded_image(file, category)}

# Получение списка изображений
@app.get("/api/images")
async def get_images(category: str = "image"):
    """Получение списка изображений в указанной категории"""
    return {"images": get_image_list(category)}

# Обработчик исключений
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Глобальный обработчик исключений"""
    logger.error(f"Необработанное исключение: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Внутренняя ошибка сервера: {str(exc)}"}
    )

# Корневой маршрут
@app.get("/")
async def root():
    """Корневой маршрут API"""
    return {"message": "Добро пожаловать в API Agrocor"}

# Запуск приложения
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)