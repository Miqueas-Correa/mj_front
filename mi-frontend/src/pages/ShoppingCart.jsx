import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import client from "../services/client";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";

export default function ShoppingCart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (cart.length === 0) {
    return <Typography variant="h6">Tu carrito está vacío</Typography>;
  }

  const total = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const handleConfirmarCompra = async () => {
    if (!user) {
      setError("Debes iniciar sesión para confirmar la compra");
      return;
    }

    try {
      const productos = cart.map((p) => ({
        producto_id: p.id,
        cantidad: p.cantidad,
      }));

      await client.post("/pedidos", { productos });

      setSuccess("Pedido creado exitosamente 🎉");
      clearCart();
    } catch (err) {
      setError("Error al confirmar la compra. Intenta nuevamente.", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de compras
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {cart.map((p) => (
        <Box
          key={p.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
          }}
        >
          <Typography>{p.nombre}</Typography>
          <TextField
            type="number"
            value={p.cantidad}
            onChange={(e) => updateQuantity(p.id, Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ width: 80 }}
          />
          <Typography>
            ${(p.precio * p.cantidad).toLocaleString("es-AR")}
          </Typography>
          <IconButton onClick={() => removeFromCart(p.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Typography variant="h5" sx={{ mt: 3 }}>
        Total: ${total.toLocaleString("es-AR")}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleConfirmarCompra}
      >
        Confirmar compra
      </Button>
    </Box>
  );
}