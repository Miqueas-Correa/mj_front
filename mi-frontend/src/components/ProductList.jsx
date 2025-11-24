import { useFetch } from "../hooks/useFetch";

export default function ProductList() {
  // suponiendo que el endpoint para listar es /productos
  const { data, loading, error } = useFetch("/productos", []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar: {error.message || error.toString()}</p>;
  if (!Array.isArray(data)) return <p>No hay productos.</p>;

  return (
    <div className="product-grid">
      {data.map(p => (
        <article key={p.id} className="product">
          <img src={p.imagen_url || "https://via.placeholder.com/200"} alt={p.nombre} />
          <div className="product-info">
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p>${p.precio}</p>
          </div>
        </article>
      ))}
    </div>
  );
}