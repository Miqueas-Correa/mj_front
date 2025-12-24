import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 600, p: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Perfil
          </Typography>

          {!user ? (
            <Stack spacing={2} mt={3}>
              <Typography textAlign="center">
                No has iniciado sesión. Inicia sesión o crea una cuenta.
              </Typography>

              <Button variant="contained" fullWidth onClick={() => navigate("/login")}>
                Iniciar sesión
              </Button>

              <Button variant="outlined" fullWidth onClick={() => navigate("/register")}>
                Crear cuenta
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Nombre</Typography>
                <Typography>{user.nombre ?? "Cargando..."}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                <Typography>{user.email ?? "Cargando..."}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Teléfono</Typography>
                <Typography>{user.telefono ?? "Cargando..."}</Typography>
              </Box>

              <Stack spacing={2} mt={2}>
                <Button variant="contained" onClick={() => navigate("/editar-perfil")}>
                  Editar perfil
                </Button>

                <Button variant="outlined" color="secondary" onClick={() => navigate("/registro-pedidos")}>
                  Registro de pedidos
                </Button>

                {user.rol === "admin" && (
                  <Button variant="outlined" color="secondary" onClick={() => navigate("/admin")}>
                    Panel de administración
                  </Button>
                )}

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