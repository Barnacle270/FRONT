import { useEffect, useState } from 'react';
import { useReportes } from '../context/ReportesContext';

const PendientesFacturarPage = () => {
  const { cargarPendientesFacturar } = useReportes();
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendientes = async () => {
      setLoading(true);
      const data = await cargarPendientesFacturar();
      setPendientes(data);
      setLoading(false);
    };

    fetchPendientes();
  }, []);

  return (
    <div className="p-6 text-text-primary">
      <h1 className="text-2xl font-bold mb-6">Pendientes de Facturar</h1>

      {loading ? (
        <p className="text-text-secondary">Cargando servicios pendientes...</p>
      ) : pendientes.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay servicios pendientes de facturar.</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-navbar text-text-secondary">
              <tr>
                <th className="p-2 text-center">Guía</th>
                <th className="p-2 text-center">Cliente</th>
                <th className="p-2 text-center">Fecha Traslado</th>
                <th className="p-2 text-center">Estado Facturación</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((servicio) => (
                <tr
                  key={servicio._id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="p-2 text-center">{servicio.numeroGuia}</td>
                  <td className="p-2 text-center">{servicio.cliente}</td>
                  <td className="p-2 text-center">{servicio.fechaTraslado?.slice(0, 10)}</td>
                  <td className="p-2 text-center">
                    {servicio.estadoFacturacion || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendientesFacturarPage;
