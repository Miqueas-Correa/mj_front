import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ marginTop: "10px" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;