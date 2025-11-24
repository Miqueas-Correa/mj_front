import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Menu
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Categories from "../components/Categories.jsx";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCategoriesClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">MJ STORE</Typography>

          {/* BUSCADOR */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
              px: 1,
            }}
          >
            <InputBase placeholder="Buscar..." sx={{ ml: 1, flex: 1 }} />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Box>

          {/* NAV */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography component="a" href="/" sx={{ color: "white", cursor: "pointer", textDecoration: "none" }}>
              Inicio
            </Typography>

            <Typography
              onClick={handleCategoriesClick}
              sx={{ color: "white", cursor: "pointer" }}
            >
              Categorías
            </Typography>

            <Typography component="a" href="/ofertas" sx={{ color: "white", cursor: "pointer", textDecoration: "none" }}>
              Ofertas
            </Typography>
            <Typography component="a" href="#footer" sx={{ color: "white", cursor: "pointer", textDecoration: "none" }}>
              Contacto
            </Typography>
            <Typography component="a" href="/perfil" sx={{ color: "white", cursor: "pointer", textDecoration: "none" }}>
              Perfil
            </Typography>
            <Typography component="a" href="/carrito" sx={{ color: "white", cursor: "pointer", textDecoration: "none" }}>
              Carrito
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MENU DE CATEGORÍAS */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Categories.jsx se encarga SOLO del contenido */}
        <Categories onClose={handleClose} />
      </Menu>
    </>
  );
}