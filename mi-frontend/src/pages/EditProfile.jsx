import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import client from "../services/client";

export default function EditProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  const [fieldsToEdit, setFieldsToEdit] = useState({
    nombre: false,
    email: false,
    telefono: false,
    contrasenia: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
        contrasenia: "",
        confirmarContrasenia: "",
      });
    }
  }, [user]);

  const handleCheckboxChange = (field) => {
    setFieldsToEdit((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (field === "contrasenia" && fieldsToEdit.contrasenia) {
      setFormData((prev) => ({
        ...prev,
        contrasenia: "",
        confirmarContrasenia: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (fieldsToEdit.nombre) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre no puede estar vacío";
      } else if (formData.nombre.trim().length < 2) {
        newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
      }
    }

    if (fieldsToEdit.email) {
      if (!formData.email.trim()) {
        newErrors.email = "El email no puede estar vacío";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El email no es válido";
      }
    }

    if (fieldsToEdit.telefono) {
      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono no puede estar vacío";
      } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ""))) {
        newErrors.telefono = "El teléfono debe tener 10 dígitos (sin +54 9)";
      }
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const hasSelectedFields = Object.values(fieldsToEdit).some((value) => value);

    if (!hasSelectedFields) {
      setError("Debes seleccionar al menos un campo para modificar");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = getDataToSend();

      await client.put("/usuarios/me", dataToSend);

      const fieldsCount = Object.keys(dataToSend).length;
      const fieldsNames = Object.keys(dataToSend).join(", ");

      setSuccess(
        `¡Perfil actualizado exitosamente! Se ${
          fieldsCount === 1 ? "actualizó" : "actualizaron"
        } ${fieldsCount} campo(s): ${fieldsNames}`
      );

      // Redirigir al perfil después de 1.5 segundos
      setTimeout(() => {
        navigate("/perfil", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      } else {
        setError("Error al actualizar el perfil. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                  sx={{ position: "relative" }}
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          left: "50%",
                          marginLeft: "-12px",
                        }}
                      />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
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