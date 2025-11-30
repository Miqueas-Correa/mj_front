// import useState from "react";
// import { useApiMutation } from "../hooks/useApiMutation";

// export default function ProductForm({ onCreated }) {
//   const [form, setForm] = useState({ nombre: "", precio: 0, stock: 0, categoria: "", descripcion: "" });
//   const { call, loading, error } = useApiMutation();

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await call({ method: "post", url: "/productos", data: form });
//       setForm({ nombre: "", precio: 0, stock: 0, categoria: "", descripcion: "" });
//       if (onCreated) onCreated();
//     } catch (err) {
//       // error está en hook
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={submit}>
//       <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
//       <input name="precio" type="number" value={form.precio} onChange={handleChange} required />
//       <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
//       <input name="categoria" value={form.categoria} onChange={handleChange} />
//       <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
//       <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Crear"}</button>
//       {error && <p>Error: {error.message || error.toString()}</p>}
//     </form>
//   );
// }