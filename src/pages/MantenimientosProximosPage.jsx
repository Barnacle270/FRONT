import { useEffect } from 'react';
import { useMantenimiento } from '../context/MantenimientoContext';

const MantenimientosProximosPage = () => {
  const {
    mantenimientosProximos,
    cargarMantenimientosProximos
  } = useMantenimiento();

  useEffect(() => {
    cargarMantenimientosProximos();
  }, []);

  return (
    <div className="p-6 text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Mantenimientos Próximos y Vencidos</h1>

      {mantenimientosProximos.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay mantenimientos próximos.</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded shadow-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-navbar text-text-secondary">
              <tr>
                <th className="p-2 text-left">Maquinaria</th>
                <th className="p-2 text-left">Mantenimiento</th>
                <th className="p-2 text-center">Frecuencia</th>
                <th className="p-2 text-center">Última Lectura</th>
                <th className="p-2 text-center">Lectura Actual</th>
                <th className="p-2 text-center">Avance</th>
                <th className="p-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientosProximos.map((item, index) => {
                const { maquinaria, mantenimiento } = item;
                const { porcentajeUso } = mantenimiento;

                const estado = porcentajeUso >= 100
                  ? { texto: 'Vencido', color: 'text-red-500', icono: '⚠' }
                  : porcentajeUso >= 80
                  ? { texto: 'Próximo', color: 'text-yellow-400', icono: '⏳' }
                  : { texto: 'Al día', color: 'text-green-400', icono: '✅' };

                return (
                  <tr key={index} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                    <td className="p-2">
                      {maquinaria.tipo} - {maquinaria.placa}
                    </td>
                    <td className="p-2">{mantenimiento.nombre}</td>
                    <td className="p-2 text-center">{mantenimiento.frecuencia}</td>
                    <td className="p-2 text-center">{mantenimiento.ultimaLectura}</td>
                    <td className="p-2 text-center">{maquinaria.lecturaActual}</td>
                    <td className="p-2 text-center">{porcentajeUso}%</td>
                    <td className={`p-2 text-center font-semibold ${estado.color}`}>
                      {estado.icono} {estado.texto}
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

export default MantenimientosProximosPage;
