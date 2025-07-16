import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import toast from 'react-hot-toast';
import ServicioEditModal from '../components/ServicioEditModal.jsx'; // ✅ importar el modal

const ServiciosHistorialPage = () => {
  const { obtenerPorFecha, borrarServicio } = useServicios();

  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [servicioIdSeleccionado, setServicioIdSeleccionado] = useState(null);

  const cargarServicios = async (f) => {
    setLoading(true);
    try {
      const data = await obtenerPorFecha(f);

      const dataOrdenada = [...data].sort((a, b) => {
        const guiaA = a.numeroGuia?.toUpperCase() || '';
        const guiaB = b.numeroGuia?.toUpperCase() || '';
        return guiaA.localeCompare(guiaB, 'es', { numeric: true });
      });

      setServicios(dataOrdenada);
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
      <h1 className="text-2xl font-bold mb-6">Historial de Servicios</h1>

      <div className="mb-6">
        <label className="block mb-1 text-text-secondary text-sm">Seleccionar fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="input"
        />
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando servicios...</p>
      ) : servicios.length === 0 ? (
        <p className="text-text-secondary">No hay servicios para esta fecha.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="p-2 border-b text-center">Fecha Traslado</th>
                <th className="p-2 border-b text-center">Cliente</th>
                <th className="p-2 border-b text-center">Tipo de Carga</th>
                <th className="p-2 border-b text-center">Guía Transporte</th>
                <th className="p-2 border-b text-center">Guía Remitente</th>
                <th className="p-2 border-b text-center">Placa</th>
                <th className="p-2 border-b text-center">Conductor</th>
                <th className="p-2 border-b text-center">Contenedor</th>
                <th className="p-2 border-b text-center">Estado</th>
                <th className="p-2 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s._id} className="hover:bg-surface transition">
                  <td className="p-2 border-b text-center">{s.fechaTraslado?.slice(0, 10)}</td>
                  <td className="p-2 border-b text-center">{s.cliente}</td>
                  <td className="p-2 border-b text-center">{s.tipoCarga}</td>
                  <td className="p-2 border-b text-center">{s.numeroGuia}</td>
                  <td className="p-2 border-b text-center">{s.documentoRelacionado}</td>
                  <td className="p-2 border-b text-center">{s.placaVehiculoPrincipal}</td>
                  <td className="p-2 border-b text-center">{s.nombreConductor}</td>
                  <td className="p-2 border-b text-center">{s.numeroContenedor}</td>
                  <td className="p-2 border-b text-center">{s.estado}</td>
                  <td className="p-2 border-b text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          setServicioIdSeleccionado(s._id);
                          setShowModal(true);
                          console.log("Abriendo modal para:", s._id);
                        }}
                        className="btn btn-primary text-xs"
                      >
                        Editar
                      </button>
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
                        className="btn btn-danger text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      {showModal && servicioIdSeleccionado && (
        <ServicioEditModal
          id={servicioIdSeleccionado}
          onClose={() => {
            setShowModal(false);
            setServicioIdSeleccionado(null);
            cargarServicios(fecha); // recargar lista
          }}
        />
      )}
    </div>
  );
};

export default ServiciosHistorialPage;
