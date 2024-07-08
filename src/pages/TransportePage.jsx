import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTransporte } from '../context/TransporteContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function TransportePage() {
  const { transporte, getTransporte, deleteTransporte } = useTransporte();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    getTransporte(currentPage); // Cargar la página actual al montar el componente
  }, [currentPage]); // Asegúrate de que se vuelva a cargar cuando cambia la página actual

  const goToNextPage = () => {
    if (transporte.hasNextPage) {
      setCurrentPage(transporte.nextPage); // Actualiza la página actual
    }
  };

  const goToPrevPage = () => {
    if (transporte.hasPrevPage) {
      setCurrentPage(transporte.prevPage); // Actualiza la página actual
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/transporte/generar-excel',
        { fechaInicio, fechaFin },
        { responseType: 'blob' } // Para manejar la descarga de archivos binarios
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transportes.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al exportar datos:', error);
    }
  };

  const handleDeleteTransporte = async (id) => {
    // Mostrar mensaje de confirmación
    const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar este servicio?`);
    if (!confirmDelete) {
      return; // Si el usuario cancela, no proceder con la eliminación
    }

    try {
      await deleteTransporte(id);
      // Después de eliminar, cargar nuevamente la página actual para actualizar la lista
      getTransporte(currentPage);
    } catch (error) {
      console.error('Error al eliminar transporte:', error);
    }
  };

  // Verificación inicial de transporte
  if (!transporte || !Array.isArray(transporte.docs)) {
    return <p>Cargando transportes...</p>; // O algún indicador de carga mientras se obtienen los datos
  }

  // Si no hay transportes
  if (transporte.docs.length === 0) {
    return (
      <h1 className="text-center text-2xl font-bold mt-8">
        No hay servicios registrados, ir a{' '}
        <Link
          to="/add-transporte"
          className="px-3 py-2 mt-8 bg-indigo-500 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
        >
          Registrar servicio
        </Link>
      </h1>
    );
  }

  // Verificar el rol del usuario antes de mostrar la tabla
  if (user.role !== 'admin') {
    navigate('/'); // Redirige al usuario a otra página si no tiene el rol adecuado
    return null; // Evita renderizar el resto del componente
  }

  return (
    <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg p-4">
      <div className="flex justify-start items-center mb-4 space-x-4">
        <div>
          <label className="text-gray-300 mr-2">Fecha Inicio:</label>
          <input
            type="date"
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-300 mr-2">Fecha Fin:</label>
          <input
            type="date"
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-600"
        >
          Excel
        </button>
      </div>

      {/* Línea delgada blanca */}
      <div className="my-4 border-t border-white"></div>

      {/* Tabla responsiva con scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 divide-y divide-gray-700 text-sm rounded-lg">
          <thead className="bg-zinc-700">
            <tr>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Fecha</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Cliente</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Partida</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Destino</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">G. Cliente</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Guia J</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Placa</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Conductor</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">T. Servicio</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Detalle</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">A. Devolucion</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">C. Devolucion</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Turno</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-indigo-600 bg-opacity-10 divide-y divide-white">
            {transporte.docs.map((transporte) => (
              <tr key={transporte._id}>
                <td className="text-left py-2 px-3 text-gray-300">
                  {new Date(transporte.fechat).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.cliente}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.puntoPartida}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.puntoDestino}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.guiaRemitente}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.guiaTransportista}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.placa}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.conductor}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.tipoServicio}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.detalle}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.almacenDev}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.comprobanteDev}</td>
                <td className="text-left py-2 px-3 text-gray-300">{transporte.turno}</td>
                <td className="text-left py-2 px-3 text-gray-300">
                  <Link
                    to={`/transporte/${transporte._id}`}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteTransporte(transporte._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-600 ml-2"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Línea delgada blanca */}
      <div className="my-4 border-t border-white"></div>

      {/* Botones de paginación */}
      <div className="flex justify-between mt-4 space-x-2">
        {transporte.hasPrevPage && (
          <button
            onClick={goToPrevPage}
            className="px-2 py-1 bg-blue-700 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-blue-600 mr-2"
          >
            Anterior
          </button>
        )}
        <span className="text-white">Página {currentPage}</span>
        {transporte.hasNextPage && (
          <button
            onClick={goToNextPage}
            className="px-2 py-1 bg-blue-700 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-blue-600"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export default TransportePage;
