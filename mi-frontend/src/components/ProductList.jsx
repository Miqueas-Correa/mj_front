import { useProductos } from "../hooks/useProductos";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { data, isLoading, isError, error } = useProductos(undefined);

  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error al cargar: {error.message}</p>;
  if (!Array.isArray(data) || data.length === 0)return <p>No hay productos.</p>;

  return (
    <div className="product-grid">
      {data.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}