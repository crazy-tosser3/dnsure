import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAgents = async () => {
  const res = await api.get('/get_agents');
  
  return res.data;
}

export const checkAdress = async (host_to_check:string, check_type:{get:boolean, ping:boolean, tcp:boolean, traceroute:boolean, lookup:boolean}, agents_location:string) => {
  const res = await api.post('/start_check', { host_to_check, check_type, agents_location });
  
  return res.data;
}