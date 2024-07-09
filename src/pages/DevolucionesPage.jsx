import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTransporte } from '../context/TransporteContext';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function DevolucionesPage() {
  const { devoluciones, getDevoluciones } = useTransporte();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDevoluciones(); // Cargar la página actual al montar el componente
  }, []); // Asegúrate de que se vuelva a cargar cuando cambia la página actual

  // Verificar el rol del usuario antes de mostrar la tabla
  if (user.role !== 'admin') {
    navigate('/'); // Redirige al usuario a otra página si no tiene el rol adecuado
    return null; // Evita renderizar el resto del componente
  }

  // Verificación inicial de transporte
  if (!devoluciones || !Array.isArray(devoluciones)) {
    return <p className="text-text-primary">Cargando transportes...</p>; // O algún indicador de carga mientras se obtienen los datos
  }

  // Si no hay transportes
  if (devoluciones.length === 0) {
    return (
      <h1 className="text-center text-2xl font-bold mt-8 text-text-primary">
        No hay devoluciones Pendientes registradas, ir a{' '}
        <Link
          to="/add-transporte"
          className="px-3 py-2 mt-8 bg-highlight text-black rounded-md hover:bg-focus focus:outline-none focus:bg-focus"
        >
          Registrar servicio
        </Link>
      </h1>
    );
  }

  return (
    <div className="overflow-x-auto bg-zinc-800 p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
        </div>
      </div>

      {/* Línea delgada blanca */}
      <div className="my-4 border-t border-text-primary"></div>

      {/* Tabla responsiva con scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-700 divide-y divide-gray-700 text-sm rounded-lg">
          <thead className="bg-zinc-700">
            <tr>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Fecha S.</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Fecha V.</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Cliente</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">N° Contenedor</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Almacen D.</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">EIR</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Fecha D.</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Conductor</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Placa</th>

              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-600 divide-y divide-gray-700">
            {devoluciones.map((devolucion) => (
              <tr
                key={devolucion._id}
                className="transition-colors hover:bg-zinc-500"
              >
                {/* usando dayjs */}
                <td className="text-left py-2 px-3 text-text-primary">
                  {dayjs(devolucion.fechat).format('DD/MM/YYYY')}
                </td>
                <td className="text-left py-2 px-3 text-text-primary">
                  {dayjs(devolucion.fechaVen).format('DD/MM/YYYY')}
                </td>

                <td className="text-left py-2 px-3 text-text-primary">{devolucion.cliente}</td>
                <td className="text-left py-2 px-3 text-text-primary">{devolucion.detalle}</td>
                <td className="text-left py-2 px-3 text-text-primary">{devolucion.almacenDev}</td>
                <td className="text-left py-2 px-3 text-text-primary">{devolucion.comprobanteDev}</td>
                <td className="text-left py-2 px-3 text-text-primary">
                  {dayjs(devolucion.fechaDev).format('DD/MM/YYYY')}
                </td>
                <td className="text-left py-2 px-3 text-text-primary">{devolucion.conductorDev}</td>
                <td className="text-left py-2 px-3 text-text-primary">{devolucion.placaDev}</td>
                <td className="text-left py-2 px-3 text-text-primary">
                  <Link
                    to={`/contenedores/${devolucion._id}`}
                    className="inline-block p-2 bg-highlight text-white rounded-md hover:bg-focus focus:outline-none focus:bg-focus mb-1"
                  >
                    <i className="fas fa-edit text-sm"></i> {/* Icono de lápiz */}
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DevolucionesPage;
