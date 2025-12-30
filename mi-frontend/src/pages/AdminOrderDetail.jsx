import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import adminClient from "../services/adminClient";
import client from "../services/client";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedidoYProductos = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ Usar la ruta de admin para obtener cualquier pedido
        const resPedido = await adminClient.get(`/admin/pedidos/${id}`);
        
        // La respuesta es un array, tomar el primer elemento
        const pedidoData = Array.isArray(resPedido.data) 
          ? resPedido.data[0] 
          : resPedido.data;

        if (!pedidoData) {
          setError("Pedido no encontrado");
          return;
        }

        setPedido(pedidoData);

        // ✅ Obtener información del usuario que hizo el pedido
        try {
          const resUsuario = await adminClient.get(`/admin/usuarios/${pedidoData.id_usuario}`);
          setUsuario(resUsuario.data);
        } catch (err) {
          console.error("Error cargando usuario:", err);
          setUsuario({ nombre: `Usuario #${pedidoData.id_usuario}` });
        }

        // Obtener información de los productos
        const productosPromises = pedidoData.detalles.map(async (detalle) => {
          try {
            const resProducto = await client.get(`/productos/${detalle.producto_id}`);
            const productoData = Array.isArray(resProducto.data) 
              ? resProducto.data[0] 
              : resProducto.data;

            return {
              ...detalle,
              producto: productoData,
            };
          } catch (err) {
            console.error(`Error cargando producto ${detalle.producto_id}:`, err);
            return {
              ...detalle,
              producto: {
                id: detalle.producto_id,
                nombre: `Producto #${detalle.producto_id}`,
                precio: detalle.subtotal / detalle.cantidad,
              },
            };
          }
        });

        const productosConInfo = await Promise.all(productosPromises);
        setProductos(productosConInfo);

      } catch (err) {
        console.error("Error cargando pedido:", err);
        setError(err.response?.data?.error || "Error al cargar el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPedidoYProductos();
    }
  }, [id]);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !pedido) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "No se pudo cargar el pedido"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/pedidos")}
        >
          Volver a gestión de pedidos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      {/* Botón volver */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/pedidos")}
        sx={{ mb: 3 }}
      >
        Volver a gestión de pedidos
      </Button>

      {/* Información del pedido */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="start" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Pedido #{pedido.id}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                {pedido.cerrado ? (
                  <>
                    <CheckIcon color="success" />
                    <Chip
                      label="Finalizado"
                      color="success"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </>
                ) : (
                  <>
                    <ScheduleIcon color="warning" />
                    <Chip
                      label="En proceso"
                      color="warning"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </>
                )}
              </Stack>
              {/* ✅ Información del cliente */}
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Cliente:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {usuario?.nombre || `Usuario #${pedido.id_usuario}`}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" color="text.secondary">
                Fecha del pedido
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatearFecha(pedido.fecha)}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Tabla de productos */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Productos
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "grey.200" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Cantidad</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Precio Unit.</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {item.producto?.imagen_url && (
                          <Box
                            component="img"
                            src={item.producto.imagen_url}
                            alt={item.producto.nombre}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.300",
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {item.producto?.nombre || `Producto #${item.producto_id}`}
                          </Typography>
                          {item.producto?.categoria && (
                            <Typography variant="caption" color="text.secondary">
                              {item.producto.categoria}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={`x${item.cantidad}`} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      ${item.producto?.precio?.toLocaleString("es-AR") || 
                        (item.subtotal / item.cantidad).toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        ${item.subtotal.toLocaleString("es-AR")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Resumen de totales */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ minWidth: 300 }}>
              <Stack spacing={2}>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" color="text.secondary">
                    Subtotal ({productos.length} {productos.length === 1 ? "producto" : "productos"})
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${pedido.total.toLocaleString("es-AR")}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    ${pedido.total.toLocaleString("es-AR")}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Información adicional del usuario */}
      {usuario && (
        <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: "grey.50", mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Información del Cliente
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>ID:</strong> #{usuario.id}
              </Typography>
              <Typography variant="body2">
                <strong>Nombre:</strong> {usuario.nombre}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {usuario.email}
              </Typography>
              <Typography variant="body2">
                <strong>Teléfono:</strong> {usuario.telefono}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: "info.50" }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            🛡️ <strong>Panel de Administración:</strong> Tienes acceso completo a este pedido.
            Puedes cambiar su estado desde la gestión de pedidos.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}