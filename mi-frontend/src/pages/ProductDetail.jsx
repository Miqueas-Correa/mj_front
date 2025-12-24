import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import client from "../services/client";
import { useCart } from "../hooks/useCart";

export default function ProductDetail() {
  const { addToCart } = useCart();

  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [openImage, setOpenImage] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProducto = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await client.get(`/productos/${id}`);

        const productoData = Array.isArray(res.data) ? res.data[0] : res.data;

        if (!productoData) {
          setError("Producto no encontrado");
          return;
        }

        setProducto(productoData);
        document.title = `${productoData.nombre} - MJ STORE`;
      } catch (err) {
        console.error("Error cargando producto:", err);

        if (err.response?.status === 404) {
          setError("Producto no encontrado");
        } else {
          setError("Error al cargar el producto. Intenta nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  const handleCantidadChange = (valor) => {
    const nuevaCantidad = cantidad + valor;

    if (nuevaCantidad < 1) return;
    if (producto && nuevaCantidad > producto.stock) {
      setError(`Solo hay ${producto.stock} unidades disponibles`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setCantidad(nuevaCantidad);
  };

  const handleCantidadInput = (e) => {
    const valor = parseInt(e.target.value);

    if (isNaN(valor) || valor < 1) {
      setCantidad(1);
      return;
    }

    if (producto && valor > producto.stock) {
      setCantidad(producto.stock);
      setError(`Solo hay ${producto.stock} unidades disponibles`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setCantidad(valor);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    setError("");

    try {
      // Agregar al carrito local
      addToCart(producto, cantidad);

      setSuccessMessage(
        `¡${cantidad} ${cantidad === 1 ? "unidad agregada" : "unidades agregadas"} al carrito!`
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Error al agregar al carrito. Intenta nuevamente.", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !producto) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>
    );
  }

  if (!producto) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      {/* Botón volver */}
      <Button 
        variant="text" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      {/* Mensajes de éxito/error */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            {/* IMAGEN */}
            <Box>
              <Box
                component="img"
                src={producto.imagen_url || "https://via.placeholder.com/400"}
                alt={producto.nombre}
                onClick={() => setOpenImage(true)}
                sx={{
                  width: "100%",
                  maxHeight: 500,
                  objectFit: "contain",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 1 }}
              >
                Haz clic en la imagen para ampliar
              </Typography>
            </Box>

            {/* INFORMACIÓN */}
            <Box>
              <Chip
                label={producto.categoria}
                size="small"
                color="primary"
                sx={{ mb: 2, textTransform: "capitalize" }}
              />

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {producto.nombre}
              </Typography>

              <Typography
                variant="h3"
                color="primary.main"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                ${producto.precio?.toLocaleString("es-AR") || "0"}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {producto.descripcion || "Sin descripción disponible"}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Stock disponible:{" "}
                  <Typography
                    component="span"
                    fontWeight="bold"
                    color={producto.stock > 10 ? "success.main" : "warning.main"}
                  >
                    {producto.stock} unidades
                  </Typography>
                </Typography>
              </Box>

              {/* Selector de cantidad */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Cantidad
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton
                    onClick={() => handleCantidadChange(-1)}
                    disabled={cantidad <= 1}
                    color="primary"
                    sx={{
                      border: "1px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <TextField
                    type="number"
                    value={cantidad}
                    onChange={handleCantidadInput}
                    inputProps={{
                      min: 1,
                      max: producto.stock,
                      style: { textAlign: "center" },
                    }}
                    sx={{ width: 80 }}
                  />

                  <IconButton
                    onClick={() => handleCantidadChange(1)}
                    disabled={cantidad >= producto.stock}
                    color="primary"
                    sx={{
                      border: "1px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Box>

              {/* Botón agregar al carrito */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <CartIcon />}
                onClick={handleAddToCart}
                disabled={addingToCart || producto.stock === 0}
                sx={{ py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
              >
                {addingToCart
                  ? "Agregando..."
                  : producto.stock === 0
                  ? "Sin stock"
                  : "Agregar al carrito"}
              </Button>

              {/* Información adicional */}
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ✓ Envío a Bahia Blanca y alrededores
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ✓ Devolucion o cambio en 7 dias
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog para imagen ampliada */}
      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        maxWidth="lg"
        fullWidth
      >
        <IconButton
          onClick={() => setOpenImage(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, bgcolor: "black" }}>
          <Box
            component="img"
            src={producto.imagen_url || "https://via.placeholder.com/800"}
            alt={producto.nombre}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}