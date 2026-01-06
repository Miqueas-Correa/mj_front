import { useProductos } from "../hooks/useProductos";
import ProductCard from "./ProductCard";
import { Grid } from "@mui/material";

export default function Carousel() {
  const { data, isLoading, isError, error } = useProductos(true, "");

  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  if (!Array.isArray(data) || data.length === 0)
    return <p>No hay productos.</p>;

 // el id lo pongo porque react lo necesitas
  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {data.map((p) => (
        <Grid key={p.id}>
          <ProductCard key={p.id} producto={p} />
        </Grid>
      ))}
    </Grid>
  );
}