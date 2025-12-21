import { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Link,
} from "@mui/material";
import client from "../services/client";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasenia: "",
    telefono: "",
    acepta_uso_datos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN DEL CHECKBOX
    if (!form.acepta_uso_datos) {
      alert("Debes aceptar el uso de datos para continuar.");
      return;
    }

    try {
      const { data } = await client.post("/usuarios", form);

      alert(data.mensaje || "Cuenta creada con éxito");

      // REDIRIGE A INICIAR SESIÓN
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.error || "Error al crear la cuenta");
    }
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Crear cuenta
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre completo"
          name="nombre"
          fullWidth
          margin="normal"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          required
        />

        <TextField
          label="Contraseña"
          name="contrasenia"
          type="password"
          fullWidth
          margin="normal"
          value={form.contrasenia}
          onChange={handleChange}
          required
        />

        <TextField
          label="Teléfono"
          name="telefono"
          fullWidth
          margin="normal"
          value={form.telefono}
          onChange={handleChange}
          required
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.acepta_uso_datos}
              onChange={handleChange}
              name="acepta_uso_datos"
            />
          }
          label={
            <Typography component="span">
              Acepto el uso de mis datos para comunicación con la tienda.{" "}
              <Link
                component={RouterLink}
                to="/politica"
                color="primary"
                onClick={(e) => e.stopPropagation()}
              >
                Más información
              </Link>
            </Typography>
          }
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Crear cuenta
        </Button>
      </form>
    </Box>
  );
}