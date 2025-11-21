import { useRef } from "react";
import ProductCard from "./ProductCard";
import styles from "../styles/carrusel.module.css";

function Carrusel({ productos }) {
  const carruselRef = useRef(); // Referencia al contenedor del carrusel

  const scroll = (direction) => {
    const amount = 260;  // Ancho aproximado de una tarjeta de producto más margen
    carruselRef.current.scrollBy({
      left: amount * direction,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.holder}>
      <button onClick={() => scroll(-1)} className="btn-prev">←</button>
      <button onClick={() => scroll(1)} className="btn-next">→</button>

      <section className="carrusel" ref={carruselRef}>
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </section>
    </div>
  );
}

export default Carrusel;