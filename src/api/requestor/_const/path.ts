const REQUESTOR_API_PATH = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    ME: "/api/v1/auth/me",
  },

  USER: {
    DEFAULT: "/api/v1/users",
    DETAIL: (id: string) => `/api/v1/users/${id}`,
  },
};

export default REQUESTOR_API_PATH;
