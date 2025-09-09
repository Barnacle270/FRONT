import React, { useState } from 'react';
import { useReportes } from '../context/ReportesContext';
import toast from 'react-hot-toast';

const ReportesPage = () => {
  const { descargarServicios } = useReportes();
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const handleDescargar = () => {
    if (!desde || !hasta) {
      toast.error('Por favor selecciona el rango de fechas');
      return;
    }
    descargarServicios(desde, hasta);
  };

  return (
    <div className="p-6 text-text-primary">
      <h1 className="text-2xl font-bold mb-6 drop-shadow-[0_0_6px_#3B82F6]">
        Reporte de Servicios
      </h1>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-text-secondary mb-1">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={e => setDesde(e.target.value)}
            className="input"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-text-secondary mb-1">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={e => setHasta(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <button
        onClick={handleDescargar}
        className="btn btn-primary flex items-center gap-2"
      >
        📥 Descargar Excel
      </button>
    </div>
  );
};

export default ReportesPage;
