// Safe storage utilities to handle localStorage and sessionStorage access
// Prevents errors when storage is disabled in certain contexts (e.g., data URLs)

export const safeGetLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.warn(`localStorage access failed for key "${key}":`, error);
  }
  return null;
};

export const safeSetLocalStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`localStorage set failed for key "${key}":`, error);
  }
};

export const safeRemoveLocalStorage = (key: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`localStorage remove failed for key "${key}":`, error);
  }
};

export const safeGetSessionStorage = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      return sessionStorage.getItem(key);
    }
  } catch (error) {
    console.warn(`sessionStorage access failed for key "${key}":`, error);
  }
  return null;
};

export const safeSetSessionStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`sessionStorage set failed for key "${key}":`, error);
  }
};

export const safeRemoveSessionStorage = (key: string): void => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`sessionStorage remove failed for key "${key}":`, error);
  }
};