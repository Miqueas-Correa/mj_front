
function ProductCard({ producto }) {
  return (
    <article className="product">
      <img src={producto.img} alt={producto.nombre} />
      <div className="product-info">
        <h2>{producto.nombre}</h2>
        <p>{producto.descripcion}</p>
        <p>${producto.precio}</p>
      </div>
    </article>
  );
}

export default ProductCard;