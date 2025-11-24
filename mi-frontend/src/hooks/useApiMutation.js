import { useState } from "react";
import client from "../api/client";

export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = async ({ method = "post", url, data = {}, config = {} }) => {
    setLoading(true); setError(null);
    try {
      const res = await client.request({ method, url, data, ...config });
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { call, loading, error };
}