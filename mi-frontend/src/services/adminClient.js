import axios from "axios";

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

// Configurar token de autorización
export const setAuthToken = (token) => {
  if (token) {
    adminClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete adminClient.defaults.headers.common["Authorization"];
  }
};

// Interceptor para agregar automáticamente el token del localStorage
adminClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
adminClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/auth/refresh`,
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
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Si es 403 (Forbidden), el usuario no es admin
    if (error.response?.status === 403) {
      window.location.href = "/perfil";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default adminClient;