import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  ArrowBack as BackIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
} from "@mui/icons-material";
import adminClient from "../services/adminClient";

export default function AdminUsers() {
  const navigate = useNavigate();
  
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await adminClient.get("/admin/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("Error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterUsuarios = useCallback(() => {
    let filtered = [...usuarios];

    if (filterRole !== "all") {
      filtered = filtered.filter(u => u.rol === filterRole);
    }

    if (filterStatus === "activos") {
      filtered = filtered.filter(u => u.activo === true);
    } else if (filterStatus === "inactivos") {
      filtered = filtered.filter(u => u.activo === false);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.id.toString().includes(term) ||
        u.nombre.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.telefono.includes(term)
      );
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  useEffect(() => {
    filterUsuarios();
  }, [filterUsuarios]);

  const handleOpenDialog = (usuario) => {
    setSelectedUser(usuario);
    setNewRole(usuario.rol);
    setNewStatus(usuario.activo);
    setDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    // Verificar si hay cambios
    const hasChanges = 
      newRole !== selectedUser.rol || 
      newStatus !== selectedUser.activo;

    if (!hasChanges) {
      setDialogOpen(false);
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const updates = {};
      if (newRole !== selectedUser.rol) updates.rol = newRole;
      if (newStatus !== selectedUser.activo) updates.activo = newStatus;

      await adminClient.put(`/admin/usuarios/${selectedUser.id}`, updates);

      // Actualizar el estado local
      setUsuarios(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { ...u, rol: newRole, activo: newStatus }
          : u
      ));

      const cambios = [];
      if (newRole !== selectedUser.rol) cambios.push(`rol a ${newRole}`);
      if (newStatus !== selectedUser.activo) cambios.push(`estado a ${newStatus ? 'activo' : 'inactivo'}`);

      setSuccess(`Usuario ${selectedUser.nombre} actualizado: ${cambios.join(', ')}`);
      setDialogOpen(false);
      setSelectedUser(null);
      
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      setError(err.response?.data?.error || "Error al actualizar el usuario.");
    } finally {
      setActionLoading(false);
    }
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
            Gestión de Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra los usuarios del sistema
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar por nombre, email o teléfono..."
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

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                variant={filterRole === "all" ? "contained" : "outlined"}
                onClick={() => setFilterRole("all")}
                size="small"
              >
                Todos
              </Button>
              <Button
                variant={filterRole === "admin" ? "contained" : "outlined"}
                color="error"
                onClick={() => setFilterRole("admin")}
                size="small"
              >
                Admins
              </Button>
              <Button
                variant={filterRole === "cliente" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setFilterRole("cliente")}
                size="small"
              >
                Clientes
              </Button>
              <Button
                variant={filterStatus === "all" ? "contained" : "outlined"}
                onClick={() => setFilterStatus("all")}
                size="small"
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "activos" ? "contained" : "outlined"}
                color="success"
                onClick={() => setFilterStatus("activos")}
                size="small"
              >
                Activos
              </Button>
              <Button
                variant={filterStatus === "inactivos" ? "contained" : "outlined"}
                color="warning"
                onClick={() => setFilterStatus("inactivos")}
                size="small"
              >
                Inactivos
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
          </Typography>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron usuarios
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <TableRow
                    key={usuario.id}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      transition: "background-color 0.2s",
                      opacity: usuario.activo ? 1 : 0.6,
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold">#{usuario.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {usuario.rol === "admin" ? (
                          <AdminIcon fontSize="small" color="error" />
                        ) : (
                          <UserIcon fontSize="small" color="primary" />
                        )}
                        <Typography>{usuario.nombre}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.telefono}</TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.rol}
                        color={usuario.rol === "admin" ? "error" : "primary"}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={usuario.activo ? <ActiveIcon /> : <BlockIcon />}
                        label={usuario.activo ? "Activo" : "Inactivo"}
                        color={usuario.activo ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(usuario)}
                          title="Editar usuario"
                        >
                          <EditIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog para editar usuario */}
      <Dialog open={dialogOpen} onClose={() => !actionLoading && setDialogOpen(false)}>
        <DialogTitle>
          Editar usuario
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Usuario: <strong>{selectedUser?.nombre}</strong>
          </Typography>

          <Stack spacing={3}>
            {/* Cambiar rol */}
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={newRole}
                label="Rol"
                onChange={(e) => setNewRole(e.target.value)}
                disabled={actionLoading}
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {/* Cambiar estado activo */}
            <FormControlLabel
              control={
                <Switch
                  checked={newStatus}
                  onChange={(e) => setNewStatus(e.target.checked)}
                  disabled={actionLoading}
                  color="success"
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>Estado:</Typography>
                  <Chip
                    label={newStatus ? "Activo" : "Inactivo"}
                    color={newStatus ? "success" : "warning"}
                    size="small"
                  />
                </Stack>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            disabled={
              actionLoading || 
              (newRole === selectedUser?.rol && newStatus === selectedUser?.activo)
            }
          >
            {actionLoading ? <CircularProgress size={20} /> : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}