import { Box, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        textAlign: "center",
        p: 2,
      }}
    >
      <p>
        &copy; 2025 M.J-Tienda Online - Todos los derechos reservados -{" "}
        <Link href="https://portafolio-web-miqueas.vercel.app/#inicio" color="inherit">
          Programador Correa Miqueas ✔
        </Link>
      </p>
    </Box>
  );
}