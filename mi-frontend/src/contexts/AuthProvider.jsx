import { useEffect, useState } from "react";
import client, { setAuthToken } from "../services/client";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, contrasenia) => {
    const res = await client.post("/auth/login", {
      email,
      contrasenia,
    });

    const { token, refresh } = res.data;

    if (!token) {
      throw new Error("Token no recibido");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refresh);
    setAuthToken(token);

    await loadUser();
  };

  // CARGAR USUARIO
  const loadUser = async () => {
    try {
      const res = await client.get("/usuarios/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error cargando usuario:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    setAuthToken(null);
    localStorage.clear();
    setUser(null);
    setLoading(false);
  };

  const reloadUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, reloadUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}