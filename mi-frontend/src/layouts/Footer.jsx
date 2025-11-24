import { Box, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      id="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        textAlign: "center",
        p: 2,
      }}
    >
      <p>
        &copy; 2025 M.J-Tienda Online - Todos los derechos reservados - 
        Contactanos➡ WhatsApp: +54 9 291 406-3762 Instagram: {" "} 
        <Link href="https://www.instagram.com/__m.j__2024/" color="inherit">
          @__m.j__2024
        </Link> -{" "}
        <Link href="https://portafolio-web-miqueas.vercel.app/#inicio" color="inherit">
          Programador Correa Miqueas ✔
        </Link>
      </p>
    </Box>
  );
}