import { useState } from "react";
import styles from "../styles/Header.module.css";
import Categories from "./Categories.jsx";

function Header() {
  const [openCategories, setOpenCategories] = useState(false);

  const toggleCategories = () => {
    setOpenCategories((prev) => !prev);
  };

  return (
    <>
      <header className={styles.header}>
        <h1>MJ STORE</h1>

        <div className={styles.search}>
          <input type="text" placeholder="Buscar..." />
          <button type="submit">Buscar</button>
        </div>

        <nav className={styles.nav}>
          <a href="/">Inicio</a>
          <a onClick={toggleCategories}>Categorías</a>
          <a href="/ofertas">Ofertas</a>
          <a href="/contacto">Contacto</a>
          <a href="/perfil">Perfil</a>
          <a href="/carrito">Carrito</a>
        </nav>
      </header>

      {openCategories && <Categories onClose={() => setOpenCategories(false)} />}
    </>
  );
}

export default Header;