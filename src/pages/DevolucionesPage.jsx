import { useEffect, useState } from "react";
import { useServicios } from "../context/ServicioContext";
import toast from "react-hot-toast";
import ServicioEditModal from "../components/ServicioEditModal";
import { HiPencil, HiCheck, HiChevronUp, HiChevronDown } from "react-icons/hi";

const DevolucionesPage = () => {
  const { pendientes, cargarPendientes, marcarDevuelto } = useServicios();
  const [modalServicioId, setModalServicioId] = useState(null);

  const [orden, setOrden] = useState({ campo: null, direccion: "asc" });
  const [serviciosOrdenados, setServiciosOrdenados] = useState([]);

  useEffect(() => {
    cargarPendientes();
  }, []);

  useEffect(() => {
    ordenarServicios();
  }, [pendientes, orden]);

  const ordenarServicios = () => {
    let lista = [...pendientes];
    const { campo, direccion } = orden;

    if (campo) {
      lista.sort((a, b) => {
        const valA = (a[campo] || "").toString().toLowerCase();
        const valB = (b[campo] || "").toString().toLowerCase();

        if (valA < valB) return direccion === "asc" ? -1 : 1;
        if (valA > valB) return direccion === "asc" ? 1 : -1;
        return 0;
      });
    }

    setServiciosOrdenados(lista);
  };

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const handleMarcarDevuelto = async (id) => {
    const confirmar = confirm("¿Estás seguro de marcar este contenedor como devuelto?");
    if (!confirmar) return;

    try {
      await marcarDevuelto(id);
      toast.success("Contenedor marcado como devuelto");
      cargarPendientes();
    } catch (error) {
      toast.error("Error al marcar como devuelto");
    }
  };

  const calcularDiasFaltantes = (vencimiento) => {
    if (!vencimiento) return "—";
    const hoy = new Date();
    const fin = new Date(vencimiento);
    const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : -9999; // valor negativo para vencido
  };

  const renderOrdenIcono = (campo) => {
    if (orden.campo !== campo) return null;
    return orden.direccion === "asc" ? (
      <HiChevronUp className="inline w-4 h-4 ml-1" />
    ) : (
      <HiChevronDown className="inline w-4 h-4 ml-1" />
    );
  };

  const getDiasClass = (dias) => {
    if (dias === "—") return "text-text-secondary";
    if (dias < 0) return "text-red-500 drop-shadow-[0_0_6px_#f87171]";
    if (dias <= 2) return "text-yellow-400 drop-shadow-[0_0_6px_#facc15]";
    return "text-green-400 drop-shadow-[0_0_6px_#4ade80]";
  };

  return (
    <div className="p-6 text-text-primary">
      <h1 className="text-2xl font-bold mb-6">Devoluciones Pendientes</h1>

      {serviciosOrdenados.length === 0 ? (
        <p className="text-sm text-neutral-400">No hay servicios pendientes por devolver.</p>
      ) : (
        <>
          {/* Vista escritorio */}
          <div className="hidden md:block overflow-x-auto bg-surface rounded shadow-md">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-navbar text-text-secondary">
                <tr>
                  <th className="p-2 text-center cursor-pointer" onClick={() => toggleOrden("cliente")}>
                    Cliente {renderOrdenIcono("cliente")}
                  </th>
                  <th className="p-2 text-center cursor-pointer" onClick={() => toggleOrden("numeroContenedor")}>
                    Contenedor {renderOrdenIcono("numeroContenedor")}
                  </th>
                  <th className="p-2 text-center">Almacén de D.</th>
                  <th className="p-2 text-center cursor-pointer" onClick={() => toggleOrden("vencimientoMemo")}>
                    F. Vencimiento {renderOrdenIcono("vencimientoMemo")}
                  </th>
                  <th className="p-2 text-center">Faltan</th>
                  <th className="p-2 text-center">Placa D.</th>
                  <th className="p-2 text-center">Conductor D.</th>
                  <th className="p-2 text-center">Fecha Devolución</th>
                  <th className="p-2 text-center">Hora cita</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {serviciosOrdenados.map((s) => {
                  const dias = calcularDiasFaltantes(s.vencimientoMemo);

                  return (
                    <tr key={s._id} className="border-t border-neutral-800 hover:bg-neutral-800/40">
                      <td className="p-2 text-center">{s.cliente}</td>
                      <td className="p-2 text-center">{s.numeroContenedor}</td>
                      <td className="p-2 text-center">{s.terminalDevolucion || "—"}</td>
                      <td className="p-2 text-center">{s.vencimientoMemo?.slice(0, 10) || "—"}</td>
                      <td className={`p-2 text-center font-semibold ${getDiasClass(dias)}`}>
                        {dias === -9999 ? "—" : dias < 0 ? "VENCIDO" : `${dias} día(s)`}
                      </td>
                      <td className="p-2 text-center">{s.placaDevolucion || "—"}</td>
                      <td className="p-2 text-center">{s.conductorDevolucion || "—"}</td>
                      <td className="p-2 text-center">{s.fechaDevolucion?.slice(0, 10) || "—"}</td>
                      <td className="p-2 text-center">{s.horaCita || "—"}</td>
                      <td className="p-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setModalServicioId(s._id)}
                            className="bg-highlight text-white p-2 rounded hover:brightness-110"
                            title="Editar"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarcarDevuelto(s._id)}
                            className="btn btn-success"
                            title="Marcar como devuelto"
                          >
                            <HiCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="block md:hidden space-y-4">
            {serviciosOrdenados.map((s) => {
              const dias = calcularDiasFaltantes(s.vencimientoMemo);
              return (
                <div key={s._id} className="bg-surface p-4 rounded shadow-md">
                  <p><strong>Cliente:</strong> {s.cliente}</p>
                  <p><strong>Contenedor:</strong> {s.numeroContenedor}</p>
                  <p><strong>Almacén:</strong> {s.terminalDevolucion || "—"}</p>
                  <p><strong>F. Vencimiento:</strong> {s.vencimientoMemo?.slice(0, 10) || "—"}</p>
                  <p>
                    <strong>Faltan:</strong>{" "}
                    <span className={`font-semibold ${getDiasClass(dias)}`}>
                      {dias === -9999 ? "—" : dias < 0 ? "VENCIDO" : `${dias} día(s)`}
                    </span>
                  </p>
                  <p><strong>Placa:</strong> {s.placaDevolucion || "—"}</p>
                  <p><strong>Conductor:</strong> {s.conductorDevolucion || "—"}</p>
                  <p><strong>Fecha Devolución:</strong> {s.fechaDevolucion?.slice(0, 10) || "—"}</p>
                  <p><strong>Hora Cita:</strong> {s.horaCita || "—"}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setModalServicioId(s._id)}
                      className="bg-highlight text-white p-2 rounded hover:brightness-110"
                      title="Editar"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMarcarDevuelto(s._id)}
                      className="btn btn-success"
                      title="Marcar como devuelto"
                    >
                      <HiCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {modalServicioId && (
        <ServicioEditModal
          id={modalServicioId}
          onClose={() => {
            setModalServicioId(null);
            cargarPendientes();
          }}
        />
      )}
    </div>
  );
};

export default DevolucionesPage;
