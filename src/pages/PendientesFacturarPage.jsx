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

  const getEstadoClass = (estado) => {
    if (!estado) return 'text-text-secondary';
    const normalized = estado.toLowerCase();
    if (normalized.includes('pendiente')) return 'text-yellow-400 drop-shadow-[0_0_6px_#facc15] font-bold';
    if (normalized.includes('facturado')) return 'text-green-400 drop-shadow-[0_0_6px_#4ade80] font-bold';
    if (normalized.includes('observado')) return 'text-red-500 drop-shadow-[0_0_6px_#f87171] font-bold';
    return 'text-text-primary';
  };

  return (
    <div className="p-6 text-text-primary">
      <h1 className="text-2xl font-bold mb-6 drop-shadow-[0_0_6px_#3B82F6]">
        Pendientes de Facturar
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span className="ml-2 text-text-secondary">Cargando servicios pendientes...</span>
        </div>
      ) : pendientes.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay servicios pendientes de facturar.</p>
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="hidden md:block overflow-x-auto bg-surface rounded shadow-md">
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
                    <td className={`p-2 text-center ${getEstadoClass(servicio.estadoFacturacion)}`}>
                      {servicio.estadoFacturacion || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="block md:hidden space-y-4">
            {pendientes.map((servicio) => (
              <div key={servicio._id} className="bg-surface p-4 rounded shadow-md">
                <p><strong>Guía:</strong> {servicio.numeroGuia}</p>
                <p><strong>Cliente:</strong> {servicio.cliente}</p>
                <p><strong>Fecha Traslado:</strong> {servicio.fechaTraslado?.slice(0, 10)}</p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={getEstadoClass(servicio.estadoFacturacion)}>
                    {servicio.estadoFacturacion || '—'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PendientesFacturarPage;
