import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import client from "../services/client";

export default function EditProfile() {
  const { user, logout, reloadUser } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario - inicializar con datos del usuario
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  // Estados para controlar qué campos se van a modificar
  const [fieldsToEdit, setFieldsToEdit] = useState({
    nombre: false,
    email: false,
    telefono: false,
    contrasenia: false,
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (field) => {
    setFieldsToEdit((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    // Limpiar errores del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Si desmarca contraseña, limpiar los campos
    if (field === "contrasenia" && fieldsToEdit.contrasenia) {
      setFormData((prev) => ({
        ...prev,
        contrasenia: "",
        confirmarContrasenia: "",
      }));
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validaciones del cliente
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre solo si está marcado para editar
    if (fieldsToEdit.nombre) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre no puede estar vacío";
      } else if (formData.nombre.trim().length < 2) {
        newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
      }
    }

    // Validar email solo si está marcado para editar
    if (fieldsToEdit.email) {
      if (!formData.email.trim()) {
        newErrors.email = "El email no puede estar vacío";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El email no es válido";
      }
    }

    // Validar teléfono solo si está marcado para editar
    if (fieldsToEdit.telefono) {
      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono no puede estar vacío";
      } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ""))) {
        newErrors.telefono = "El teléfono debe tener 10 dígitos (sin +54 9)";
      }
    }

    // Validar contraseña solo si está marcada para editar
    if (fieldsToEdit.contrasenia) {
      if (!formData.contrasenia) {
        newErrors.contrasenia = "Debes ingresar una nueva contraseña";
      } else if (formData.contrasenia.length < 6) {
        newErrors.contrasenia = "La contraseña debe tener al menos 6 caracteres";
      }

      if (formData.contrasenia !== formData.confirmarContrasenia) {
        newErrors.confirmarContrasenia = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obtener campos a enviar
  const getDataToSend = () => {
    const dataToSend = {};

    if (fieldsToEdit.nombre) {
      dataToSend.nombre = formData.nombre.trim();
    }

    if (fieldsToEdit.email) {
      dataToSend.email = formData.email.trim();
    }

    if (fieldsToEdit.telefono) {
      dataToSend.telefono = formData.telefono.trim();
    }

    if (fieldsToEdit.contrasenia) {
      dataToSend.contrasenia = formData.contrasenia;
    }

    return dataToSend;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setError("");
    setSuccess("");

    // Verificar si hay al menos un campo seleccionado
    const hasSelectedFields = Object.values(fieldsToEdit).some((value) => value);

    if (!hasSelectedFields) {
      setError("Debes seleccionar al menos un campo para modificar");
      return;
    }

    // Validar campos seleccionados
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Obtener solo los datos de los campos seleccionados
    const dataToSend = getDataToSend();

    try {
      await client.put("/usuarios/me", dataToSend);

      const fieldsCount = Object.keys(dataToSend).length;
      const fieldsNames = Object.keys(dataToSend).join(", ");

      if (reloadUser) {
        try {
          await reloadUser();
        } catch (reloadErr) {
          console.warn("No se pudo recargar el usuario:", reloadErr);
        }
      }

      // Esperar un tick para que React termine de procesar
      await new Promise(resolve => setTimeout(resolve, 0));

      setLoading(false);
      setSuccess(
        `¡Perfil actualizado exitosamente! Se ${
          fieldsCount === 1 ? "actualizó" : "actualizaron"
        } ${fieldsCount} campo(s): ${fieldsNames}`
      );

      // Redirigir después de mostrar el mensaje
      setTimeout(() => {
        navigate("/perfil", { replace: true });
      }, 1500);

    } catch (err) {
      setLoading(false);

      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      } else if (err.response?.status === 400) {
        // Error de validación del backend
        const errorMsg = err.response.data?.error || err.response.data?.message;
        setError(errorMsg || "Error de validación. Verifica los datos ingresados.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Error al actualizar el perfil. Intenta nuevamente.");
      }
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate("/perfil");
  };

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Card
        sx={{ width: "100%", maxWidth: 600, p: 2, borderRadius: 3, boxShadow: 3 }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Editar Perfil
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Selecciona los campos que deseas modificar
          </Typography>

          {/* Mensajes de éxito/error */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Campo Nombre */}
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fieldsToEdit.nombre}
                      onChange={() => handleCheckboxChange("nombre")}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Modificar nombre
                    </Typography>
                  }
                />
                <TextField
                  label="Nombre completo"
                  name="nombre"
                  fullWidth
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre || "Mínimo 2 caracteres"}
                  disabled={loading || !fieldsToEdit.nombre}
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Campo Email */}
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fieldsToEdit.email}
                      onChange={() => handleCheckboxChange("email")}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Modificar email
                    </Typography>
                  }
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email || "Debe ser un email válido"}
                  disabled={loading || !fieldsToEdit.email}
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Campo Teléfono */}
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fieldsToEdit.telefono}
                      onChange={() => handleCheckboxChange("telefono")}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Modificar teléfono
                    </Typography>
                  }
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  fullWidth
                  value={formData.telefono}
                  onChange={handleChange}
                  error={!!errors.telefono}
                  helperText={
                    errors.telefono || "10 dígitos sin +54 9 (Ej: 2911234567)"
                  }
                  disabled={loading || !fieldsToEdit.telefono}
                  inputProps={{ maxLength: 15 }}
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Campo Contraseña */}
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fieldsToEdit.contrasenia}
                      onChange={() => handleCheckboxChange("contrasenia")}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Cambiar contraseña
                    </Typography>
                  }
                />
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    label="Nueva contraseña"
                    name="contrasenia"
                    type="password"
                    fullWidth
                    value={formData.contrasenia}
                    onChange={handleChange}
                    error={!!errors.contrasenia}
                    helperText={errors.contrasenia || "Mínimo 6 caracteres"}
                    disabled={loading || !fieldsToEdit.contrasenia}
                  />

                  <TextField
                    label="Confirmar nueva contraseña"
                    name="confirmarContrasenia"
                    type="password"
                    fullWidth
                    value={formData.confirmarContrasenia}
                    onChange={handleChange}
                    error={!!errors.confirmarContrasenia}
                    helperText={
                      errors.confirmarContrasenia || "Repite la contraseña"
                    }
                    disabled={loading || !fieldsToEdit.contrasenia}
                  />
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}