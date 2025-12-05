import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { useAuth } from "../hooks/useAuth.js"; // hook de autenticación

export default function Profile() {
  const { user, logout } = useAuth();
  // user = { nombre, email, telefono } o null

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 480, p: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Perfil
          </Typography>

          {/* SI NO HAY USUARIO */}
          {!user && (
            <Stack spacing={2} mt={3}>
              <Typography textAlign="center">
                No has iniciado sesión.
              </Typography>

              <Button variant="contained" color="primary" fullWidth href="/login">
                Iniciar sesión
              </Button>

              <Button variant="outlined" color="primary" fullWidth href="/register">
                Crear cuenta
              </Button>
            </Stack>
          )}

          {/* SI HAY USUARIO */}
          {user && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Nombre
                </Typography>
                <Typography>{user.nombre}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Email
                </Typography>
                <Typography>{user.email}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Teléfono
                </Typography>
                <Typography>{user.telefono ?? "No cargado"}</Typography>
              </Box>

              <Stack spacing={2} mt={2}>
                <Button variant="contained" fullWidth href="/editar-perfil">
                  Editar perfil
                </Button>

                <Button variant="outlined" color="error" fullWidth onClick={logout}>
                  Cerrar sesión
                </Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}