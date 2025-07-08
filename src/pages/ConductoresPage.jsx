import { useConductores } from '../context/ConductorContext';
import { Link } from 'react-router-dom';

function ConductoresPage() {
  const { conductores } = useConductores();

  return (
    <div className="max-w-4xl mx-auto mt-10 card">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">📋 Lista de Conductores</h1>
        <Link to="/crear-conductor" className="btn btn-primary">
          ➕ Nuevo Conductor
        </Link>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Nombres</th>
            <th className="px-4 py-2 text-left">Licencia</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((conductor) => (
            <tr key={conductor._id} className="border-t">
              <td className="px-4 py-2">{conductor.nombres}</td>
              <td className="px-4 py-2">{conductor.licencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConductoresPage;
