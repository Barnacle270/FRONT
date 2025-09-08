import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus, FaBroom, FaSync, FaEye, FaMoneyBillWave, FaTrash, FaSearch
} from "react-icons/fa";
import { useFactura } from "../context/FacturaContext";

import ImportarFacturasExcel from '../components/ImportarFacturasExcel';

function Section({ title, right, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </motion.section>
  );
}

function Badge({ children, color = "neutral" }) {
  const map = {
    neutral: "bg-white/10 text-white",
    success: "bg-green-500/20 text-green-300",
    warning: "bg-yellow-500/20 text-yellow-300",
    danger: "bg-red-500/20 text-red-300",
    violet: "bg-violet-500/20 text-violet-300",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[color]}`}>
      {children}
    </span>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <label className="grid gap-1 text-sm">
      {label && <span className="text-white/70">{label}</span>}
      <input
        {...props}
        className={`px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40 ${className}`}
      />
    </label>
  );
}

function Textarea({ label, className = "", ...props }) {
  return (
    <label className="grid gap-1 text-sm">
      {label && <span className="text-white/70">{label}</span>}
      <textarea
        {...props}
        className={`px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40 ${className}`}
      />
    </label>
  );
}

function Select({ label, className = "", children, ...props }) {
  return (
    <label className="grid gap-1 text-sm">
      {label && <span className="text-white/70">{label}</span>}
      <select
        {...props}
        className={`px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${className}`}
      >
        {children}
      </select>
    </label>
  );
}

function Table({ children }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}
function Th({ children }) {
  return <th className="text-left text-white/70 font-medium px-2 py-2 border-b border-neutral-800">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-2 py-2 border-b border-neutral-800 ${className}`}>{children}</td>;
}

function EstadoPagoBadge({ estado }) {
  const e = String(estado || "").toUpperCase();
  if (e === "PAGADO") return <Badge color="success">PAGADO</Badge>;
  if (e === "PENDIENTE") return <Badge color="warning">PENDIENTE</Badge>;
  return <Badge>{e || "—"}</Badge>;
}

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0);
const fmtDateTime = (d) => {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return `${dt.toLocaleDateString("es-PE")} ${dt.toLocaleTimeString("es-PE")}`;
  } catch {
    return "—";
  }
};

export default function FacturacionPage() {
  const {
    facturas,
    facturaSeleccionada,
    filtros,
    setFiltros,
    loading,
    loadingAccion,
    error,
    listar,
    crear,
    obtener,
    pagar,
    refrescar,
  } = useFactura();

  // ------- Crear Factura -------
  const [modo, setModo] = useState("compacto"); // 'compacto' | 'detallado'
  const [numero, setNumero] = useState("");
  const [cliente, setCliente] = useState("");
  const [moneda, setMoneda] = useState("PEN");
  const [observaciones, setObservaciones] = useState("");

  // Modo compacto
  const [montoPorServicio, setMontoPorServicio] = useState(0);
  const [numeroGuiasText, setNumeroGuiasText] = useState("");
  const numeroGuias = useMemo(
    () => numeroGuiasText.split(",").map((s) => s.trim()).filter(Boolean),
    [numeroGuiasText]
  );

  // Modo detallado
  const [items, setItems] = useState([{ numeroGuia: "", monto: 0 }]);
  const addItem = () => setItems((p) => [...p, { numeroGuia: "", monto: 0 }]);
  const delItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updItem = (i, key, val) =>
    setItems((p) => p.map((it, idx) => (idx === i ? { ...it, [key]: key === "monto" ? Number(val) : val } : it)));

  // Carga inicial
  useEffect(() => {
    listar();
  }, [listar]);

  // Crear
  const onCrear = async (e) => {
    e.preventDefault();
    if (!numero) return alert("Ingresa el número de factura");
    const base = { numero, cliente: cliente || undefined, moneda, observaciones };
    try {
      if (modo === "compacto") {
        if (!numeroGuias.length) return alert("Ingresa al menos un número de guía");
        if (!(Number(montoPorServicio) >= 0)) return alert("Monto por servicio inválido");
        await crear({ ...base, numeroGuias, montoPorServicio: Number(montoPorServicio) });
      } else {
        const itemsValidos = items
          .filter((it) => it.numeroGuia?.trim())
          .map((it) => ({ numeroGuia: it.numeroGuia.trim(), monto: Number(it.monto) }));
        if (!itemsValidos.length) return alert("Agrega al menos un ítem válido");
        if (itemsValidos.some((it) => !(it.monto >= 0))) return alert("Montos inválidos");
        await crear({ ...base, items: itemsValidos });
      }
      // reset
      setNumero("");
      setCliente("");
      setMoneda("PEN");
      setObservaciones("");
      setMontoPorServicio(0);
      setNumeroGuiasText("");
      setItems([{ numeroGuia: "", monto: 0 }]);
      await refrescar();
    } catch {
      // el Context ya guarda error
    }
  };

  // Pagar
  const onPagar = async () => {
    if (!facturaSeleccionada) return;
    await pagar(facturaSeleccionada.numero);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <ImportarFacturasExcel onDone={() => refrescar()} />

      {/* LISTA + FILTROS */}
      <Section
        title="Facturas"
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => listar()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm"
            >
              <FaSync /> {loading ? "Buscando…" : "Aplicar filtros"}
            </button>
            <button
              onClick={() => {
                setFiltros({ cliente: "", estadoPago: "", desde: "", hasta: "" });
                listar({});
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm"
            >
              Limpiar
            </button>
            <button
              onClick={refrescar}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm"
            >
              <FaSync /> Refrescar
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <Input
            label="Cliente"
            placeholder="Cliente XYZ"
            value={filtros.cliente || ""}
            onChange={(e) => setFiltros((f) => ({ ...f, cliente: e.target.value }))}
          />
          <Select
            label="Estado de pago"
            value={filtros.estadoPago || ""}
            onChange={(e) => setFiltros((f) => ({ ...f, estadoPago: e.target.value }))}
          >
            <option value="">(todos)</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PAGADO">PAGADO</option>
          </Select>
          <Input
            label="Desde"
            type="date"
            value={filtros.desde || ""}
            onChange={(e) => setFiltros((f) => ({ ...f, desde: e.target.value }))}
          />
          <Input
            label="Hasta"
            type="date"
            value={filtros.hasta || ""}
            onChange={(e) => setFiltros((f) => ({ ...f, hasta: e.target.value }))}
          />
          <div className="grid gap-1 text-sm">
            <span className="text-white/70">Acciones</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => listar()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-black text-sm font-semibold"
              >
                <FaSearch /> Buscar
              </button>
              <button
                onClick={() => {
                  setFiltros({ cliente: "", estadoPago: "", desde: "", hasta: "" });
                  listar({});
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-sm"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Nº</Th>
              <Th>Fecha emisión</Th>
              <Th>Cliente</Th>
              <Th>Total</Th>
              <Th>Estado pago</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => (
              <tr
                key={f._id}
                className="hover:bg-neutral-800/50 cursor-pointer"
                onClick={() => obtener(f.numero)} // 👈 aquí el cambio
              >
                <Td>{f.numero}</Td>
                <Td>{f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString("es-PE") : "—"}</Td>
                <Td>{f.cliente || "—"}</Td>
                <Td>S/ {fmtMoney(f.total)}</Td>
                <Td><EstadoPagoBadge estado={f.estadoPago} /></Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700"
                      onClick={(e) => { e.stopPropagation(); obtener(f.numero); }}
                    >
                      <FaEye /> Ver
                    </button>
                    <button
                      disabled={f.estadoPago === "PAGADO" || loadingAccion}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                      onClick={(e) => { e.stopPropagation(); pagar(f.numero); }}
                    >
                      <FaMoneyBillWave /> Pagar
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {(!facturas || facturas.length === 0) && !loading && (
              <tr>
                <Td className="text-center text-white/60" colSpan={6}>Sin resultados</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>

      {/* DETALLE */}
      <Section title="Detalle de factura">
        {!facturaSeleccionada ? (
          <p className="text-white/60">Selecciona una factura para ver su detalle.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardField label="Número" value={facturaSeleccionada.numero} />
              <CardField label="Cliente" value={facturaSeleccionada.cliente || "—"} />
              <CardField label="Moneda" value={facturaSeleccionada.moneda || "PEN"} />
              <CardField label="Fecha emisión" value={fmtDateTime(facturaSeleccionada.fechaEmision)} />
              <CardField label="Estado pago" value={<EstadoPagoBadge estado={facturaSeleccionada.estadoPago} />} />
              <CardField label="Fecha pago" value={fmtDateTime(facturaSeleccionada.fechaPago)} />
              <CardField label="Total" value={`S/ ${fmtMoney(facturaSeleccionada.total)}`} />
              <CardField label="Observaciones" value={facturaSeleccionada.observaciones || "—"} className="md:col-span-3" />
            </div>

            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">Servicios</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>#</Th>
                    <Th>Número guía</Th>
                    <Th>Cliente</Th>
                    <Th>Monto</Th>
                  </tr>
                </thead>
                <tbody>
                  {facturaSeleccionada.items?.map((it, idx) => (
                    <tr key={idx}>
                      <Td>{idx + 1}</Td>
                      <Td>{it?.servicio?.numeroGuia || "—"}</Td>
                      <Td>{it?.servicio?.cliente || "—"}</Td>
                      <Td>S/ {fmtMoney(it?.monto)}</Td>
                    </tr>
                  ))}
                  {(!facturaSeleccionada.items || facturaSeleccionada.items.length === 0) && (
                    <tr>
                      <Td className="text-center text-white/60" colSpan={4}>Sin ítems</Td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                disabled={loadingAccion || facturaSeleccionada.estadoPago === "PAGADO"}
                onClick={onPagar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                <FaMoneyBillWave /> Marcar como PAGADA
              </button>
              <button
                onClick={() => obtener(facturaSeleccionada.numero)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700"
              >
                <FaSync /> Refrescar detalle
              </button>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

/* ------- subcomponentes ------- */
function CardField({ label, value, className = "" }) {
  return (
    <div className={`bg-neutral-800/60 rounded-xl p-3 ${className}`}>
      <div className="text-xs text-white/60">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
