import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";

function App() {
  return (
    <>
      {/* <ProductList /> */}
      <MainLayout>
        <Home />
        <ScrollTopButton/>
      </MainLayout>
    </>
  );
}

export default App;