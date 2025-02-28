import AsyncStorage from "@react-native-async-storage/async-storage";

export const Cache = {
  async get(key) {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving cache for key "${key}":`, error);
      return null;
    }
  },

  async set(key, value) {
    try {
      const dataString = JSON.stringify(value);
      await AsyncStorage.setItem(key, dataString);
    } catch (error) {
      console.error(`Error setting cache for key "${key}":`, error);
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing cache for key "${key}":`, error);
    }
  },

  async isCacheValid(key, validityDurationInHours = 24) {
    try {
      const lastUpdated = await AsyncStorage.getItem(`${key}_lastUpdated`);
      if (!lastUpdated) return false;

      const lastUpdatedTime = new Date(lastUpdated);
      const currentTime = new Date();
      const hoursDifference =
        Math.abs(currentTime - lastUpdatedTime) / 36e5;

      return hoursDifference < validityDurationInHours;
    } catch (error) {
      console.error(`Error validating cache for key "${key}":`, error);
      return false;
    }
  },

  async updateTimestamp(key) {
    try {
      const currentTime = new Date().toISOString();
      await AsyncStorage.setItem(`${key}_lastUpdated`, currentTime);
    } catch (error) {
      console.error(`Error updating timestamp for key "${key}":`, error);
    }
  },
};
