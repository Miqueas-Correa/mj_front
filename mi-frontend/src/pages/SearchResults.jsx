import { useParams } from "react-router-dom";
import { useProductos } from "../hooks/useProductos";
import ProductCard from "../components/ProductCard";
import { Grid } from "@mui/material";

export default function SearchResults() {
  const { query } = useParams();
  const { data, isLoading, isError, error } = useProductos(true, `/${query}`);

  if (isLoading) return <p>Cargando productos...</p>;
  if (!Array.isArray(data) || data.length === 0)
    return <p>No se encontraron productos para "{query}".</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {data.map((p) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
          <ProductCard producto={p} />
        </Grid>
      ))}
    </Grid>
  );
}