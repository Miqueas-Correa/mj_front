// pages/Categories.jsx - RENOMBRADO Y CORREGIDO
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import ProductCard from "../components/ProductCard";
import client from "../services/client";

function capitalize(str = "") {
  if (!str) return "";
  return String(str)
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Category() {
  const { categoria } = useParams();
  const cat = decodeURIComponent(categoria || "");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Subir al inicio cuando cambia la categoría
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProductos = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await client.get(`/productos/categoria/${encodeURIComponent(cat)}`);

        // Maneja diferentes formatos de respuesta del backend
        const productosData = Array.isArray(res.data)
          ? res.data
          : res.data?.productos || [];

        setProductos(productosData);
      } catch (err) {
        console.error("Error cargando productos:", err);

        if (err.response?.status === 404) {
          setError(`No se encontraron productos en la categoría "${capitalize(cat)}"`);
        } else {
          setError("Error al cargar los productos. Intenta nuevamente.");
        }

        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    if (cat) {
      fetchProductos();
    } else {
      setProductos([]);
      setLoading(false);
    }
  }, [cat]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: "60vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, textTransform: "capitalize" }}
      >
        {capitalize(cat)}
      </Typography>

      {/* MENSAJE DE ERROR */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* GRID DE PRODUCTOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(5, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductCard
              key={producto.id ?? producto._id ?? producto.nombre}
              producto={producto}
            />
          ))
        ) : (
          !error && (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay productos en esta categoría
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estamos trabajando para agregar más productos pronto
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}