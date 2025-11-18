import styles from "../styles/Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <h1>Mi Tienda</h1>
      <nav className={styles.nav}>
        <a href="/">Inicio</a>
        <a href="/categorias">Categorías</a>
        <a href="/productos">Productos</a>
        <a href="/usuarios">Usuarios</a>
        <a href="/pedidos">Pedidos</a>
      </nav>
    </header>
  );
}

export default Header;