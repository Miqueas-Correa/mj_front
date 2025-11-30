import { useQuery } from '@tanstack/react-query'
import client from '../services/client'

export const useProductos = (mostrar, pattern='') => {
  let pattern_mostrar = '';
  if (mostrar === true || mostrar === false) {
    pattern_mostrar = `?mostrar=${mostrar}`;
  }
  return useQuery({
    queryKey: ['productos', pattern, mostrar],
    queryFn: async () => {
      const url = `/productos${pattern}${pattern_mostrar}`;
      const { data } = await client.get(url);
      return data
    }
  })
}