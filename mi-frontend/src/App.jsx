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
// CATEGORIAS
import Category from "./pages/Categories";
// PRODUCTOS DETALLE
import ProductDetail from "./pages/ProductDetail";
// DESTACADO
import Destacado from "./components/destacado";
// BUSCADOR
import SearchResults from "./pages/SearchResults";
// CARRITO DE COMPRAS
import ShoppingCart from "./pages/ShoppingCart";
// PEDIDOS
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

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
          {/* CATEGORIAS */}
          <Route path="/categoria/:categoria" element={
            <Category />
          } />
          {/* PRODUCTOS DETALLE */}
          <Route path="/producto/:id" element={
            <ProductDetail />
          } />
          {/* DESTACADO */}
          <Route path="/destacado" element={
            <Destacado />
          } />
          {/* BUSCADOR */}
          <Route path="/buscar/:query" element={
            <SearchResults />
          } />
          {/* CARRITO DE COMPRAS */}
          <Route path="/carrito" element={
            <ShoppingCart />
          } />
          {/* REGISTRO DE PEDIDOS */}
          <Route path="/registro-pedidos" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          {/* DETALLE DE PEDIDO */}
          <Route path="/pedido/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
        </Routes>
        <ScrollTopButton/>
      </MainLayout>
    </>
  );
}

export default App;