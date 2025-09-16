// utils/permissions.js
import {
  FaFileAlt,
  FaTruck,
  FaChartBar,
  FaUsers,
  FaUserTie,
  FaReceipt,
  FaTools,
  FaCogs,
  FaClipboardList,
  FaTachometerAlt,
} from "react-icons/fa";

export const permissions = {
  Superadministrador: {
    routes: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: FaTachometerAlt,
        children: [
          { path: "/home", label: "Transporte", icon: FaTruck },
          { path: "/profile", label: "Perfil", icon: FaUserTie },
        ],
      },
      {
        id: "servicios",
        label: "Servicios",
        icon: FaFileAlt,
        children: [
          { path: "/servicios", label: "Importar XML", icon: FaFileAlt },
          { path: "/historial", label: "Historial de Servicios", icon: FaFileAlt },
          { path: "/recepcion-facturas", label: "Recepción Guías", icon: FaFileAlt },
        ],
      },
      {
        id: "devoluciones",
        label: "Devoluciones",
        icon: FaTruck,
        children: [
          { path: "/devoluciones", label: "Ver pendientes", icon: FaTruck },
        ],
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: FaChartBar,
        children: [
          { path: "/reportes", label: "Reporte de Servicios", icon: FaChartBar },
          { path: "/reportes/pendientes-facturar", label: "Pendientes Facturar", icon: FaFileAlt },
        ],
      },
      {
        id: "boletas",
        label: "Boletas",
        icon: FaReceipt,
        children: [
          { path: "/boletas", label: "Mis Boletas", icon: FaReceipt },
          { path: "/add-boletas", label: "Agregar Boleta", icon: FaReceipt },
        ],
      },
      {
        id: "datos",
        label: "Datos",
        icon: FaUsers,
        children: [
          { path: "/clientes", label: "Clientes", icon: FaUsers },
          { path: "/conductores", label: "Conductores", icon: FaUserTie },
        ],
      },
      {
        id: "mantenimiento",
        label: "Mantenimiento",
        icon: FaTools,
        children: [
          { path: "/maquinarias", label: "Maquinarias", icon: FaCogs },
          { path: "/lecturas", label: "Lecturas", icon: FaClipboardList },
          { path: "/mantenimientos", label: "Mantenimientos", icon: FaTools },
          { path: "/mantenimiento-pendiente", label: "Mantenimientos Vencidos", icon: FaFileAlt },
        ],
      },
      {
        id: "admin",
        label: "Admin",
        icon: FaUserTie,
        children: [
          { path: "/usuarios", label: "Gestionar Usuarios", icon: FaUsers },
          { path: "/configuracion", label: "Configuración", icon: FaChartBar },
        ],
      },
    ],
    actions: ["view", "edit", "delete", "create"],
  },

  Coordinador: {
    routes: [
      {
        id: "servicios",
        label: "Servicios",
        icon: FaFileAlt,
        children: [
          { path: "/servicios", label: "Importar XML", icon: FaFileAlt },
          { path: "/historial", label: "Historial de Servicios", icon: FaFileAlt },
        ],
      },
      {
        id: "devoluciones",
        label: "Devoluciones",
        icon: FaTruck,
        children: [
          { path: "/devoluciones", label: "Ver pendientes", icon: FaTruck },
        ],
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: FaChartBar,
        children: [
          { path: "/reportes", label: "Reporte de Servicios", icon: FaChartBar },
        ],
      },
      {
        id: "boletas",
        label: "Boletas",
        icon: FaReceipt,
        children: [
          { path: "/boletas", label: "Mis Boletas", icon: FaReceipt },
        ],
      },
    ],
    actions: ["view", "edit", "create"],
  },

  User: {
    routes: [
      {
        id: "boletas",
        label: "Boletas",
        icon: FaReceipt,
        children: [
          { path: "/boletas", label: "Mis Boletas", icon: FaReceipt },
        ],
      },
    ],
    actions: ["view"],
  },
};

//
// 🔧 Helpers
//
export function canAccess(user, path) {
  if (!user) return false;
  const allowed = permissions[user.role]?.routes || [];

  // Verifica rutas y subrutas
  return allowed.some((menu) =>
    menu.children?.some(
      (child) => path === child.path || path.startsWith(child.path)
    )
  );
}

export function canDo(user, action) {
  if (!user) return false;
  return permissions[user.role]?.actions.includes(action);
}
