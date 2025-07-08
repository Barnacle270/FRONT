import axios from './axios';

// Crear cliente
export const crearCliente = async (cliente) => {
  const res = await axios.post('/clientes', cliente);
  return res.data;
};

// Listar todos los clientes
export const listarClientes = async () => {
  const res = await axios.get('/clientes');
  return res.data;
};

// Obtener un cliente por ID
export const obtenerClientePorId = async (id) => {
  const res = await axios.get(`/clientes/${id}`);
  return res.data;
};

// Editar cliente
export const actualizarCliente = async (id, data) => {
  const res = await axios.put(`/clientes/${id}`, data);
  return res.data;
};
