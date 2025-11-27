import client from "./client.js";

export async function getVisibleProducts(mostrar = true) {
  const res = await client.get(`/productos?mostrar=${mostrar}`);
  return res.data;
}