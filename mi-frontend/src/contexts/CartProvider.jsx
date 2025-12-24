import { useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (producto, cantidad = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === producto.id);
      if (existing) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const updateQuantity = (id, cantidad) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}