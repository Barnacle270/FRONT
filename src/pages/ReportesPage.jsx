import React, { useState } from "react";
import { useReportes } from "../context/ReportesContext";
import toast from "react-hot-toast";

const ReportesPage = () => {
  const { descargarServicios } = useReportes();
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const handleDescargar = () => {
    if (!desde || !hasta) {
      toast.error("Por favor selecciona el rango de fechas");
      return;
    }
    descargarServicios(desde, hasta);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl card animate-fade-in">
        {/* Header */}
        <h1 className="card-header">📊 Reporte de Servicios</h1>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 mt-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm text-text-secondary mb-1">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm text-text-secondary mb-1">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleDescargar}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          📥 Descargar Excel
        </button>
      </div>
    </div>
  );
};

export default ReportesPage;
