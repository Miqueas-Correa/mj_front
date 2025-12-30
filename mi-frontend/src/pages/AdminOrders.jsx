import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography,
  Card, CardContent,
  Table, TableBody,
  TableCell, TableContainer,
  TableHead, TableRow,
  Paper, Chip,
  Button, TextField,
  Stack, CircularProgress,
  Alert, InputAdornment,
  IconButton, Dialog,
  DialogTitle, DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import adminClient from "../services/adminClient";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await adminClient.get("/admin/pedidos");
      const pedidosOrdenados = res.data.sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );
      setPedidos(pedidosOrdenados);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterPedidos = useCallback(() => {
    let filtered = [...pedidos];

    if (filterStatus === "abiertos") {
      filtered = filtered.filter(p => !p.cerrado);
    } else if (filterStatus === "cerrados") {
      filtered = filtered.filter(p => p.cerrado);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.id.toString().includes(searchTerm) ||
        p.id_usuario.toString().includes(searchTerm) ||
        p.total.toString().includes(searchTerm)
      );
    }

    setFilteredPedidos(filtered);
  }, [pedidos, searchTerm, filterStatus]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  useEffect(() => {
    filterPedidos();
  }, [filterPedidos]);

  // ✅ FUNCIÓN AGREGADA: Abrir el diálogo de confirmación
  const handleToggleStatus = (pedido) => {
    setSelectedPedido(pedido);
    setDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedPedido) return;

    setActionLoading(true);
    try {
      await adminClient.put(`/admin/pedidos/${selectedPedido.id}`, { 
        cerrado: !selectedPedido.cerrado 
      });
      
      setPedidos(prev => prev.map(p => 
        p.id === selectedPedido.id 
          ? { ...p, cerrado: !p.cerrado }
          : p
      ));

      setDialogOpen(false);
      setSelectedPedido(null);
    } catch (err) {
      console.error("Error actualizando pedido:", err);
      setError("Error al actualizar el estado del pedido.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
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

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate("/admin")}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Gestión de Pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra todos los pedidos del sistema
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar por ID de pedido, usuario o monto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant={filterStatus === "all" ? "contained" : "outlined"}
                onClick={() => setFilterStatus("all")}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "abiertos" ? "contained" : "outlined"}
                color="warning"
                onClick={() => setFilterStatus("abiertos")}
              >
                En Proceso
              </Button>
              <Button
                variant={filterStatus === "cerrados" ? "contained" : "outlined"}
                color="success"
                onClick={() => setFilterStatus("cerrados")}
              >
                Finalizados
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
          </Typography>
        </CardContent>
      </Card>

      {/* Tabla de pedidos */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Usuario ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Productos</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron pedidos
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPedidos.map((pedido) => (
                  <TableRow
                    key={pedido.id}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold">#{pedido.id}</Typography>
                    </TableCell>
                    <TableCell>Usuario #{pedido.id_usuario}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatearFecha(pedido.fecha)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary.main">
                        ${pedido.total.toLocaleString("es-AR")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${pedido.detalles?.length || 0} items`}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pedido.cerrado ? "Finalizado" : "En proceso"}
                        color={pedido.cerrado ? "success" : "warning"}
                        size="small"
                        icon={pedido.cerrado ? <CheckIcon /> : <CancelIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/admin/pedido/${pedido.id}`)}
                          title="Ver detalle"
                        >
                          <ViewIcon />
                        </IconButton>
                        <Button
                          size="small"
                          variant="outlined"
                          color={pedido.cerrado ? "warning" : "success"}
                          onClick={() => handleToggleStatus(pedido)}
                        >
                          {pedido.cerrado ? "Reabrir" : "Finalizar"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog de confirmación */}
      <Dialog open={dialogOpen} onClose={() => !actionLoading && setDialogOpen(false)}>
        <DialogTitle>
          Confirmar cambio de estado
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas {selectedPedido?.cerrado ? "reabrir" : "finalizar"} el pedido #{selectedPedido?.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={confirmToggleStatus}
            variant="contained"
            disabled={actionLoading}
            color={selectedPedido?.cerrado ? "warning" : "success"}
          >
            {actionLoading ? <CircularProgress size={20} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}