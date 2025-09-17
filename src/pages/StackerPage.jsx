import { useEffect, useState } from "react";
import { useServicios } from "../context/ServicioContext";
import toast from "react-hot-toast";
import { HiCheckCircle, HiTruck, HiCalendar, HiUser } from "react-icons/hi";

const StackerPage = () => {
  const { pendientes, cargarPendientes, cambiarEstadoCarguio } = useServicios();
  const [modalServicio, setModalServicio] = useState(null);
  const [confirmacion, setConfirmacion] = useState(false);

  // Cargar inicialmente y refrescar cada 5s
  useEffect(() => {
    cargarPendientes();
    const interval = setInterval(() => cargarPendientes(), 5000);
    return () => clearInterval(interval);
  }, []);

  // Detectar si aparece un nuevo servicio en PENDIENTE
  useEffect(() => {
    const pendienteCarguio = pendientes.find(
      (s) => s.estadoCarguio === "PENDIENTE"
    );
    if (pendienteCarguio) {
      setModalServicio(pendienteCarguio);
    }
  }, [pendientes]);

  const handleConfirmarClick = () => setConfirmacion(true);

  const handleConfirmarFinal = async () => {
    if (!modalServicio) return;
    try {
      await cambiarEstadoCarguio(modalServicio._id, "COMPLETADO");
      toast.success("✅ Contenedor marcado como cargado");
      setModalServicio(null);
      setConfirmacion(false);
      cargarPendientes();
    } catch {
      toast.error("❌ Error al confirmar carguío");
    }
  };

  return (
    <div className="p-6 text-text-primary">
      <h1 className="text-3xl font-extrabold mb-8 text-brand-primary">
        📦 Pantalla Stacker
      </h1>

      {pendientes.length === 0 ? (
        <p className="text-base text-text-secondary italic">
          No hay servicios pendientes por devolver.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendientes.map((s) => (
            <div
              key={s._id}
              className={`card relative ${
                s.estadoCarguio === "COMPLETADO"
                  ? "border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                  : ""
              }`}
            >
              <h2 className="text-lg font-semibold mb-3">{s.cliente}</h2>

              {s.estadoCarguio === "COMPLETADO" && (
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                  ✅ Completado
                </span>
              )}

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <HiTruck className="text-brand-primary" />
                  <strong>Contenedor:</strong> {s.numeroContenedor}
                </p>
                <p>
                  <strong>Placa:</strong> {s.placaDevolucion || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <HiUser className="text-brand-primary" />
                  <strong>Conductor:</strong> {s.conductorDevolucion || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <HiCalendar className="text-brand-primary" />
                  <strong>Fecha devolución:</strong>{" "}
                  {s.fechaDevolucion?.slice(0, 10) || "—"}
                </p>
                <p>
                  <strong>Hora cita:</strong> {s.horaCita || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal bloqueante */}
      {modalServicio && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-2xl shadow-xl w-96 animate-fade-in">
            {!confirmacion ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-brand-primary">
                  🚨 Nuevo carguío solicitado
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Cliente:</strong> {modalServicio.cliente}
                  </p>
                  <p>
                    <strong>Contenedor:</strong>{" "}
                    {modalServicio.numeroContenedor}
                  </p>
                  <p>
                    <strong>Placa:</strong>{" "}
                    {modalServicio.placaDevolucion || "—"}
                  </p>
                  <p>
                    <strong>Conductor:</strong>{" "}
                    {modalServicio.conductorDevolucion || "—"}
                  </p>
                  <p>
                    <strong>Hora cita:</strong>{" "}
                    {modalServicio.horaCita || "—"}
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleConfirmarClick}
                    className="btn btn-success flex items-center gap-2"
                  >
                    <HiCheckCircle /> Contenedor cargado
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-red-500">
                  ⚠️ Confirmación final
                </h2>
                <p className="mb-4">
                  ¿Estás seguro de confirmar el carguío del contenedor{" "}
                  <strong>{modalServicio.numeroContenedor}</strong>?
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={handleConfirmarFinal}
                    className="btn btn-success"
                  >
                    ✅ Sí, confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StackerPage;
