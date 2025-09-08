import { useEffect, useState } from 'react';
import { useServicios } from '../context/ServicioContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ServicioEditModal from '../components/ServicioEditModal.jsx';
import { HiPencil, HiBan, HiTrash } from 'react-icons/hi';

const ServiciosHistorialPage = () => {
  const { obtenerPorFecha, borrarServicio, anular } = useServicios();
  const { user } = useAuth();

  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [servicioIdSeleccionado, setServicioIdSeleccionado] = useState(null);

  console.log(servicios)

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

  const handleAnular = async (id) => {
    const confirmar = confirm('¿Estás seguro de ANULAR este servicio?');
    if (!confirmar) return;
    try {
      await anular(id);
      await cargarServicios(fecha);
      toast.success('Servicio anulado correctamente');
    } catch (error) {
      toast.error('Error al anular el servicio');
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.');
    if (!confirmar) return;
    try {
      await borrarServicio(id);
      await cargarServicios(fecha);
      toast.success('Servicio eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el servicio');
    }
  };

  return (
    <div className="p-6 text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historial de Servicios</h1>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="bg-background border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-text-secondary">Cargando servicios...</p>
      ) : servicios.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay servicios para esta fecha.</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-navbar text-text-secondary">
              <tr>
                <th className="p-2 text-center">Fecha Traslado</th>
                <th className="p-2 text-center">Cliente</th>
                <th className="p-2 text-center">Tipo de Carga</th>
                <th className="p-2 text-center">Guía Transporte</th>
                <th className="p-2 text-center">Guía Remitente</th>
                <th className="p-2 text-center">Placa</th>
                <th className="p-2 text-center">Conductor</th>
                <th className="p-2 text-center">Contenedor</th>
                <th className="p-2 text-center">Estado</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s._id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                  <td className="p-2 text-center">{s.fechaTraslado?.slice(0, 10)}</td>
                  <td className="p-2 text-center">{s.cliente}</td>
                  <td className="p-2 text-center">{s.tipoCarga}</td>
                  <td className="p-2 text-center">{s.numeroGuia}</td>
                  <td className="p-2 text-center">{s.documentoRelacionado}</td>
                  <td className="p-2 text-center">{s.placaVehiculoPrincipal}</td>
                  <td className="p-2 text-center">{s.nombreConductor}</td>
                  <td className="p-2 text-center">{s.numeroContenedor}</td>
                  <td className="p-2 text-center">{s.estado}</td>
                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setServicioIdSeleccionado(s._id);
                          setShowModal(true);
                        }}
                        className="bg-highlight text-white p-2 rounded hover:brightness-110"
                        title="Editar"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>

                      {(user?.role === 'Superadministrador' || user?.role === 'Administrador') && (
                        <button
                          onClick={() => handleAnular(s._id)}
                          className="bg-yellow-500 text-white p-2 rounded hover:brightness-110"
                          title="Anular"
                        >
                          <HiBan className="w-4 h-4" />
                        </button>
                      )}

                      {user?.role === 'Superadministrador' && (
                        <button
                          onClick={() => handleEliminar(s._id)}
                          className="bg-button-danger text-white p-2 rounded hover:brightness-110"
                          title="Eliminar"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && servicioIdSeleccionado && (
        <ServicioEditModal
          id={servicioIdSeleccionado}
          onClose={() => {
            setShowModal(false);
            setServicioIdSeleccionado(null);
            cargarServicios(fecha);
          }}
        />
      )}
    </div>
  );
};

export default ServiciosHistorialPage;
