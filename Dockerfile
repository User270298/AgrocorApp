FROM python:3.12-slim

# Установка необходимых системных пакетов
RUN apt-get update && apt-get install -y \
    python3-distutils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install watchdog 