import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  if (!producto) return null;
  return (
    <Card
      sx={{
        maxWidth: 250,
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 8,
          transform: "scale(1.02)"
        }
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={producto.imagen_url || "https://via.placeholder.com/200"}
        alt={producto.nombre}
        sx={{ objectFit: "contain", p: 1, background: "primary.main" }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="secondary.main" sx={{ minHeight: 48 }}>
          {producto.descripcion}
        </Typography>
        <Typography variant="h6" color="primary.main" sx={{ mt: 1, fontWeight: "bold" }}>
          ${producto.precio ?? "0"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {producto.categoria}
        </Typography>
        <Typography variant="body2">
          Stock: {producto.stock}
        </Typography>

        <CardActions>
          <Button size="small" variant="contained" fullWidth
            onClick={() => navigate(`/producto/${producto.id}`)}>
            Ver
          </Button>
          <Button size="small" variant="outlined" fullWidth
            onClick={() => addToCart(producto)}>
            Añadir
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default ProductCard;