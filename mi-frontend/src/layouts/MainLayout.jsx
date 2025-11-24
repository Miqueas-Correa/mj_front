import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ marginTop: "80px" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;