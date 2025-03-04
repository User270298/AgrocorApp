import AsyncStorage from '@react-native-async-storage/async-storage';

// Время жизни кеша в миллисекундах (15 минут)
const CACHE_EXPIRY = 15 * 60 * 1000;

/**
 * Сервис для кеширования данных
 */
export const cacheService = {
  /**
   * Получить данные из кеша
   * @param {string} key - Ключ кеша
   * @returns {Promise<Object|null>} - Данные из кеша или null, если кеш устарел или отсутствует
   */
  async get(key) {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      
      if (!cachedData) {
        return null;
      }
      
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      // Проверяем, не устарел ли кеш
      if (now - timestamp > CACHE_EXPIRY) {
        console.log(`Cache expired for ${key}`);
        return null;
      }
      
      console.log(`Cache hit for ${key}`);
      return data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  },
  
  /**
   * Сохранить данные в кеш
   * @param {string} key - Ключ кеша
   * @param {Object} data - Данные для кеширования
   * @returns {Promise<void>}
   */
  async set(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
      console.log(`Cache set for ${key}`);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },
  
  /**
   * Очистить кеш по ключу
   * @param {string} key - Ключ кеша
   * @returns {Promise<void>}
   */
  async clear(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Cache cleared for ${key}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
  
  /**
   * Очистить весь кеш
   * @returns {Promise<void>}
   */
  async clearAll() {
    try {
      await AsyncStorage.clear();
      console.log('All cache cleared');
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  },
  
  /**
   * Получить данные с обновлением кеша
   * @param {string} key - Ключ кеша
   * @param {Function} fetchFunction - Функция для получения данных с сервера
   * @param {boolean} forceRefresh - Принудительное обновление кеша
   * @returns {Promise<Object>} - Данные из кеша или с сервера
   */
  async getWithRefresh(key, fetchFunction, forceRefresh = false) {
    console.log(`Getting data for ${key}, forceRefresh: ${forceRefresh}`);
    
    // Если не требуется принудительное обновление, пробуем получить из кеша
    if (!forceRefresh) {
      const cachedData = await this.get(key);
      if (cachedData) {
        console.log(`Returning cached data for ${key}`);
        
        try {
          // Асинхронно обновляем кеш в фоне, если он скоро истечет
          const cachedItem = JSON.parse(await AsyncStorage.getItem(key));
          const now = new Date().getTime();
          
          // Если кеш старше 10 минут, обновляем его в фоне
          if (now - cachedItem.timestamp > 10 * 60 * 1000) {
            console.log(`Cache for ${key} is older than 10 minutes, refreshing in background`);
            this.refreshCacheInBackground(key, fetchFunction);
          }
        } catch (error) {
          console.error(`Error checking cache age for ${key}:`, error);
        }
        
        return cachedData;
      } else {
        console.log(`No valid cache found for ${key}`);
      }
    } else {
      console.log(`Force refreshing cache for ${key}`);
    }
    
    // Если кеш отсутствует или требуется обновление, получаем данные с сервера
    try {
      console.log(`Fetching fresh data for ${key}`);
      const freshData = await fetchFunction();
      console.log(`Received fresh data for ${key}:`, 
        typeof freshData === 'object' ? 
          `Object with ${Object.keys(freshData).length} keys` : 
          typeof freshData);
      
      await this.set(key, freshData);
      return freshData;
    } catch (error) {
      console.error(`Error fetching fresh data for ${key}:`, error);
      
      // В случае ошибки, пробуем вернуть данные из кеша, даже если они устарели
      try {
        const cachedData = await AsyncStorage.getItem(key);
        if (cachedData) {
          console.log(`Returning expired cache for ${key} due to fetch error`);
          return JSON.parse(cachedData).data;
        }
      } catch (cacheError) {
        console.error(`Error reading expired cache for ${key}:`, cacheError);
      }
      
      throw error;
    }
  },
  
  /**
   * Обновить кеш в фоновом режиме
   * @param {string} key - Ключ кеша
   * @param {Function} fetchFunction - Функция для получения данных с сервера
   * @returns {Promise<void>}
   */
  async refreshCacheInBackground(key, fetchFunction) {
    try {
      console.log(`Background refresh for ${key}`);
      const freshData = await fetchFunction();
      await this.set(key, freshData);
    } catch (error) {
      console.error('Error in background refresh:', error);
    }
  }
};

export default cacheService; 