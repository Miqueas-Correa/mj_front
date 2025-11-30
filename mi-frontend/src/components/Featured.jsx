import { useProductos } from "../hooks/useProductos";
import ProductCard from "./ProductCard";
import { Grid } from "@mui/material";

export default function Featured() {
  const { data, isLoading, isError, error } = useProductos(true, "/destacado");

  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  if (!Array.isArray(data) || data.length === 0)
    return <p>No hay productos.</p>;

 // el id lo pongo porque react lo necesitas
  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {data.map((p) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
          <ProductCard key={p.id} producto={p} />
        </Grid>
      ))}
    </Grid>
  );
}