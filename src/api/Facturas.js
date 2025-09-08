import axios from './axios';

/**
 * Crear una factura desde:
 *  A) items detallados: [{ numeroGuia, monto }]
 *  B) modo compacto: numeroGuias: [...], montoPorServicio: number
 *
 * Ejemplos:
 *  createFactura({
 *    numero: 'FF10-500',
 *    cliente: 'Cliente XYZ',
 *    numeroGuias: ['G-001','G-002','G-003'],
 *    montoPorServicio: 500
 *  })
 *
 *  createFactura({
 *    numero: 'FF10-501',
 *    cliente: 'Cliente XYZ',
 *    items: [{ numeroGuia: 'G-010', monto: 300 }, { numeroGuia: 'G-011', monto: 700 }]
 *  })
 */
export const createFactura = async (payload) => {
  const res = await axios.post('facturas-transporte', payload);
  return res.data;
};

/**
 * Marcar factura como PAGADA por id o por número
 * pagarFactura('FF10-500', { fechaPago: '2025-08-21T15:00:00.000Z' })
 * pagarFactura('66c5e7c1a4b9f9f6a8c12345') // por ObjectId
 */
export const pagarFactura = async (idOrNumero, { fechaPago } = {}) => {
  const res = await axios.post(`facturas-transporte/${idOrNumero}/pagar`, { fechaPago });
  return res.data;
};

/**
 * Obtener una factura por id o por numero
 * getFactura('FF10-500')
 * getFactura('66c5e7c1a4b9f9f6a8c12345')
 */
export const getFactura = async (idOrNumero) => {
  const res = await axios.get(`facturas-transporte/${idOrNumero}`);
  return res.data;
};

/**
 * Listar facturas con filtros opcionales
 * listFacturas({ cliente: 'Cliente XYZ', estadoPago: 'PENDIENTE', desde: '2025-01-01', hasta: '2025-12-31' })
 */
export const listFacturas = async (params = {}) => {
  const res = await axios.get('facturas-transporte', { params });
  return res.data;
};

export const importarFacturasExcel = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const res = await axios.post('facturas-transporte/importar-excel', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
