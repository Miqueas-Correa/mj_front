import { MenuItem } from "@mui/material";

export default function Categories({ onClose }) {
  return (
    <>
      <MenuItem onClick={onClose}>Tecnología</MenuItem>
      <MenuItem onClick={onClose}>Ropa</MenuItem>
      <MenuItem onClick={onClose}>Hogar</MenuItem>
      <MenuItem onClick={onClose}>Calzado</MenuItem>
      <MenuItem onClick={onClose}>Accesorios</MenuItem>
    </>
  );
}