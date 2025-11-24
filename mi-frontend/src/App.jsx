import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout.jsx";
import ProductList from "./components/ProductList.jsx";

function App() {
  return (
    <>
      <MainLayout>
        <Home />
      </MainLayout>
    </>
  );
}

export default App;