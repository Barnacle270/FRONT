import React, { useState } from 'react';
import { useReportes } from '../context/ReportesContext';

const ReportesPage = () => {
  const { descargarServicios } = useReportes();
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const handleDescargar = () => {
    if (!desde || !hasta) {
      alert('Por favor selecciona el rango de fechas');
      return;
    }
    descargarServicios(desde, hasta);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporte de Servicios</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div>
          <label className="block mb-1">Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block mb-1">Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="input" />
        </div>
      </div>
      <button onClick={handleDescargar} className="btn btn-primary">
        📥 Descargar Excel
      </button>
    </div>
  );
};

export default ReportesPage;
