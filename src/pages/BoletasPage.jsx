import { useEffect, useState } from "react";
import { useBoleta } from "../context/BoletasContext";
import { Link } from "react-router-dom";
import { FaSearch, FaDownload, FaIdCard } from "react-icons/fa";

function BoletaPage() {
  const {
    boletas,
    totalBoletas,
    currentPage,
    boletasPerPage,
    getBoletas,
    setCurrentPage,
  } = useBoleta();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getBoletas(currentPage);
      setLoading(false);
    };
    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalBoletas / boletasPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filtrar boletas según búsqueda
  const filteredBoletas = boletas.filter(
    (boleta) =>
      boleta.dni.toLowerCase().includes(search.toLowerCase()) ||
      boleta.year.toString().includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-highlight"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (filteredBoletas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h1 className="text-center text-gray-400 text-xl font-semibold">
          No hay boletas disponibles
        </h1>
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por año o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md bg-zinc-800 text-white w-full text-center"
          />
        </div>
      </div>
    );
  }

  return (
    <section className="p-6 space-y-6">
      {/* Resumen y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">
          Total boletas:{" "}
          <span className="text-highlight">{totalBoletas}</span>
        </h2>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por año o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md bg-zinc-800 text-white w-full"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBoletas.map((boleta) => (
          <div
            key={boleta._id}
            className="bg-surface rounded-xl shadow-md border border-gray-700 p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaIdCard className="text-highlight text-xl" />
              <h3 className="text-lg font-semibold text-white">
                DNI: {boleta.dni}
              </h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                {boleta.mes}
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                {boleta.year}
              </span>
            </div>
            <div className="flex justify-end">
              <Link
                to={boleta.image.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-highlight hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition"
              >
                <FaDownload /> Ver / Descargar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-400">
          Página <span className="text-white">{currentPage}</span> de{" "}
          <span className="text-white">{totalPages}</span>
        </p>

        <div className="flex justify-center items-center space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                currentPage === index + 1
                  ? "bg-highlight text-white"
                  : "bg-navbar text-gray-300 hover:bg-surface"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BoletaPage;
