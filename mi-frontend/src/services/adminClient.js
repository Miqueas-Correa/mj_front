import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL no está definido");
}

const adminClient = axios.create({ baseURL });

export const setAuthToken = (token) => {
  if (token) {
    adminClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete adminClient.defaults.headers.common["Authorization"];
  }
};

adminClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refresh}`,
            },
          }
        );

        const { token } = res.data;

        localStorage.setItem("token", token);
        setAuthToken(token);

        originalRequest.headers.Authorization = `Bearer ${token}`;

        return adminClient(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/perfil";
    }

    return Promise.reject(error);
  }
);

export default adminClient;