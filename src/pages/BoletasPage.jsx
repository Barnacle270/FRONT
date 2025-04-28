import { useEffect } from "react";
import { useBoleta } from "../context/BoletasContext";
import { Link } from "react-router-dom";

function BoletaPage() {
  const {
    boletas,
    totalBoletas,
    currentPage,
    boletasPerPage,
    getBoletas,
    setCurrentPage,
  } = useBoleta();

  useEffect(() => {
    getBoletas(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalBoletas / boletasPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (boletas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <h1 className="text-center text-gray-400 text-xl font-semibold">
          No hay boletas disponibles
        </h1>
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-surface rounded-lg">
          <thead className="bg-navbar text-white uppercase text-sm tracking-wider">
            <tr>
              <th className="py-3 px-6 text-left">DNI</th>
              <th className="py-3 px-6 text-left">Mes</th>
              <th className="py-3 px-6 text-left">Año</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((boleta, idx) => (
              <tr
                key={boleta._id}
                className={`${
                  idx % 2 === 0 ? "bg-background" : "bg-surface"
                } border-b border-gray-700 hover:bg-surface/80 transition`}
              >
                <td className="py-3 px-6">{boleta.dni}</td>
                <td className="py-3 px-6 capitalize">{boleta.mes}</td>
                <td className="py-3 px-6">{boleta.year}</td>
                <td className="py-3 px-6 text-center">
                  <Link
                    to={boleta.image.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-highlight hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition"
                  >
                    Ver / Descargar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-md font-semibold ${
              currentPage === index + 1
                ? "bg-highlight text-white"
                : "bg-navbar text-gray-300 hover:bg-surface"
            } transition`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}

export default BoletaPage;
