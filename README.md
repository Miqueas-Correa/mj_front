# MJ Frontend

Frontend moderno desarrollado en React + Vite, diseñado para una plataforma web con autenticación, rutas protegidas, gestión de productos, carrito de compras y panel de administración.
El proyecto está optimizado para rendimiento, escalabilidad y buenas prácticas de desarrollo frontend.

## Tecnologías Utilizadas

React 18

Vite

JavaScript

React Router DOM

Axios

ESLint

CSS / Theme personalizado

## Arquitectura por componentes

📁 Estructura del Proyecto

- mi-frontend/
- │
- ├── public/
- │   └── vite.svg
- │
- ├── src/
- │   ├── assets/
- │   │   ├── icons/
- │   │   │   └── logo_mj.png
- │   │   └── react.svg
- │   │
- │   ├── components/
- │   │   ├── Carrusel.jsx
- │   │   ├── Categories.jsx
- │   │   ├── Destacado.jsx
- │   │   ├── Navbar.jsx
- │   │   ├── ProductCard.jsx
- │   │   ├── ProductFrom.jsx
- │   │   ├── Products.jsx
- │   │   └── ScrollTopButton.jsx
- │   │
- │   ├── contexts/
- │   │   ├── AuthContext.js
- │   │   ├── AuthProvider.jsx
- │   │   ├── CartContext.jsx
- │   │   └── CartProvider.jsx
- │   │
- │   ├── hooks/
- │   │   ├── useAuth.js
- │   │   ├── useCart.js
- │   │   └── useProduct.js
- │   │
- │   ├── layouts/
- │   │   ├── Footer.jsx
- │   │   ├── Header.jsx
- │   │   └── MainLayout.jsx
- │   │
- │   ├── pages/
- │   │   ├── AdminOrderDetail.jsx
- │   │   ├── AdminOrders.jsx
- │   │   ├── AdminPanel.jsx
- │   │   ├── AdminProducts.jsx
- │   │   ├── AdminUsers.jsx
- │   │   ├── Categories.jsx
- │   │   ├── EditProfile.jsx
- │   │   ├── Home.jsx
- │   │   ├── Login.jsx
- │   │   ├── OrderDetail.jsx
- │   │   ├── Orders.jsx
- │   │   ├── PoliticaDatos.jsx
- │   │   ├── ProductDetail.jsx
- │   │   ├── Profile.jsx
- │   │   ├── Register.jsx
- │   │   ├── RegisterPage.jsx
- │   │   ├── SearchResults.jsx
- │   │   └── ShoppingCart.jsx
- │   │
- │   ├── routes/
- │   │   ├── AdminRoute.jsx
- │   │   ├── ProtectedRoute.jsx
- │   │   └── PublicRoute.jsx
- │   │
- │   ├── services/
- │   │   ├── client.js
- │   │   └── adminClient.js
- │   │
- │   ├── utils/
- │   │   └── theme.js
- │   │
- │   ├── App.jsx
- │   └── main.jsx
- │
- ├── index.html
- ├── package.json
- ├── package-lock.json
- ├── vite.config.js
- ├── eslint.config.js
- └── README.md

## Instalación y Ejecución
1️⃣ Clonar el repositorio
git clone https://github.com/Miqueas-Correa/mj_front.git
cd mi-frontend

2️⃣ Instalar dependencias
npm install

Variable de entorno:
VITE_API_BASE_URL=mjapi-production.up.railway.app

3️⃣ Ejecutar en entorno de desarrollo
npm run dev


La aplicación estará disponible en:

https://mj-front-ehdtra4z0-miqueas-correas-projects.vercel.app

🔐 Sistema de Rutas

El proyecto implementa protección de rutas por rol y autenticación:

PublicRoute → Acceso libre

ProtectedRoute → Requiere usuario autenticado

AdminRoute → Requiere permisos de administrador

Esto permite un control seguro del acceso a vistas sensibles.

🛒 Funcionalidades Principales

Registro e inicio de sesión de usuarios

Perfil de usuario

Búsqueda de productos

Vista de detalle de producto

Carrito de compras

Protección de rutas

Cliente HTTP separado para:

Usuario

Administrador

Tema visual centralizado

Arquitectura escalable

## Comunicación con Backend

La comunicación con la API se maneja mediante Axios, separando responsabilidades:

client.js → Peticiones de usuario

adminClient.js → Peticiones administrativas

Esto facilita:

Mantenimiento

Seguridad

Escalabilidad

## Estilos y Tema

El proyecto cuenta con un sistema de tema centralizado ubicado en:

src/utils/theme.js


Permite modificar colores, tipografías y estilos globales desde un solo lugar.

## Calidad de Código

ESLint configurado

Componentes desacoplados

Separación clara de responsabilidades

Código legible y mantenible

📦 Build para Producción
npm run build


Los archivos optimizados se generarán en la carpeta:

dist/

📄 Requisitos

Node.js v18 o superior

NPM v9 o superior

## Autor

Miqueas Correa
Frontend Developer
📍 Bahía Blanca, Buenos Aires, Argentina

GitHub: Miqueas-Correa

LinkedIn: miqueas-correa

📌 Notas Finales

- Este frontend está preparado para integrarse con un backend REST, escalar funcionalidades y adaptarse tanto a desktop como a mobile.

- V1: Primera verción del front-end, aun tiene mucho margen de mejora.