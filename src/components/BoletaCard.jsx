import { Link } from "react-router-dom"
import { useBoleta } from "../context/BoletasContext"

function BoletaCard({ boleta }) {
  
  return (
    <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md shadow-md flex items-center justify-between">
      <div className="flex flex-col items-center">
        <p className="text-slate-300 mb-2">Mes:</p>
        <p className="text-slate-300 mb-2">Año:</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-white mb-2">{boleta.mes}</p>
        <p className="text-white mb-2">{boleta.year}</p>
      </div>
      <Link
        className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm transition-colors duration-300 ease-in-out"
        to={boleta.image.secure_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir
      </Link>
    </div>
  );

}
export default BoletaCard