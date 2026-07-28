const CONFIG = {
  MAIN_API_BASE_URL: import.meta.env.VITE_MAIN_API_BASE_URL,

  LOCAL_STORAGE: {
    ACCESS_TOKEN_KEY: "accessToken",
  },

  QUERY_KEY: {
    MAIN_API: {
      ALL: () => ["main"],
      AUTH: {
        ALL: () => [...CONFIG.QUERY_KEY.MAIN_API.ALL(), "auth"],
        ME: () => [...CONFIG.QUERY_KEY.MAIN_API.AUTH.ALL(), "me"],
      },
      USER: {
        ALL: () => [...CONFIG.QUERY_KEY.MAIN_API.ALL(), "user"],
      },
      REQUEST: {
        ALL: () => [...CONFIG.QUERY_KEY.MAIN_API.ALL(), "request"],
      },
      AUDIT_LOG: {
        ALL: () => [...CONFIG.QUERY_KEY.MAIN_API.ALL(), "audit-log"],
      },
    },
  },
};

export default CONFIG;
