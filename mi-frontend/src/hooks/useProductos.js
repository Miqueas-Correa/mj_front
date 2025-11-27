import { useQuery } from '@tanstack/react-query'
import client from '../services/client'

export const useProductos = (mostrar) => {
  let pattern = '';
  if (mostrar === true || mostrar === false) {
    pattern = `?mostrar=${mostrar}`;
  }
  return useQuery({
    queryKey: ['productos', mostrar],
    queryFn: async () => {
      const { data } = await client.get(`/productos${pattern}`)
      return data
    }
  })
}