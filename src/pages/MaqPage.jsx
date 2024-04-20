
import { useState, useEffect } from 'react';
import { useMaq } from "../context/MaqContext";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MaqPage() {
  const { getMaqs, maqs } = useMaq();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredMaqs, setFilteredMaqs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    getMaqs();
  }, []);

  const handleFilter = () => {
    const filteredMaqs = maqs.filter((maq) => {
      const maqDate = new Date(maq.fecha);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return maqDate >= startDateObj && maqDate <= endDateObj;
    });

    setFilteredMaqs(filteredMaqs);
  };

  if (maqs.length === 0) return (<h1 colSpan="2" className="text-center text-2xl font-bold mt-8">
    No hay servicios registrados, ir a{" "}
    <Link
      to={"/add-maq"}
      className="px-3 py-2 mt-8 bg-indigo-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
    >
      Registrar servicio
    </Link>
  </h1>);


  //Verificar si el usuario es admin
  if (user.role !== 'operador') {
    navigate('/');
    return null; // Evitar que el resto del componente se renderice si el usuario no es admin
  }

  return (
    <div className="mt-4">
      <div className="flex justify-center space-x-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
        />
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-indigo-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Filtrar
        </button>

        <Link to={"/add-maq"} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600">
          Agregar Vale
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse bg-zinc-800 rounded-lg text-center">
          <thead>
            <tr className="rounded-lg bg-white text-black">
              <th className="px-4 py-2">CT</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Total horas</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaqs.length > 0 ? (
              filteredMaqs.map((maq) => (
                <tr key={maq._id} >
                  <td className="px-4 py-2">{maq.numeroControl}</td>
                  <td className="px-4 py-2">{maq.fecha}</td>
                  <td className="px-4 py-2">{maq.cliente}</td>
                  <td className="px-4 py-2">{maq.inicio}</td>
                  <td className="px-4 py-2">{maq.fin}</td>
                  <td className="px-4 py-2">{maq.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay ningún dato en este rango</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MaqPage;
