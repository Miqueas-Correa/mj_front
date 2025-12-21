import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import ScrollTopButton from "./components/ScrollTopButton";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
// APARTADO PARA PERFIL
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
// PILITICA DE DATOS
import Politica from "./pages/PoliticaDatos";

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* APARTADO PARA PERFIL */}
          <Route
            path="/perfil"
            element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route
            path="/editar-perfil"
            element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          {/* POLITICA DE DATOS */}
          <Route path="/politica" element={
            <PublicRoute>
              <Politica />
            </PublicRoute>
          } />
        </Routes>
        <ScrollTopButton/>
      </MainLayout>
    </>
  );
}

export default App;