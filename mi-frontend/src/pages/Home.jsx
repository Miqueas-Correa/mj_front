import Carrusel from "../components/Carrusel.jsx";

function Home() {
  const productos = [
    { id: 1, nombre: "Remera MJ", precio: 3500, img: "/img/remera1.jpg" },
    { id: 2, nombre: "Gorra MJ", precio: 2500, img: "/img/gorra1.jpg" }
  ];

  return (
    <main>
      <h2>Productos Destacados</h2>
      <Carrusel productos={productos} />
    </main>
  );
}

export default Home;