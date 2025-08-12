import Cookies from "js-cookie";

export const AUTH_KEYS = {
  TOKEN: "token",
  USER: "cached_user",
  LAST_CHECK: "last_auth_check",
  OFFLINE_MODE: "offline_auth_mode",
};

export const authStorage = {
  setAuthState: (token: string, user: any) => {
    Cookies.set(AUTH_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(AUTH_KEYS.LAST_CHECK, Date.now().toString());
    localStorage.removeItem(AUTH_KEYS.OFFLINE_MODE);
  },

  getCachedUser: () => {
    const cached = localStorage.getItem(AUTH_KEYS.USER);
    return cached ? JSON.parse(cached) : null;
  },

  getCachedToken: () => {
    return Cookies.get(AUTH_KEYS.TOKEN);
  },

  getLastAuthCheck: () => {
    const lastCheck = localStorage.getItem(AUTH_KEYS.LAST_CHECK);
    return lastCheck ? parseInt(lastCheck) : 0;
  },

  setOfflineMode: (isOffline: boolean) => {
    if (isOffline) {
      localStorage.setItem(AUTH_KEYS.OFFLINE_MODE, "true");
    } else {
      localStorage.removeItem(AUTH_KEYS.OFFLINE_MODE);
    }
  },

  isOfflineMode: () => {
    return localStorage.getItem(AUTH_KEYS.OFFLINE_MODE) === "true";
  },

  clearAuthState: () => {
    Cookies.remove(AUTH_KEYS.TOKEN);
    // localStorage.removeItem(AUTH_KEYS.USER);
    // localStorage.removeItem(AUTH_KEYS.LAST_CHECK);
    // localStorage.removeItem(AUTH_KEYS.OFFLINE_MODE);
  },

  isCacheValid: (maxAgeHours = 24) => {
    const lastCheck = authStorage.getLastAuthCheck();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    return Date.now() - lastCheck < maxAge;
  },
};
