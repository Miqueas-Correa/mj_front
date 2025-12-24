import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import {
  ShoppingBag as OrderIcon,
  ChevronRight as ArrowIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import client from "../services/client";

export default function Orders() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await client.get("/pedidos/me");

        // Ordenar por fecha más reciente primero
        const pedidosOrdenados = res.data.sort((a, b) =>
          new Date(b.fecha) - new Date(a.fecha)
        );

        setPedidos(pedidosOrdenados);
      } catch (err) {
        console.error("Error cargando pedidos:", err);

        if (err.response?.status === 400 && err.response?.data?.error?.includes("No se encontraron pedidos")) {
          setPedidos([]);
        } else {
          setError("Error al cargar los pedidos. Intenta nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const obtenerPrimerProducto = (detalles) => {
    if (!detalles || detalles.length === 0) return "Sin productos";

    const primerDetalle = detalles[0];
    const cantidad = primerDetalle.cantidad;
    const productoId = primerDetalle.producto_id;

    // Si hay más productos, agregar "..."
    const masProductos = detalles.length > 1 ? "..." : "";

    return `Producto #${productoId} (x${cantidad})${masProductos}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <ReceiptIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Mis Pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Historial de compras
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {pedidos.length === 0 ? (
        <Card sx={{ borderRadius: 3, boxShadow: 2, textAlign: "center", py: 6 }}>
          <OrderIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes pedidos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Cuando realices una compra, aparecerá aquí
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/")}
          >
            Ir a comprar
          </Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {pedidos.map((pedido) => (
            <Card
              key={pedido.id}
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                  {/* Información principal */}
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Pedido #{pedido.id}
                      </Typography>
                      <Chip
                        label={pedido.cerrado ? "Finalizado" : "En proceso"}
                        size="small"
                        color={pedido.cerrado ? "success" : "warning"}
                        sx={{ fontWeight: "bold" }}
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📅 {formatearFecha(pedido.fecha)}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 1,
                        fontStyle: "italic",
                      }}
                    >
                      {obtenerPrimerProducto(pedido.detalles)}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right", ml: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      ${pedido.total.toLocaleString("es-AR")}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate(`/pedido/${pedido.id}`)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Ver detalle del pedido
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button 
          variant="text" 
          onClick={() => navigate("/perfil")}
        >
          Volver al perfil
        </Button>
      </Box>
    </Box>
  );
}