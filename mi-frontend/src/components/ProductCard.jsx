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
        maxWidth: 220,
        height: 420, // altura fija para todas las tarjetas
        display: "flex",
        flexDirection: "column",
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
        height="80"
        image={producto.imagen_url || "https://via.placeholder.com/200"}
        alt={producto.nombre}
        sx={{ objectFit: "contain", p: 1, background: "primary.main" }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 1
          }}
        >
          {producto.nombre}
        </Typography>
        <Typography 
          variant="body2" 
          color="secondary.main" 
          sx={{ 
            height: 40, // altura fija
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // máximo 2 líneas
            WebkitBoxOrient: "vertical",
            mb: 1
          }}
        >
          {producto.descripcion}
        </Typography>
        <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold", mb: 1 }}>
          ${producto.precio ?? "0"}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {producto.categoria}
        </Typography>
        <Typography variant="body2">
          Stock: {producto.stock}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" variant="contained" fullWidth
          onClick={() => navigate(`/producto/${producto.id}`)}>
          VER
        </Button>
        <Button size="small" variant="outlined" fullWidth
          onClick={() => addToCart(producto)}>
          AÑADIR
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;