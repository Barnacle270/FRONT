import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ServiciosHistorialPage = () => {
  const { obtenerPorFecha, borrarServicio } = useServicios();

  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarServicios = async (f) => {
    setLoading(true);
    try {
      const data = await obtenerPorFecha(f);
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios por fecha:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarServicios(fecha);
  }, [fecha]);

  return (
    <div className="p-6 text-text-primary bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Historial de Servicios</h1>

      <div className="mb-4">
        <label className="block mb-1 text-text-secondary">Seleccionar fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="bg-input text-text-primary border border-gray-600 px-3 py-2 rounded"
        />
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando servicios...</p>
      ) : servicios.length === 0 ? (
        <p className="text-text-secondary">No hay servicios para esta fecha.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface text-text-secondary uppercase">
              <tr>
                <th className="p-2 border-b text-center">FECHA TRASLADO</th>
                <th className="p-2 border-b text-center">CLIENTE</th>
                <th className="p-2 border-b text-center">TIPO DE CARGA</th>
                <th className="p-2 border-b text-center">GUÍA TRANSPORTE</th>
                <th className="p-2 border-b text-center">GUÍA REMITENTE</th>
                <th className="p-2 border-b text-center">PLACA</th>
                <th className="p-2 border-b text-center">CONDUCTOR</th>
                <th className="p-2 border-b text-center">CONTENEDOR</th>
                <th className="p-2 border-b text-center">ESTADO</th>
                <th className="p-2 border-b text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s._id} className="hover:bg-surface transition">
                  <td className="p-2 border-b text-center align-middle">{s.fechaTraslado?.slice(0, 10)}</td>
                  <td className="p-2 border-b text-center align-middle">{s.cliente}</td>
                  <td className="p-2 border-b text-center align-middle">{s.tipoCarga}</td>
                  <td className="p-2 border-b text-center align-middle">{s.numeroGuia}</td>
                  <td className="p-2 border-b text-center align-middle">{s.documentoRelacionado}</td>
                  <td className="p-2 border-b text-center align-middle">{s.placaVehiculoPrincipal}</td>
                  <td className="p-2 border-b text-center align-middle">{s.nombreConductor}</td>
                  <td className="p-2 border-b text-center align-middle">{s.numeroContenedor}</td>
                  <td className="p-2 border-b text-center align-middle">{s.estado}</td>
                  <td className="p-2 border-b text-center align-middle">
                    <Link
                      to={`/servicios/editar/${s._id}`}
                      className="text-sm text-blue-500 hover:underline mr-2"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={async () => {
                        const confirmar = confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.');
                        if (!confirmar) return;
                        try {
                          await borrarServicio(s._id);
                          await cargarServicios(fecha);
                          toast.success('Servicio eliminado correctamente');
                        } catch (error) {
                          toast.error('Error al eliminar el servicio');
                        }
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
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

export default ServiciosHistorialPage;
