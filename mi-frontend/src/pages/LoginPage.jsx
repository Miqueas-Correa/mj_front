import { useState } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, contrasenia);
      navigate("/profile"); // o donde quieras
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <Box maxWidth={420} mx="auto" p={2}>
      <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Contraseña" type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">Entrar</Button>
        </Stack>
      </form>
    </Box>
  );
}