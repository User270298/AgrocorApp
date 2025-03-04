import { URL_BASE } from '../config';

/**
 * Нормализует путь к изображению для корректного отображения
 * @param {string} imageUrl - Путь к изображению
 * @param {string} categoryPath - Категория изображения (news_image, vessel_image, analysis_image, proposal_image)
 * @returns {string|undefined} - Нормализованный путь к изображению или undefined, если путь не указан
 */
export const normalizeImageUrl = (imageUrl, categoryPath = 'image') => {
  if (!imageUrl) {
    return undefined;
  }

  // Если путь уже содержит полный URL, возвращаем его как есть
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Если путь начинается с /static/, добавляем базовый URL
  if (imageUrl.startsWith('/static/')) {
    return `${URL_BASE}${imageUrl}`;
  }

  // Если путь начинается с static/, добавляем базовый URL и слеш
  if (imageUrl.startsWith('static/')) {
    return `${URL_BASE}/${imageUrl}`;
  }

  // Если путь содержит только имя файла, предполагаем, что оно находится в указанной категории
  if (!imageUrl.includes('/')) {
    return `${URL_BASE}/static/images/${categoryPath}/${imageUrl}`;
  }

  // Если путь содержит категорию и имя файла (например, news_image/file.jpg)
  const parts = imageUrl.split('/');
  if (parts.length === 2) {
    // Если первая часть - это категория, используем ее
    return `${URL_BASE}/static/images/${parts[0]}/${parts[1]}`;
  }

  // Если путь содержит полный путь к файлу (например, /static/images/news_image/file.jpg)
  if (imageUrl.includes('/static/images/')) {
    // Извлекаем имя файла из полного пути
    const fileName = imageUrl.split('/').pop();
    return `${URL_BASE}/static/images/${categoryPath}/${fileName}`;
  }

  // В остальных случаях используем переданную категорию и имя файла
  return `${URL_BASE}/static/images/${categoryPath}/${imageUrl.split('/').pop()}`;
};

/**
 * Получает имя файла из пути к изображению
 * @param {string} imageUrl - Путь к изображению
 * @returns {string|undefined} - Имя файла или undefined, если путь не указан
 */
export const getImageFileName = (imageUrl) => {
  if (!imageUrl) {
    return undefined;
  }

  return imageUrl.split('/').pop();
};

/**
 * Получает категорию изображения из пути
 * @param {string} imageUrl - Путь к изображению
 * @returns {string|undefined} - Категория изображения или undefined, если путь не указан
 */
export const getImageCategory = (imageUrl) => {
  if (!imageUrl) {
    return undefined;
  }

  // Если путь содержит /static/images/, извлекаем категорию
  if (imageUrl.includes('/static/images/')) {
    const parts = imageUrl.split('/');
    const imagesIndex = parts.indexOf('images');
    if (imagesIndex !== -1 && parts.length > imagesIndex + 1) {
      return parts[imagesIndex + 1];
    }
  }

  // Если путь содержит категорию и имя файла (например, news_image/file.jpg)
  const parts = imageUrl.split('/');
  if (parts.length === 2) {
    return parts[0];
  }

  return 'image'; // По умолчанию используем категорию 'image'
}; 