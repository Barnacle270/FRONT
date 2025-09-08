const EstadoMantenimientoAlert = ({ estado, porcentaje }) => {
  if (!estado) return null;

  const estilos = {
    OK: 'bg-button-success text-white',
    'POR VENCER': 'bg-yellow-600 text-white',
    VENCIDO: 'bg-button-danger text-white'
  };

  return (
    <div className={`mt-4 p-3 rounded-lg text-sm ${estilos[estado]} shadow-md`}>
      Estado de mantenimiento: <strong>{estado}</strong> — {porcentaje}% del intervalo alcanzado
    </div>
  );
};

export default EstadoMantenimientoAlert;
