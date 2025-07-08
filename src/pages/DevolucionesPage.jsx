import { useEffect } from 'react';
import { useServicios } from '../context/ServicioContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const DevolucionesPage = () => {
  const { pendientes, cargarPendientes, marcarDevuelto } = useServicios();

  useEffect(() => {
    cargarPendientes();
  }, []);

  const handleMarcarDevuelto = async (id) => {
    const confirmar = confirm(
      '¿Estás seguro de marcar este contenedor como devuelto? Una vez registrado desaparecerá de la lista.'
    );
    if (!confirmar) return;

    try {
      await marcarDevuelto(id);
      toast.success('Contenedor marcado como devuelto');
    } catch (error) {
      toast.error('Error al marcar como devuelto');
    }
  };

  const calcularDiasFaltantes = (vencimiento) => {
    if (!vencimiento) return '—';
    const hoy = new Date();
    const fin = new Date(vencimiento);
    const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `${diff} día(s)` : `VENCIDO`;
  };

  return (
    <div className="p-6 text-text-primary bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Devoluciones Pendientes</h1>

      {pendientes.length === 0 ? (
        <p className="text-text-secondary">No hay servicios pendientes por devolver.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="p-2 border-b text-center">Cliente</th>
                <th className="p-2 border-b text-center">Contenedor</th>
                <th className="p-2 border-b text-center">Almacén de D.</th>
                <th className="p-2 border-b text-center">F. Vencimiento</th>
                <th className="p-2 border-b text-center">Faltan</th>
                <th className="p-2 border-b text-center">Placa D.</th>
                <th className="p-2 border-b text-center">Conductor D.</th>
                <th className="p-2 border-b text-center">Fecha Devolución</th>
                <th className="p-2 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((s) => {
                const dias = calcularDiasFaltantes(s.vencimientoMemo);
                const esVencido = dias === 'VENCIDO';

                return (
                  <tr key={s._id} className="hover:bg-surface transition">
                    <td className="p-2 border-b text-center">{s.cliente}</td>
                    <td className="p-2 border-b text-center">{s.numeroContenedor}</td>
                    <td className="p-2 border-b text-center">{s.terminalDevolucion || '—'}</td>
                    <td className="p-2 border-b text-center">{s.vencimientoMemo?.slice(0, 10) || '—'}</td>
                    <td className={`p-2 border-b text-center font-semibold ${esVencido ? 'text-red-500' : 'text-text-primary'}`}>
                      {dias}
                    </td>
                    <td className="p-2 border-b text-center">{s.placaDevolucion || '—'}</td>
                    <td className="p-2 border-b text-center">{s.conductorDevolucion || '—'}</td>
                    <td className="p-2 border-b text-center">{s.fechaDevolucion?.slice(0, 10) || '—'}</td>
                    <td className="p-2 border-b text-center flex flex-col gap-2">
                      <Link
                        to={`/servicios/editar/${s._id}`}
                        className="btn btn-primary text-xs"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleMarcarDevuelto(s._id)}
                        className="btn btn-success text-xs"
                      >
                        Devolver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DevolucionesPage;
