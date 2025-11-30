import Carousel from "../components/Carousel.jsx";
import Featured from "../components/Featured.jsx";

function Home() {

  return (
    <main>
      <h2>Productos Nuevos</h2>
      <Carousel/>
      <h2>Destacados</h2>
      <Featured/>
    </main>
  );
}

export default Home;