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
    return <p className="text-text-primary">Cargando transportes...</p>; // O algún indicador de carga mientras se obtienen los datos
  }

  // Si no hay transportes
  if (transporte.docs.length === 0) {
    return (
      <h1 className="text-center text-2xl font-bold mt-8 text-text-primary">
        No hay servicios registrados, ir a{' '}
        <Link
          to="/add-transporte"
          className="px-3 py-2 mt-8 bg-highlight text-black rounded-md hover:bg-focus focus:outline-none focus:bg-focus"
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
    <div className="overflow-x-auto bg-zinc-800 p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div>
            <label className="text-text-secondary mr-2">Fecha Inicio:</label>
            <input
              type="date"
              className="bg-input text-text-primary border border-gray-600 rounded px-2 py-1"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="text-text-secondary mr-2">Fecha Fin:</label>
            <input
              type="date"
              className="bg-input text-text-primary border border-gray-600 rounded px-2 py-1"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-button-primary text-text-primary rounded-md hover:bg-button-secondary focus:outline-none focus:bg-button-secondary"
          >
            Excel
          </button>
        </div>
        <button
          onClick={() => navigate('/add-transporte')}
          className="px-4 py-2 bg-button-primary text-text-primary rounded-md hover:bg-button-secondary focus:outline-none focus:bg-button-secondary"
        >
          Agregar servicio
        </button>
      </div>

      {/* Línea delgada blanca */}
      <div className="my-4 border-t border-text-primary"></div>

      {/* Tabla responsiva con scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-700 divide-y divide-gray-700 text-sm rounded-lg">
          <thead className="bg-zinc-700">
            <tr>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Fecha</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Cliente</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Partida</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Destino</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">G. Cliente</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Guia J</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Placa</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Conductor</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">T. Servicio</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Detalle</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Turno</th>
              <th className="text-left py-2 px-3 uppercase font-semibold text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-600 divide-y divide-gray-700">
            {transporte.docs.map((transporte) => (
              <tr key={transporte._id}>
                <td className="text-left py-2 px-3 text-text-primary">
                  {new Date(transporte.fechat).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.cliente}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.puntoPartida}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.puntoDestino}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.guiaRemitente}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.guiaTransportista}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.placa}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.conductor}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.tipoServicio}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.detalle}</td>
                <td className="text-left py-2 px-3 text-text-primary">{transporte.turno}</td>
                <td className="text-left py-2 px-3 text-text-primary">
                  <Link
                    to={`/transporte/${transporte._id}`}
                    className="inline-block p-2 bg-highlight text-white rounded-md hover:bg-focus focus:outline-none focus:bg-focus mb-1"
                  >
                    <i className="fas fa-edit text-sm"></i> {/* Icono de lápiz */}
                  </Link>
                  <button
                    onClick={() => handleDeleteTransporte(transporte._id)}
                    className="inline-block p-2 ml-2 bg-button-danger text-white rounded-md hover:bg-red-700 focus:outline-none focus:bg-button-danger"
                  >
                    <i className="fas fa-trash-alt"></i> {/* Icono de basura */}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPrevPage}
          disabled={!transporte.hasPrevPage}
          className="px-4 py-2 bg-button-primary text-text-primary rounded-md hover:bg-button-secondary focus:outline-none focus:bg-button-secondary disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-text-primary">Página {transporte.page} de {transporte.totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={!transporte.hasNextPage}
          className="px-4 py-2 bg-button-primary text-text-primary rounded-md hover:bg-button-secondary focus:outline-none focus:bg-button-secondary disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default TransportePage;
