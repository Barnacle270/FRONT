import { Link } from "react-router-dom";
import { Download, Eye } from "lucide-react";

function BoletasTable({ boletas }) {
  if (!boletas || boletas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
        <img
          src="https://assets.vercel.com/image/upload/v1662130559/front/empty-state-dark.svg"
          alt="Sin boletas"
          className="w-40 h-40 opacity-70 mb-6"
        />
        <p className="text-slate-400 text-lg">No hay boletas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8 shadow-xl rounded-2xl bg-surface animate-fade-in">
      <table className="min-w-full text-white">
        <thead className="bg-navbar text-text-secondary uppercase text-xs md:text-sm tracking-widest">
          <tr>
            <th className="py-4 px-6 text-left">Mes</th>
            <th className="py-4 px-6 text-left">Año</th>
            <th className="py-4 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {boletas.map((boleta, idx) => (
            <tr
              key={boleta._id}
              className={`${
                idx % 2 === 0 ? "bg-background" : "bg-surface"
              } border-b border-gray-700 hover:bg-surface/80 transition-all duration-200`}
            >
              <td className="py-4 px-6 capitalize">{boleta.mes}</td>
              <td className="py-4 px-6">{boleta.year}</td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-center gap-4">
                  <Link
                    to={boleta.image.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver boleta"
                    className="flex items-center gap-1 bg-highlight hover:bg-blue-700 active:scale-95 shadow-md text-white px-4 py-2 rounded-md text-xs md:text-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Link>
                  <a
                    href={boleta.image.secure_url}
                    download
                    aria-label="Descargar boleta"
                    className="flex items-center gap-1 bg-button-primary hover:bg-gray-700 active:scale-95 shadow-md text-white px-4 py-2 rounded-md text-xs md:text-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BoletasTable;
