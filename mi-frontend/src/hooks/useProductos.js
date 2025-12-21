import { useEffect, useState } from "react";
import client from "../services/client";

export function useProductos(mostrar = true, extraRoute = "") {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProductos() {
      setIsLoading(true);
      setIsError(false);

      try {
        const url = `/productos${extraRoute}?mostrar=${mostrar}`;
        const res = await client.get(url);

        if (!isMounted) return;

        // si backend manda { productos: [...] }
        const productos = Array.isArray(res.data)
          ? res.data
          : res.data?.productos;

        setData(productos || []);
      } catch (err) {
        if (!isMounted) return;
        setIsError(true);
        setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProductos();

    return () => {
      isMounted = false;
    };
  }, [mostrar, extraRoute]);

  return { data, isLoading, isError, error };
}