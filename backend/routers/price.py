from bs4 import BeautifulSoup
import requests


def get_prices():
    """
    Функция для получения цен с указанных URL.
    Возвращает словарь с ценами, округленными до одной десятой, или пустую строку в случае ошибки.
    """
    try:
        # Список URL и соответствующих им названий
        urls = [
            ('USD/RUB', 'https://ru.investing.com/currencies/usd-rub-exchange-rate-cash-futures'),
            ('EUR/RUB', 'https://ru.investing.com/currencies/eur-rub'),
            ('Brent Crude Oil', 'https://ru.investing.com/etfs/etfs-brent-crude'),
            ('USD/CNY', 'https://ru.investing.com/currencies/usd-cny'),
            ('USD/TRY', 'https://ru.investing.com/currencies/usd-try')
        ]

        # Заголовки для запросов
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
        }

        # Словарь для хранения цен
        prices = {}

        # Перебор URL и получение цен
        for name, url in urls:
            try:
                # Отправка GET-запроса
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    # Парсинг HTML-страницы
                    soup = BeautifulSoup(response.content, 'html.parser')
                    # Поиск цены
                    price_element = soup.find('div', class_='text-5xl/9 font-bold text-[#232526] md:text-[42px] md:leading-[60px]')
                    if price_element:
                        # Очистка и преобразование цены
                        price_text = price_element.text.strip()
                        if name == 'USD/RUB':
                            price_text = price_text.replace(',', '').replace(',', '.')
                        else:
                            price_text = price_text.replace('.', '').replace(',', '.')
                        
                        # Преобразование в число и округление до одной десятой
                        price = round(float(price_text), 1)
                        prices[name] = price
                    else:
                        print(f"Цена не найдена на странице: {url}")
                        prices[name] = 'N/A'
                else:
                    print(f"Ошибка: {response.status_code} для {url}")
                    prices[name] = 'N/A'
            except Exception as e:
                print(f"Ошибка при обработке {url}: {e}")
                prices[name] = 'N/A'

        # Обработка Bitcoin
        url = ('Bitcoin', 'https://coinmarketcap.com/currencies/bitcoin/')
        response = requests.get(url[1], headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            price_element = soup.find('span', class_='sc-65e7f566-0 WXGwg base-text')
            if price_element:
                # Очистка и преобразование цены
                price_text = price_element.text.replace('$', '').replace(',', '')
                # Преобразование в число и округление до одной десятой
                price = round(float(price_text), 1)
                prices[url[0]] = price
            else:
                print(f"Цена не найдена на странице: {url[1]}")
                prices[url[0]] = 'N/A'
        else:
            print(f"Ошибка: {response.status_code} для {url[1]}")
            prices[url[0]] = 'N/A'

        return prices

    except Exception as e:
        print(f"Общая ошибка: {e}")
        return {}


print(get_prices())


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
