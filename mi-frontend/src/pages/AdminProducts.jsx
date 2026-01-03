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
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import adminClient from "../services/adminClient";

export default function AdminProducts() {
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagen_url: "",
    mostrar: true,
    destacado: false,
  });

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await adminClient.get("/admin/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("Error al cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterProductos = useCallback(() => {
    let filtered = [...productos];

    // Filtrar por visibilidad
    if (filterVisibility === "visible") {
      filtered = filtered.filter(p => p.mostrar === true);
    } else if (filterVisibility === "oculto") {
      filtered = filtered.filter(p => p.mostrar === false);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term) ||
        p.id.toString().includes(term)
      );
    }
    
    setFilteredProductos(filtered);
  }, [productos, searchTerm, filterVisibility]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    filterProductos();
  }, [filterProductos]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar los 5MB");
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    return `${cleanName}_${timestamp}_${random}.${extension}`;
  };

  const uploadImage = async (file) => {
    const uniqueFilename = generateUniqueFilename(file.name);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('filename', uniqueFilename);

    try {
      const response = await adminClient.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      throw new Error(err.response?.data?.error || "Error al subir la imagen");
    }
  };

  const handleOpenDialog = (mode, product = null) => {
    setDialogMode(mode);
    setSelectedProduct(product);
    setSelectedFile(null);
    setImagePreview("");
    
    if (mode === "edit" && product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        categoria: product.categoria,
        imagen_url: product.imagen_url || "",
        mostrar: product.mostrar,
        destacado: product.destacado,
      });
      setImagePreview(product.imagen_url || "");
    } else if (mode === "create") {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagen_url: "",
        mostrar: true,
        destacado: false,
      });
    }
    
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setSelectedFile(null);
    setImagePreview("");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError("El stock debe ser mayor o igual a 0");
      return false;
    }
    if (!formData.categoria.trim()) {
      setError("La categoría es obligatoria");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!validateForm()) return;

    setActionLoading(true);

    try {
      let imagenUrl = formData.imagen_url;

      // Si hay un archivo seleccionado, subirlo primero
      if (selectedFile) {
        imagenUrl = await uploadImage(selectedFile);
      }

      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        imagen_url: imagenUrl,
      };

      if (dialogMode === "create") {
        await adminClient.post("/admin/productos", dataToSend);
        setSuccess("Producto creado exitosamente");
      } else if (dialogMode === "edit") {
        await adminClient.put(`/admin/productos/${selectedProduct.id}`, dataToSend);
        setSuccess("Producto actualizado exitosamente");
      }

      fetchProductos();
      handleCloseDialog();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error guardando producto:", err);
      setError(err.response?.data?.error || "Error al guardar el producto.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setActionLoading(true);
    setError("");

    try {
      await adminClient.delete(`/admin/productos/${selectedProduct.id}`);
      
      setSuccess("Producto eliminado exitosamente");
      fetchProductos();
      handleCloseDialog();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      setError(err.response?.data?.error || "Error al eliminar el producto.");
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate("/admin")}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Gestión de Productos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra el catálogo de productos
            </Typography>
          </Box>
        </Stack>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
        >
          Nuevo Producto
        </Button>
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
              placeholder="Buscar por nombre, categoría o ID..."
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
                variant={filterVisibility === "all" ? "contained" : "outlined"}
                onClick={() => setFilterVisibility("all")}
                size="small"
              >
                Todos
              </Button>
              <Button
                variant={filterVisibility === "visible" ? "contained" : "outlined"}
                color="success"
                onClick={() => setFilterVisibility("visible")}
                size="small"
              >
                Visibles
              </Button>
              <Button
                variant={filterVisibility === "oculto" ? "contained" : "outlined"}
                color="warning"
                onClick={() => setFilterVisibility("oculto")}
                size="small"
              >
                Ocultos
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Mostrando {filteredProductos.length} de {productos.length} productos
          </Typography>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron productos
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProductos.map((producto) => (
                  <TableRow
                    key={producto.id}
                    sx={{
                      "&:hover": { bgcolor: "grey.50" },
                      transition: "background-color 0.2s",
                      opacity: producto.mostrar ? 1 : 0.6,
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold">#{producto.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {producto.imagen_url ? (
                          <Box
                            component="img"
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.300",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "grey.200",
                              borderRadius: 1,
                            }}
                          >
                            <ImageIcon color="disabled" />
                          </Box>
                        )}
                        <Box>
                          <Typography fontWeight="medium">{producto.nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {producto.descripcion?.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={producto.categoria} 
                        size="small" 
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary.main">
                        ${producto.precio.toLocaleString("es-AR")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={producto.stock}
                        size="small"
                        color={producto.stock > 10 ? "success" : producto.stock > 0 ? "warning" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip
                          label={producto.mostrar ? "Visible" : "Oculto"}
                          size="small"
                          color={producto.mostrar ? "success" : "default"}
                          icon={producto.mostrar ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        />
                        {producto.destacado && (
                          <Chip label="Destacado" size="small" color="warning" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog("edit", producto)}
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDialog("delete", producto)}
                          title="Eliminar"
                        >
                          <DeleteIcon />
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

      {/* Dialog para crear/editar */}
      <Dialog 
        open={dialogOpen && (dialogMode === "create" || dialogMode === "edit")} 
        onClose={() => !actionLoading && handleCloseDialog()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create" ? "Crear Nuevo Producto" : "Editar Producto"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={actionLoading}
            />
            
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              disabled={actionLoading}
            />
            
            <Stack direction="row" spacing={2}>
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={formData.precio}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={actionLoading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={actionLoading}
              />
            </Stack>
            
            <TextField
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={actionLoading}
            />
            
            {/* Subida de imagen */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Imagen del producto
                </Typography>
                
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      mb: 2,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "grey.300",
                    }}
                  />
                )}
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  disabled={actionLoading}
                >
                  {selectedFile ? "Cambiar imagen" : "Subir imagen"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                
                {selectedFile && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Archivo seleccionado: {selectedFile.name}
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.mostrar}
                    onChange={handleInputChange}
                    name="mostrar"
                    disabled={actionLoading}
                  />
                }
                label="Visible en la tienda"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.destacado}
                    onChange={handleInputChange}
                    name="destacado"
                    disabled={actionLoading}
                  />
                }
                label="Producto destacado"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : dialogMode === "create" ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para eliminar */}
      <Dialog 
        open={dialogOpen && dialogMode === "delete"} 
        onClose={() => !actionLoading && handleCloseDialog()}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el producto <strong>{selectedProduct?.nombre}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteProduct}
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}