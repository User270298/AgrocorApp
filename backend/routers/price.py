import yfinance as yf
from bs4 import BeautifulSoup
import requests

# Тикеры для биткоина, валютных пар и нефти
tickers = {
    'Bitcoin': 'BTC-USD',
    'USD/RUB': 'USDRUB=X',
    'EUR/RUB': 'EURRUB=X',
    'Brent Crude Oil': 'BZ=F',
    'USD/CNY': 'CNY=X',
    'USD/TRY': 'TRY=X',
}

# Период для запроса данных (например, 5 дней)
period = "5d"


# Функция для получения цен
def get_prices():
    try:
        prices = {}

        for name, ticker in tickers.items():
            # Создаем объект тикера
            stock = yf.Ticker(ticker)

            # Получаем исторические данные
            data = stock.history(period=period)

            # Проверяем, что DataFrame не пустой и содержит хотя бы одну строку данных
            if not data.empty and len(data) > 0:
                # Получаем последнюю цену закрытия
                last_price = data['Close'].iloc[-1]
                # Округляем значение и добавляем в словарь
                if name == 'Bitcoin':
                    prices['btc_price'] = round(last_price, 1)
                elif name == 'Brent Crude Oil':
                    prices['oil_price'] = round(last_price, 2)
                else:
                    # Добавляем другие валюты
                    prices[name.lower().replace('/', '_')] = round(last_price, 4)
            else:
                prices[name] = None  # Если данных нет, присваиваем None

        return prices
    except Exception as e:
        return ''


# Вызов функции для получения цен
def get_chicago():
    try:
        urls = ['https://www.investing.com/commodities/us-wheat',
                'https://www.investing.com/commodities/us-soybeans-historical-data',
                'https://www.investing.com/commodities/us-corn']
        prices = {}
        count = 0
        for url in urls:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
            }
            # Отправка GET-запроса
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                # Создание объекта BeautifulSoup для парсинга
                soup = BeautifulSoup(response.content, 'html.parser')
                price = soup.find('div',
                                  class_='text-5xl/9 font-bold text-[#232526] md:text-[42px] md:leading-[60px]').text
                last_price = soup.find('span', class_='key-info_dd-numeric__ZQFIs')
                # price = price.replace(',', '.')
                # last_price = last_price.replace(',', '.')
                if count == 0:
                    prices['Wheat_CHICAGO'] = {'current_price': price}
                if count == 1:
                    prices['Soybeans_CHICAGO'] = {'current_price': price}
                if count == 2:
                    prices['Corn_CHICAGO'] = {'current_price': price}
                count += 1
            else:
                print(f'Ошибка при запросе: {response.status_code}')
        return prices
    except Exception as e:
        return ''


def get_maex():
    try:
        urls = ['https://ru.investing.com/indices/barley-fob-black-sea-index',
                'https://ru.investing.com/indices/wheat-fob-black-sea-index']
        prices = {}
        count = 0
        for url in urls:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
            }
            # Отправка GET-запроса
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                # Создание объекта BeautifulSoup для парсинга
                soup = BeautifulSoup(response.content, 'html.parser')
                price = soup.find('div',
                                  class_='text-5xl/9 font-bold text-[#232526] md:text-[42px] md:leading-[60px]').text
                last_price = soup.find('span', class_='key-info_dd-numeric__ZQFIs').text
                price = price.replace(',', '.')
                last_price = last_price.replace(',', '.')
                if count == 0:
                    prices['Barley'] = {'current_price': price}
                if count == 1:
                    prices['Wheat'] = {'current_price': price}
                count += 1
            else:
                print(f'Ошибка при запросе: {response.status_code}')
    except Exception as e:
        print(e)
    try:
        url = 'https://investfuture.ru/russian_indexes/history/4621'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
        }
        # Отправка GET-запроса
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            table = soup.find('table', class_='table table-bordered table-hover')
            rows = table.find_all('tr')[1:3]  # выбираем первые две строки с данными
            values = [float(row.find_all('td')[1].text.replace(',', '.')) for row in rows]
            prices['Corn'] = {'current_price': values[0]}
        else:
            print(f'Ошибка при запросе: {response.status_code}')
        return prices
    except Exception as e:
        print(e)


def get_matif():
    try:
        urls = ['https://ru.investing.com/commodities/us-corn?cid=964533',
                'https://ru.investing.com/commodities/milling-wheat-n2',
                'https://ru.investing.com/commodities/rapeseed']
        prices = {}
        count = 0
        for url in urls:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
            }
            # Отправка GET-запроса
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                # Создание объекта BeautifulSoup для парсинга
                soup = BeautifulSoup(response.content, 'html.parser')
                price = soup.find('div',
                                  class_='text-5xl/9 font-bold text-[#232526] md:text-[42px] md:leading-[60px]').text
                last_price = soup.find('span', class_='key-info_dd-numeric__ZQFIs').text
                price = price.replace(',', '.')
                last_price = last_price.replace(',', '.')
                if count == 0:
                    prices['Corn_matif'] = {'current_price': price}
                if count == 1:
                    prices['Wheat_matif'] = {'current_price': price}
                if count == 2:
                    prices['Rapeseed'] = {'current_price': price}
                count += 1
            else:
                print(f'Ошибка при запросе: {response.status_code}')
        return prices
    except Exception as e:
        return ''

import numpy as np

def convert_numpy_to_native(data):
    if isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, np.generic):  # Для np.float64, np.int64 и других
        return data.item()
    elif isinstance(data, dict):
        return {key: convert_numpy_to_native(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_numpy_to_native(value) for value in data]
    
    return data

# print(get_prices())
# print(get_matif())
# print(get_chicago())
# print(get_maex())