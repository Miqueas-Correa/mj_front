import Carousel from "../components/Carousel.jsx";
import Products from "../components/Products.jsx";

function Home() {

  return (
    <main>
      <h2>Productos Nuevos</h2>
      <Carousel/>
      <h2>Todo</h2>
      <Products/>
    </main>
  );
}

export default Home;