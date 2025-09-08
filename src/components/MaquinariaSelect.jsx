import { useMaquinaria } from '../hooks/useMaquinaria';

const MaquinariaSelect = ({ value, onChange }) => {
  const { maquinarias } = useMaquinaria();

  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-input text-text-primary p-2 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-focus"
    >
      <option value="">Selecciona maquinaria</option>
      {maquinarias.map((m) => (
        <option key={m._id} value={m._id}>
          {m.tipo} - {m.placa || m.numeroSerie || m.modelo}
        </option>
      ))}
    </select>
  );
};

export default MaquinariaSelect;
