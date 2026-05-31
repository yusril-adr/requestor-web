const CONFIG = {
  REQUESTOR_API_BASE_URL: import.meta.env.VITE_REQUESTOR_API_BASE_URL,

  LOCAL_STORAGE: {
    ACCESS_TOKEN_KEY: "accessToken",
  },

  QUERY_KEY: {
    REQUESTOR_API: {
      ALL: () => ["requestor"],
      AUTH: {
        ALL: () => [...CONFIG.QUERY_KEY.REQUESTOR_API.ALL(), "auth"],
        ME: () => [...CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ALL(), "me"],
      },
      USER: {
        ALL: () => [...CONFIG.QUERY_KEY.REQUESTOR_API.ALL(), "user"],
      },
      REQUEST: {
        ALL: () => [...CONFIG.QUERY_KEY.REQUESTOR_API.ALL(), "request"],
      },
      AUDIT_LOG: {
        ALL: () => [...CONFIG.QUERY_KEY.REQUESTOR_API.ALL(), "audit-log"],
      },
    },
  },
};

export default CONFIG;
