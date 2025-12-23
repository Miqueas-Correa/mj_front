// import { useState } from "react";
// import { Box, TextField, Button, Typography, Stack } from "@mui/material";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const [nombre, setNombre] = useState("");
//   const [email, setEmail] = useState("");
//   const [contrasenia, setContrasenia] = useState("");
//   const [telefono, setTelefono] = useState("");
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await register({ nombre, email, contrasenia, telefono });
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.error || "Error al registrarse");
//     }
//   };

//   return (
//     <Box maxWidth={420} mx="auto" p={2}>
//       <Typography variant="h5" mb={2}>Crear cuenta</Typography>
//       <form onSubmit={handleSubmit}>
//         <Stack spacing={2}>
//           <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
//           <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
//           <TextField label="Contraseña" type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} />
//           {error && <Typography color="error">{error}</Typography>}
//           <Button type="submit" variant="contained">Crear cuenta</Button>
//         </Stack>
//       </form>
//     </Box>
//   );
// }