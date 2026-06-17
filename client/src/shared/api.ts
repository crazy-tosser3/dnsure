import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const checkAdress = async () => {
  const res = await api.post('/', )
  
  return res.data
}