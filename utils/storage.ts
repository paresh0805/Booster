/**
 * localStorage utilities for persisting application data
 */

const STORAGE_PREFIX = 'booster_';

export const storageKeys = {
  USER_ROLE: `${STORAGE_PREFIX}user_role`,
  LAST_LOGIN: `${STORAGE_PREFIX}last_login`,
  STUDENT_SCORES: `${STORAGE_PREFIX}student_scores`,
  STUDENTS_DATA: `${STORAGE_PREFIX}students_data`,
  SUBJECTS_DATA: `${STORAGE_PREFIX}subjects_data`,
  THEME_PREFERENCE: `${STORAGE_PREFIX}theme_preference`,
};

export const saveToLocalStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

export const getFromLocalStorage = <T,>(key: string, defaultValue?: T): T | null => {
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      return defaultValue || null;
    }
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue || null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
};

export const clearLocalStorage = (): void => {
  try {
    Object.values(storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
};

export const getStorageSize = (): string => {
  let size = 0;
  for (let key in localStorage) {
    if (key.startsWith(STORAGE_PREFIX)) {
      size += localStorage[key].length + key.length;
    }
  }
  return (size / 1024).toFixed(2) + ' KB';
};
