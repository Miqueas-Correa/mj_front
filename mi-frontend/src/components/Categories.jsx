import { useState, useEffect } from "react";
import { MenuItem, ListItemText, CircularProgress, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import client from "../services/client";

export default function Categories({ onClose }) {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await client.get("/productos/categoria");
        
        // El backend devuelve un array de strings
        const categoriasData = Array.isArray(res.data) ? res.data : [];
        
        // Filtrar categorías vacías y ordenar alfabéticamente
        const categoriasLimpias = categoriasData
          .filter(cat => cat && cat.trim())
          .sort((a, b) => a.localeCompare(b));
        
        setCategorias(categoriasLimpias);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setError("No se pudieron cargar las categorías");
        
        // Fallback: categorías por defecto si falla
        setCategorias([
          "electronica",
          "tecnologia",
          "belleza",
          "ropa",
          "hogar",
          "deportes",
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleSelect = (categoria) => {
    // Cerrar el menú primero para evitar problemas de UI
    if (onClose) {
      onClose();
      // Dar un pequeño tiempo para que el menú se cierre (animación)
      setTimeout(() => {
        navigate(`/categoria/${encodeURIComponent(categoria.toLowerCase())}`);
      }, 120);
    } else {
      navigate(`/categoria/${encodeURIComponent(categoria.toLowerCase())}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning" sx={{ fontSize: "0.875rem" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (categorias.length === 0) {
    return (
      <MenuItem disabled>
        <ListItemText primary="No hay categorías disponibles" />
      </MenuItem>
    );
  }

  return (
    <>
      {categorias.map((cat) => (
        <MenuItem key={cat} onClick={() => handleSelect(cat)}>
          <ListItemText 
            primary={cat} 
            sx={{ textTransform: "capitalize" }} 
          />
        </MenuItem>
      ))}
    </>
  );
}