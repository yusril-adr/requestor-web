import CONFIG from "@/common/constants/config";

const AccessToken = {
  get(): string | null {
    return localStorage.getItem(CONFIG.LOCAL_STORAGE.ACCESS_TOKEN_KEY);
  },

  set(accessToken: string): void {
    localStorage.setItem(CONFIG.LOCAL_STORAGE.ACCESS_TOKEN_KEY, accessToken);
  },

  remove(): void {
    localStorage.removeItem(CONFIG.LOCAL_STORAGE.ACCESS_TOKEN_KEY);
  },
};

export default AccessToken;
