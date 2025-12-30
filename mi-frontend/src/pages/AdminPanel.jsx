import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Collapse,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  People as UsersIcon,
  Inventory as ProductsIcon,
  Receipt as OrdersIcon,
  ExpandMore as ExpandIcon,
  ChevronRight as ChevronIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import adminClient from "../services/adminClient";

export default function AdminPanel() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    pedidosAbiertos: 0,
    pedidosCerrados: 0,
    totalUsuarios: 0,
    totalProductos: 0,
  });
  
  const [pedidosAbiertos, setPedidosAbiertos] = useState([]);
  const [pedidosCerrados, setPedidosCerrados] = useState([]);
  const [showAbiertos, setShowAbiertos] = useState(false);
  const [showCerrados, setShowCerrados] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const resPedidos = await adminClient.get("/admin/pedidos");
      const pedidos = resPedidos.data;

      const abiertos = pedidos.filter(p => !p.cerrado);
      const cerrados = pedidos.filter(p => p.cerrado);

      setPedidosAbiertos(abiertos);
      setPedidosCerrados(cerrados);

      let totalUsuarios = 0;
      try {
        const resUsuarios = await adminClient.get("/admin/usuarios");
        totalUsuarios = resUsuarios.data.length;
      } catch (err) {
        console.warn("No se pudieron cargar usuarios:", err);
      }

      let totalProductos = 0;
      try {
        const resProductos = await adminClient.get("/admin/productos");
        totalProductos = resProductos.data.length;
      } catch (err) {
        console.warn("No se pudieron cargar productos:", err);
      }

      setStats({
        pedidosAbiertos: abiertos.length,
        pedidosCerrados: cerrados.length,
        totalUsuarios,
        totalProductos,
      });

    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const total = stats.pedidosAbiertos + stats.pedidosCerrados;
  const porcentajeAbiertos = total > 0 ? ((stats.pedidosAbiertos / total) * 100).toFixed(0) : 0;
  const porcentajeCerrados = total > 0 ? ((stats.pedidosCerrados / total) * 100).toFixed(0) : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel de Administración
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Dashboard y gestión del sistema
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, border: "2px solid", borderColor: "primary.main" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Pedidos
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {total}
                  </Typography>
                </Box>
                <OrdersIcon sx={{ fontSize: 50, color: "primary.main", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, border: "2px solid", borderColor: "success.main" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Finalizados
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pedidosCerrados}
                  </Typography>
                </Box>
                <CheckIcon sx={{ fontSize: 50, color: "success.main", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, border: "2px solid", borderColor: "info.main" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Productos
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalProductos}
                  </Typography>
                </Box>
                <ProductsIcon sx={{ fontSize: 50, color: "info.main", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, border: "2px solid", borderColor: "warning.main" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    En Proceso
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pedidosAbiertos}
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 50, color: "warning.main", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfica simple de pedidos */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Estado de Pedidos
          </Typography>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Pedidos en Proceso</Typography>
                <Typography variant="body2" fontWeight="bold">{porcentajeAbiertos}%</Typography>
              </Stack>
              <Box sx={{ bgcolor: "grey.200", borderRadius: 1, height: 30, position: "relative", overflow: "hidden" }}>
                <Box
                  sx={{
                    bgcolor: "warning.main",
                    height: "100%",
                    width: `${porcentajeAbiertos}%`,
                    transition: "width 0.5s",
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Pedidos Finalizados</Typography>
                <Typography variant="body2" fontWeight="bold">{porcentajeCerrados}%</Typography>
              </Stack>
              <Box sx={{ bgcolor: "grey.200", borderRadius: 1, height: 30, position: "relative", overflow: "hidden" }}>
                <Box
                  sx={{
                    bgcolor: "success.main",
                    height: "100%",
                    width: `${porcentajeCerrados}%`,
                    transition: "width 0.5s",
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Sección de pedidos abiertos */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Button
            fullWidth
            onClick={() => setShowAbiertos(!showAbiertos)}
            endIcon={showAbiertos ? <ExpandIcon /> : <ChevronIcon />}
            sx={{ justifyContent: "space-between", textTransform: "none", p: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <ScheduleIcon color="warning" />
              <Typography variant="h6" fontWeight="bold">
                Pedidos en Proceso ({stats.pedidosAbiertos})
              </Typography>
            </Stack>
          </Button>

          <Collapse in={showAbiertos}>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2} sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
              {pedidosAbiertos.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  No hay pedidos en proceso
                </Typography>
              ) : (
                pedidosAbiertos.map((pedido) => (
                  <Card
                    key={pedido.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "grey.100" },
                      transition: "all 0.2s",
                    }}
                    onClick={() => navigate(`/pedido/${pedido.id}`)}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            Pedido #{pedido.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatearFecha(pedido.fecha)}
                          </Typography>
                        </Box>
                        <Stack alignItems="flex-end" spacing={1}>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            ${pedido.total.toLocaleString("es-AR")}
                          </Typography>
                          <Chip label="En proceso" size="small" color="warning" />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* Sección de pedidos cerrados */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <CardContent>
          <Button
            fullWidth
            onClick={() => setShowCerrados(!showCerrados)}
            endIcon={showCerrados ? <ExpandIcon /> : <ChevronIcon />}
            sx={{ justifyContent: "space-between", textTransform: "none", p: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <CheckIcon color="success" />
              <Typography variant="h6" fontWeight="bold">
                Pedidos Finalizados ({stats.pedidosCerrados})
              </Typography>
            </Stack>
          </Button>

          <Collapse in={showCerrados}>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2} sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
              {pedidosCerrados.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  No hay pedidos finalizados
                </Typography>
              ) : (
                pedidosCerrados.map((pedido) => (
                  <Card
                    key={pedido.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "grey.100" },
                      transition: "all 0.2s",
                    }}
                    onClick={() => navigate(`/pedido/${pedido.id}`)}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            Pedido #{pedido.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatearFecha(pedido.fecha)}
                          </Typography>
                        </Box>
                        <Stack alignItems="flex-end" spacing={1}>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            ${pedido.total.toLocaleString("es-AR")}
                          </Typography>
                          <Chip label="Finalizado" size="small" color="success" />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* Botones de gestión */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
            onClick={() => navigate("/admin/pedidos")}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <OrdersIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Gestión de Pedidos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver y administrar todos los pedidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
            onClick={() => navigate("/admin/usuarios")}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <UsersIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Gestión de Usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver y administrar usuarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
            onClick={() => navigate("/admin/productos")}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <ProductsIcon sx={{ fontSize: 60, color: "info.main", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Gestión de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver y administrar productos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}