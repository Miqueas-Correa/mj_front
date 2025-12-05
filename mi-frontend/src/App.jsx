import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* APARTADO PARA PERFIL */}
          <Route path="/perfil" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ScrollTopButton/>
      </MainLayout>
    </>
  );
}

export default App;