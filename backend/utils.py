import os
import shutil
from pathlib import Path
from datetime import datetime
import uuid
from fastapi import UploadFile, HTTPException
import logging

logger = logging.getLogger(__name__)

# Базовая директория для изображений
BASE_IMAGE_DIR = Path("static/images")

def ensure_image_dir(category: str) -> Path:
    """
    Проверяет существование директории для категории изображений и создает ее при необходимости.
    
    Args:
        category: Категория изображений (news_image, vessel_image, analysis_image, proposal_image)
        
    Returns:
        Path: Путь к директории
    """
    category_dir = BASE_IMAGE_DIR / category
    category_dir.mkdir(parents=True, exist_ok=True)
    return category_dir

def save_uploaded_image(file: UploadFile, category: str = "image") -> str:
    """
    Сохраняет загруженное изображение в соответствующую директорию.
    
    Args:
        file: Загруженный файл
        category: Категория изображения (news_image, vessel_image, analysis_image, proposal_image)
        
    Returns:
        str: Относительный путь к сохраненному изображению
    """
    try:
        # Проверяем, что файл является изображением
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Файл должен быть изображением"
            )
        
        # Создаем директорию для категории, если она не существует
        category_dir = ensure_image_dir(category)
        
        # Генерируем уникальное имя файла
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"{category}_{timestamp}_{unique_id}{file_extension}"
        
        # Сохраняем файл
        file_path = category_dir / new_filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Возвращаем относительный путь к файлу для использования на клиенте
        relative_path = f"/static/images/{category}/{new_filename}"
        
        logger.info(f"Изображение успешно загружено: {relative_path}")
        return relative_path
    
    except HTTPException as e:
        # Пробрасываем HTTP исключения дальше
        raise e
    except Exception as e:
        # Логируем и возвращаем ошибку
        error_msg = f"Ошибка при загрузке изображения: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

def get_image_list(category: str = "image") -> list:
    """
    Получает список изображений в указанной категории.
    
    Args:
        category: Категория изображений (news_image, vessel_image, analysis_image, proposal_image)
        
    Returns:
        list: Список изображений
    """
    category_dir = ensure_image_dir(category)
    
    images = []
    for file_path in category_dir.glob("*"):
        if file_path.is_file() and file_path.suffix.lower() in [".jpg", ".jpeg", ".png", ".gif"]:
            stat = file_path.stat()
            images.append({
                "name": file_path.name,
                "path": f"/static/images/{category}/{file_path.name}",
                "size": stat.st_size,
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
    
    return images

def normalize_image_path(image_url: str) -> str:
    """
    Нормализует путь к изображению, чтобы он был корректным для использования на клиенте.
    
    Args:
        image_url: Путь к изображению
        
    Returns:
        str: Нормализованный путь к изображению
    """
    if not image_url:
        return None
    
    # Если путь уже начинается с /static, возвращаем его как есть
    if image_url.startswith("/static/"):
        return image_url
    
    # Если путь начинается с static/, добавляем / в начало
    if image_url.startswith("static/"):
        return f"/{image_url}"
    
    # Если путь содержит только имя файла, предполагаем, что оно находится в директории image
    if "/" not in image_url:
        return f"/static/images/image/{image_url}"
    
    # Если путь содержит категорию и имя файла (например, news_image/file.jpg)
    parts = image_url.split("/")
    if len(parts) == 2:
        category, filename = parts
        return f"/static/images/{category}/{filename}"
    
    # В остальных случаях возвращаем путь как есть
    return image_url 