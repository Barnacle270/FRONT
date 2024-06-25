import { useState, useEffect } from 'react';
import { useTransporte } from '../context/TransporteContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function TransportePage() {
  const { getTransporte, transporte } = useTransporte();
  const { user } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    getTransporte();
  }, []);

  if (transporte.length === 0) return (<h1 colSpan="2" className="text-center text-2xl font-bold mt-8">
    No hay servicios registrados, ir a{" "}
    <Link
      to={"/add-transporte"}
      className="px-3 py-2 mt-8 bg-indigo-500 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
    >
      Registrar servicio
    </Link>
  </h1>);

  //Verificar si el usuario es admin
  if (user.role !== 'admin') {
    navigate('/');
    return null; // Evitar que el resto del componente se renderice si el usuario no es admin
  }
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
      <table className="min-w-full bg-gray-800 divide-y divide-gray-700">
        <thead className="bg-zinc-700">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Fecha</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Cliente</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Punto Partida</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Punto Destino</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Guia Remitente</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Guia Transportista</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Placa</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Conductor</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Tipo Servicio</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Detalle</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Almacen Dev</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Comprobante Dev</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Estado</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Turno</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Planilla</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Combustible</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-200">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-700">
          {transporte.map((transporte) => (
            <tr key={transporte._id}>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.fecha}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.cliente}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.puntoPartida}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.puntoDestino}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.guiaRemitente}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.guiaTransportista}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.placa}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.conductor}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.tipoServicio}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.detalle}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.almacenDev}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.comprobanteDev}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.estado}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.turno}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.planilla}</td>
              <td className="text-left py-3 px-4 text-gray-300">{transporte.combustible}</td>
              <td className="text-left py-3 px-4">
                <Link
                  to={`/edit-transporte/${transporte._id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransportePage;
