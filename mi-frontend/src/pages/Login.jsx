import { useState } from "react";
import { TextField, Button, Box, Typography, Stack } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, contrasenia);
      navigate("/perfil", { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2} textAlign="center">
        Iniciar Sesión
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            component={RouterLink}
            to="/register"
          >
            Crear cuenta
          </Button>
        </Stack>
      </form>
    </Box>
  );
}