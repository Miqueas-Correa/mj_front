import styles from "../styles/Categories.module.css";

const categories = [
  "Tecnología",
  "Ropa",
  "Hogar",
  "Deportes",
  "Juguetes",
  "Accesorios",
  "Electrodomésticos",
];

function Categories({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dropdown}
        onClick={(e) => e.stopPropagation()}  // evita que el click cierre el menú
      >
        <ul>
          {categories.map((cat) => (
            <li key={cat} onClick={() => alert(`Seleccionaste: ${cat}`)}>
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Categories;