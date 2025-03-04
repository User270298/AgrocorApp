// Конфигурация приложения

// URL сервера
// Для локальной разработки используйте IP-адрес вашего компьютера в локальной сети
// Например: "http://192.168.1.100:8000"
// Для продакшена используйте реальный домен
export const SERVER_URL = 'http://192.168.1.103:8000';

// Другие настройки приложения
export const APP_VERSION = "1.0.0";
export const APP_NAME = "Agrocor";

// Настройки для загрузки изображений
export const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5 MB
  allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
  quality: 0.8,
  timeout: 15000 // 15 секунд
};

// Базовый URL для API
export const URL_BASE = 'http://localhost:8000';

// Категории изображений
export const IMAGE_CATEGORIES = {
  NEWS: 'news_image',
  ANALYSIS: 'analysis_image',
  PROPOSAL: 'proposal_image',
  VESSEL: 'vessel_image',
  BEST: 'best_image',
  OFFER: 'offer_image',
  DEFAULT: 'image'
};

// Статусы для Vessel Catcher
export const VESSEL_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Типы для Vessel Catcher
export const VESSEL_TYPES = {
  VESSEL: 'vessel',
  CARGO: 'cargo'
};

// Конфигурация API эндпоинтов
export const API_ENDPOINTS = {
  // Общие
  HEALTH: '/api/health',
  UPLOAD_IMAGE: '/api/upload_image',
  IMAGES: '/api/images',
  
  // Новости
  NEWS: '/api/news',
  FEATURED_NEWS: '/api/featured_news',
  
  // Аналитика
  ANALYSIS: '/api/analysis',
  FEATURED_ANALYSIS: '/api/featured_analysis',
  
  // Предложения
  PROPOSAL: '/api/proposal',
  FEATURED_PROPOSALS: '/api/featured_proposals',
  
  // Трейдеры
  TRADER: '/api/trader',
  
  // Категории
  CATEGORY: '/api/category',
  
  // Предложения и запросы
  OFFER: '/api/offer',
  REQUEST: '/api/request',
  
  // Vessel Catcher
  VESSEL: '/vessel',
  CARGO: '/cargo',
  CATCHER: '/catcher',
  PENDING_VESSELS: '/pending_vessels',
  PENDING_CARGO: '/pending_cargo',
  APPROVE_VESSEL: '/approve_vessel',
  REJECT_VESSEL: '/reject_vessel',
  APPROVE_CARGO: '/approve_cargo',
  REJECT_CARGO: '/reject_cargo'
};

// Статусы записей
export const RECORD_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};

export const PRODUCT_CATEGORIES = [
  'Зерновые',
  'Масличные',
  'Бобовые',
  'Специи',
  'Другое'
];

export const FORM_TYPES = {
  NEWS: 'news',
  OFFER: 'offer',
  REQUEST: 'request',
  CATCHER: 'catcher',
  ANALYSIS: 'analysis'
};

export const ENDPOINTS = {
  [FORM_TYPES.NEWS]: '/news',
  [FORM_TYPES.OFFER]: '/offers',
  [FORM_TYPES.REQUEST]: '/requests',
  [FORM_TYPES.CATCHER]: '/vessel_catcher',
  [FORM_TYPES.ANALYSIS]: '/analysis'
};

export const FORM_FIELDS = {
  [FORM_TYPES.NEWS]: [
    { name: 'title', label: 'Заголовок', required: true },
    { name: 'content', label: 'Содержание', required: true, multiline: true },
    { name: 'image', label: 'Изображение', type: 'image' }
  ],
  [FORM_TYPES.OFFER]: [
    { name: 'title', label: 'Название', required: true },
    { name: 'category', label: 'Категория', type: 'select', options: PRODUCT_CATEGORIES, required: true },
    { name: 'quantity', label: 'Количество', required: true, keyboardType: 'numeric' },
    { name: 'price', label: 'Цена', required: true, keyboardType: 'numeric' },
    { name: 'description', label: 'Описание', multiline: true },
    { name: 'image', label: 'Изображение', type: 'image' }
  ],
  [FORM_TYPES.REQUEST]: [
    { name: 'title', label: 'Название', required: true },
    { name: 'category', label: 'Категория', type: 'select', options: PRODUCT_CATEGORIES, required: true },
    { name: 'quantity', label: 'Количество', required: true, keyboardType: 'numeric' },
    { name: 'description', label: 'Описание', multiline: true }
  ],
  [FORM_TYPES.CATCHER]: [
    { name: 'title', label: 'Название судна', required: true },
    { name: 'dwt', label: 'DWT', required: true, keyboardType: 'numeric' },
    { name: 'blt', label: 'BLT', required: true },
    { name: 'flag', label: 'Флаг', required: true },
    { name: 'open_at', label: 'Открыто в', required: true },
    { name: 'availability', label: 'Доступность', required: true },
    { name: 'description', label: 'Дополнительная информация', multiline: true }
  ],
  [FORM_TYPES.ANALYSIS]: [
    { name: 'title', label: 'Заголовок', required: true },
    { name: 'category', label: 'Категория', type: 'select', options: PRODUCT_CATEGORIES, required: true },
    { name: 'content', label: 'Содержание анализа', required: true, multiline: true },
    { name: 'image', label: 'Изображение', type: 'image' }
  ]
}; 