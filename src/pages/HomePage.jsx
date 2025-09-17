import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import {
  FaArrowUp,
  FaArrowDown,
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaHourglassHalf,
  FaBan,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

const fmt = new Intl.NumberFormat("es-PE");

const tooltipCommon = {
  labelStyle: { color: "#111" },
  itemStyle: { color: "#111" },
  contentStyle: { background: "#fff", borderColor: "#e5e7eb", color: "#111" },
};

const commonAxis = {
  stroke: "#999",
  tick: { fill: "#bbb", fontSize: 12 },
};

const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke="#333" />;

function NoData({ children = "Sin datos para el periodo" }) {
  return (
    <div className="h-full w-full flex items-center justify-center text-white/60 text-sm">
      {children}
    </div>
  );
}

function Sparkline({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-10 w-24 flex items-center justify-center text-white/60 text-xs">
        —
      </div>
    );
  }
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((d) => ({ name: d.x, value: d.y }))}>
          <Tooltip {...tooltipCommon} formatter={(v) => fmt.format(v)} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ title, value, color, icon, delta = 0, series = [], loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl shadow-md p-4 bg-neutral-700 animate-pulse h-28"></div>
    );
  }
  const deltaPositive = (delta || 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl shadow-md p-4 bg-surface border-l-4 ${color} flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{icon}</div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            deltaPositive ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {deltaPositive ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(delta || 0).toFixed(1)}%
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-extrabold leading-none">{value ?? 0}</p>
        <Sparkline data={series} />
      </div>
    </motion.div>
  );
}

function estadoBadge(estado) {
  const e = (estado || "").toUpperCase();
  if (e === "CONCLUIDO") return "bg-green-600 text-white";
  if (e === "PENDIENTE") return "bg-yellow-500 text-black";
  if (e === "ANULADA") return "bg-red-600 text-white";
  return "bg-blue-600 text-white";
}
function estadoLabel(estado) {
  const e = (estado || "").toUpperCase();
  if (e === "CONCLUIDO") return "Concluido";
  if (e === "PENDIENTE") return "Pendiente";
  if (e === "ANULADA") return "Anulada";
  return estado || "—";
}

function YTickCliente({ x, y, payload, maxChars = 32 }) {
  const label = String(payload.value ?? "");
  const text =
    label.length > maxChars ? label.slice(0, maxChars - 1) + "…" : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#bbb" fontSize={12}>
        {text}
      </text>
    </g>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { stats, loading, error, period, refresh } = useDashboard();

  const kpis = useMemo(
    () => ({
      total: stats?.total ?? 0,
      pendientes: stats?.pendientes ?? 0,
      concluidos: stats?.concluidos ?? 0,
      facturados: stats?.facturados ?? 0,
      pendientesFacturar: stats?.pendientesFacturar ?? 0,
      anuladasMesActual: stats?.anuladasMesActual ?? 0,
      deltas: stats?.deltas || {},
      series: stats?.series || {
        serviciosPorDia: [],
        estadosPorDia: [],
        facturacion: [],
      },
      ultimos: stats?.ultimos || [],
      topClientes: stats?.topClientes || [],
    }),
    [stats]
  );

  const cards = [
    {
      title: "Total Servicios",
      value: kpis.total,
      color: "border-blue-500",
      icon: <FaBoxOpen className="text-blue-500" />,
      delta: kpis?.deltas?.total || 0,
      series: (kpis.series?.serviciosPorDia || []).map((d) => ({
        x: d.date,
        y: d.total,
      })),
    },
    {
      title: "Pendientes",
      value: kpis.pendientes,
      color: "border-yellow-500",
      icon: <FaClock className="text-yellow-500" />,
      delta: kpis?.deltas?.pendientes || 0,
      series: (kpis.series?.estadosPorDia || []).map((d) => ({
        x: d.date,
        y: d.pendientes || 0,
      })),
    },
    {
      title: "Concluidos",
      value: kpis.concluidos,
      color: "border-green-500",
      icon: <FaCheckCircle className="text-green-500" />,
      delta: kpis?.deltas?.concluidos || 0,
      series: (kpis.series?.estadosPorDia || []).map((d) => ({
        x: d.date,
        y: d.concluidos || 0,
      })),
    },
    {
      title: "Facturados",
      value: kpis.facturados,
      color: "border-purple-500",
      icon: <FaFileInvoiceDollar className="text-purple-500" />,
      delta: kpis?.deltas?.facturados || 0,
      series: (kpis.series?.facturacion || []).map((d) => ({
        x: d.date,
        y: d.facturados || 0,
      })),
    },
    {
      title: "Pend. Facturar",
      value: kpis.pendientesFacturar,
      color: "border-orange-500",
      icon: <FaHourglassHalf className="text-orange-500" />,
      delta: kpis?.deltas?.pendientesFacturar || 0,
      series: (kpis.series?.facturacion || []).map((d) => ({
        x: d.date,
        y: d.pendientesFacturar || 0,
      })),
    },
    {
      title: "Anuladas este mes",
      value: kpis.anuladasMesActual,
      color: "border-red-500",
      icon: <FaBan className="text-red-500" />,
      delta: kpis?.deltas?.anuladasMesActual || 0,
      series: (kpis.series?.estadosPorDia || []).map((d) => ({
        x: d.date,
        y: d.anuladas || 0,
      })),
    },
  ];

  const pieData = [
    { name: "Facturado", value: kpis.facturados },
    { name: "Pend. Facturar", value: kpis.pendientesFacturar },
  ];

  const serviciosPorDia = kpis.series?.serviciosPorDia || [];
  const estadosPorDia = kpis.series?.estadosPorDia || [];
  const facturacion = kpis.series?.facturacion || [];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface text-white p-6 md:p-8 rounded-2xl shadow-md"
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          ¡Hola, {user?.name || "Usuario"}!
        </h1>
        <p className="text-text-secondary mt-1">Resumen de tu operación</p>
      </motion.div>

      {/* Period controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="inline-flex rounded-xl shadow-sm overflow-hidden">
          {["7d", "30d", "90d", "MTD", "YTD"].map((p) => (
            <button
              key={p}
              onClick={() => refresh({ period: p })}
              className={`btn ${period === p ? "btn-primary" : "btn-secondary"}`}
            >
              {p}
            </button>
          ))}
        </div>
        {loading && <span className="text-sm text-white/80">Cargando…</span>}
        {error && <span className="text-sm text-red-400">{String(error)}</span>}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} loading={loading} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Servicios por día */}
        <div className="bg-surface rounded-2xl p-4 shadow-md">
          <h3 className="text-white font-semibold mb-2">Servicios por día</h3>
          <div className="h-64">
            {loading ? (
              <div className="h-full bg-neutral-700 animate-pulse rounded-xl" />
            ) : serviciosPorDia.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={serviciosPorDia.map((d) => ({ name: d.date, total: d.total }))}
                >
                  {commonGrid}
                  <XAxis dataKey="name" {...commonAxis} />
                  <YAxis {...commonAxis} />
                  <Tooltip {...tooltipCommon} formatter={(v) => fmt.format(v)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Estados por día */}
        <div className="bg-surface rounded-2xl p-4 shadow-md">
          <h3 className="text-white font-semibold mb-2">Estados por día</h3>
          <div className="h-64">
            {loading ? (
              <div className="h-full bg-neutral-700 animate-pulse rounded-xl" />
            ) : estadosPorDia.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estadosPorDia}>
                  {commonGrid}
                  <XAxis dataKey="date" {...commonAxis} />
                  <YAxis {...commonAxis} />
                  <Tooltip {...tooltipCommon} formatter={(v) => fmt.format(v)} />
                  <Legend />
                  <Bar dataKey="pendientes" stackId="a" fill="#FBBF24" />
                  <Bar dataKey="concluidos" stackId="a" fill="#22C55E" />
                  <Bar dataKey="anuladas" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Facturación */}
        <div className="bg-surface rounded-2xl p-4 shadow-md">
          <h3 className="text-white font-semibold mb-2">Facturación</h3>
          <div className="h-64">
            {loading ? (
              <div className="h-full bg-neutral-700 animate-pulse rounded-xl" />
            ) : facturacion.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={["#8B5CF6", "#FB923C"][idx]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipCommon} formatter={(v) => fmt.format(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Top clientes & Últimos servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top clientes */}
        <div className="bg-surface rounded-2xl p-4 shadow-md overflow-hidden">
          <h3 className="text-white font-semibold mb-2">Top clientes por servicios</h3>
          <div
            style={{
              height: Math.max(200, Math.min((kpis.topClientes?.length || 0) * 32, 420)),
            }}
          >
            {loading ? (
              <div className="h-full bg-neutral-700 animate-pulse rounded-xl" />
            ) : (kpis.topClientes?.length ?? 0) === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpis.topClientes}
                  layout="vertical"
                  margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
                  barCategoryGap={6}
                >
                  {commonGrid}
                  <YAxis
                    dataKey="cliente"
                    type="category"
                    width={220}
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tick={<YTickCliente maxChars={32} />}
                  />
                  <XAxis
                    type="number"
                    {...commonAxis}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    {...tooltipCommon}
                    labelFormatter={(lbl) => `Cliente: ${lbl || "—"}`}
                    formatter={(v) => [`${v} servicio${v === 1 ? "" : "s"}`, "Cantidad"]}
                  />
                  <Bar dataKey="cantidad" fill="#3B82F6" radius={[6, 6, 6, 6]}>
                    <LabelList dataKey="cantidad" position="right" className="fill-white" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Últimos servicios */}
        <div className="bg-surface rounded-2xl p-4 shadow-md">
          <h3 className="text-white font-semibold mb-3">Últimos servicios</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="h-64 bg-neutral-700 animate-pulse rounded-xl" />
            ) : (kpis.ultimos?.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-white/60 text-sm">
                Sin datos para el periodo
              </div>
            ) : (
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="text-left text-text-secondary text-sm">
                    <th className="px-2 py-1">Fecha</th>
                    <th className="px-2 py-1">N° Guía</th>
                    <th className="px-2 py-1">Cliente</th>
                    <th className="px-2 py-1">Tipo</th>
                    <th className="px-2 py-1">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.ultimos.slice(0, 6).map((r) => (
                    <tr
                      key={r.id}
                      className="bg-neutral-800/60 hover:bg-neutral-700/40 text-white text-sm"
                    >
                      <td className="px-2 py-2 whitespace-nowrap">{r.fecha}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{r.numeroGuia}</td>
                      <td className="px-2 py-2 whitespace-nowrap" title={r.cliente}>
                        {r.cliente || "—"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {r.servicio || "—"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${estadoBadge(r.estado)}`}
                        >
                          {estadoLabel(r.estado)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <p className="text-xs text-white/50 text-center">
        Consejo: usa los botones de periodo para comparar tendencias. Pasa el mouse
        sobre los gráficos para ver valores exactos.
      </p>
    </div>
  );
}
