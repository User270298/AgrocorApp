# Agrocor API

Бэкенд для приложения Agrocor, предоставляющий API для работы с новостями, аналитикой, предложениями и запросами.

## Технологии

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## Установка и запуск

### Требования

- Python 3.8+
- pip

### Установка зависимостей

```bash
pip install -r requirements.txt
```

### Запуск сервера

```bash
cd backend
uvicorn main:app --reload
```

Сервер будет доступен по адресу: http://localhost:8000

## Документация API

После запуска сервера, документация API доступна по адресу:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Основные эндпоинты

### Общие

- `GET /` - Проверка работоспособности API
- `GET /api/health` - Проверка состояния сервера и наличия необходимых директорий
- `POST /api/upload_image` - Загрузка изображения
- `GET /api/images` - Получение списка изображений

### Новости

- `GET /api/news` - Получение списка всех новостей
- `GET /api/news/{news_id}` - Получение конкретной новости
- `POST /api/news` - Создание новой новости
- `PUT /api/news/{news_id}` - Обновление новости
- `DELETE /api/news/{news_id}` - Удаление новости
- `GET /api/featured_news` - Получение избранных новостей

### Аналитика

- `GET /api/analysis` - Получение списка всех аналитических материалов
- `GET /api/analysis/{analysis_id}` - Получение конкретного аналитического материала
- `POST /api/analysis` - Создание нового аналитического материала
- `PUT /api/analysis/{analysis_id}` - Обновление аналитического материала
- `DELETE /api/analysis/{analysis_id}` - Удаление аналитического материала
- `GET /api/featured_analysis` - Получение избранных аналитических материалов

### Предложения (Proposals)

- `GET /api/proposal` - Получение списка всех предложений
- `GET /api/proposal/{proposal_id}` - Получение конкретного предложения
- `POST /api/proposal` - Создание нового предложения
- `PUT /api/proposal/{proposal_id}` - Обновление предложения
- `DELETE /api/proposal/{proposal_id}` - Удаление предложения
- `GET /api/featured_proposals` - Получение избранных предложений

### Трейдеры

- `GET /api/trader` - Получение списка всех трейдеров
- `GET /api/trader/{trader_id}` - Получение конкретного трейдера
- `POST /api/trader` - Создание нового трейдера
- `PUT /api/trader/{trader_id}` - Обновление трейдера
- `DELETE /api/trader/{trader_id}` - Удаление трейдера
- `PATCH /api/trader/{trader_id}/toggle_active` - Переключение статуса активности трейдера

### Категории

- `GET /api/category` - Получение списка всех категорий
- `GET /api/category/{category_id}` - Получение конкретной категории
- `POST /api/category` - Создание новой категории
- `PUT /api/category/{category_id}` - Обновление категории
- `DELETE /api/category/{category_id}` - Удаление категории

### Предложения (Offers)

- `GET /api/offer` - Получение списка всех предложений
- `GET /api/offer/{offer_id}` - Получение конкретного предложения
- `POST /api/offer` - Создание нового предложения
- `PUT /api/offer/{offer_id}` - Обновление предложения
- `DELETE /api/offer/{offer_id}` - Удаление предложения

### Запросы (Requests)

- `GET /api/request` - Получение списка всех запросов
- `GET /api/request/{request_id}` - Получение конкретного запроса
- `POST /api/request` - Создание нового запроса
- `PUT /api/request/{request_id}` - Обновление запроса
- `DELETE /api/request/{request_id}` - Удаление запроса

### Vessel Catcher

- `POST /api/vessel/create_post` - Создание новой записи о судне или грузе
- `GET /api/vessel/posts` - Получение списка всех одобренных записей о судах
- `GET /api/cargo/posts` - Получение списка всех одобренных записей о грузах
- `GET /api/pending_vessels` - Получение списка всех записей, ожидающих подтверждения
- `GET /api/vessel/{vessel_id}` - Получение конкретной записи о судне или грузе
- `POST /api/approve_vessel/{vessel_id}` - Одобрение записи о судне или грузе
- `POST /api/reject_vessel/{vessel_id}` - Отклонение записи о судне или грузе
- `DELETE /api/vessel/{vessel_id}` - Удаление записи о судне или грузе

#### Новости Vessel Catcher

- `GET /api/vessel/news` - Получение списка всех новостей Vessel Catcher
- `GET /api/vessel/news/{news_id}` - Получение конкретной новости Vessel Catcher
- `POST /api/vessel/news` - Создание новой новости для Vessel Catcher
- `PUT /api/vessel/news/{news_id}` - Обновление новости Vessel Catcher
- `DELETE /api/vessel/news/{news_id}` - Удаление новости Vessel Catcher
- `GET /api/vessel/featured_news` - Получение избранных новостей Vessel Catcher

## Структура проекта

```
backend/
├── database.py         # Настройка базы данных
├── main.py             # Основной файл приложения
├── models.py           # Модели данных SQLAlchemy
├── schemas.py          # Схемы данных Pydantic
├── routers/            # Маршруты API
│   ├── analysis.py     # Маршруты для аналитики
│   ├── category.py     # Маршруты для категорий
│   ├── news.py         # Маршруты для новостей
│   ├── offer.py        # Маршруты для предложений
│   ├── proposal.py     # Маршруты для лучших предложений
│   ├── request.py      # Маршруты для запросов
│   ├── trader.py       # Маршруты для трейдеров
│   └── vessel.py       # Маршруты для Vessel Catcher
└── static/             # Статические файлы
    └── images/         # Директория для изображений
```

## Модели данных

### News (Новости)
- id: int
- title: str
- content: str
- image_url: Optional[str]
- is_featured: bool
- created_at: datetime

### Analysis (Аналитика)
- id: int
- title: str
- content: str
- image_url: Optional[str]
- is_featured: bool
- created_at: datetime

### Proposal (Лучшие предложения)
- id: int
- title: str
- description: str
- price: Optional[float]
- currency: str
- trader_contact: str
- image_url: Optional[str]
- is_featured: bool
- created_at: datetime

### Trader (Трейдеры)
- id: int
- name: str
- contact: str
- is_active: bool

### Category (Категории)
- id: int
- name: str
- description: Optional[str]

### Offer (Предложения)
- id: int
- crop_name: str
- quantity: str
- port: str
- shipment_period: str
- price: Optional[str]
- country: str
- category_id: int
- trader_id: int
- image_url: Optional[str]
- created_at: datetime

### Request (Запросы)
- id: int
- crop_name: str
- quantity: str
- port: str
- shipment_period: str
- price: Optional[str]
- country: str
- category_id: int
- trader_id: int
- image_url: Optional[str]
- created_at: datetime

### VesselPost (Записи Vessel Catcher)
- id: int
- name: str
- type: str ("vessel" или "cargo")
- details: Dict[str, Any]
- image_url: Optional[str]
- status: str ("pending", "approved", "rejected")
- created_at: datetime

### VesselNews (Новости Vessel Catcher)
- id: int
- title: str
- content: str
- image_url: Optional[str]
- is_featured: bool
- created_at: datetime
