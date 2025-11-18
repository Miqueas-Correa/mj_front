const API_URL = "https://mi-api.com";

export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
}
