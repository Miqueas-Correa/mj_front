import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Categories from "./Categories";

export default function Navbar() {
  const isMobile = useMediaQuery("(max-width:900px)");

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [categoriesAnchor, setCategoriesAnchor] = useState(null);

  const openMenu = Boolean(menuAnchor);
  const openCategories = Boolean(categoriesAnchor);

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleCategoriesOpen = (e) => setCategoriesAnchor(e.currentTarget);
  const handleCategoriesClose = () => setCategoriesAnchor(null);

  const items = [
    { label: "Inicio", to: "/" },
    { label: "Categorías", action: handleCategoriesOpen },
    { label: "Destacado", to: "/destacado" },
    { label: "Contacto", to: "#footer" },
    { label: "Perfil", to: "/perfil" },
    { label: "Carrito", to: "/carrito" },
  ];

//   DESKTOP
  if (!isMobile) {
    return (
      <>
        <Box sx={{ display: "flex", gap: 2 }}>
          {items.map((item) =>
            item.to ? (
              <Button
                key={item.label}
                color="inherit"
                component={RouterLink}
                to={item.to}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                color="inherit"
                onClick={item.action}
              >
                {item.label}
              </Button>
            )
          )}
        </Box>

        {/* MENU CATEGORÍAS */}
        <Menu
          anchorEl={categoriesAnchor}
          open={openCategories}
          onClose={handleCategoriesClose}
        >
          <Categories onClose={handleCategoriesClose} />
        </Menu>
      </>
    );
  }

//   MOBILE
  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>

      <Menu anchorEl={menuAnchor} open={openMenu} onClose={handleMenuClose}>
        {items.map((item) =>
          item.to ? (
            <MenuItem
              key={item.label}
              component={RouterLink}
              to={item.to}
              onClick={handleMenuClose}
            >
              {item.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={item.label}
              onClick={(e) => {
                handleMenuClose();
                handleCategoriesOpen(e);
              }}
            >
              {item.label}
            </MenuItem>
          )
        )}
      </Menu>

      {/* MENU CATEGORÍAS MOBILE */}
      <Menu
        anchorEl={categoriesAnchor}
        open={openCategories}
        onClose={handleCategoriesClose}
      >
        <Categories onClose={handleCategoriesClose} />
      </Menu>
    </>
  );
}