import { useState, useEffect } from 'react';
import { useMaquinaria } from '../../context/MaquinariaContext';
import { toast } from 'react-hot-toast';

const tipos = ['CARGADOR FRONTAL', 'STACKER', 'CAMIÓN', 'MONTACARGAS', 'OTRO'];
const unidades = ['HORAS', 'KILOMETROS'];
const estados = ['ACTIVO', 'INACTIVO', 'EN TALLER'];

const MaquinariaModal = ({ isOpen, onClose, maquinaria }) => {
  const { createMaquinaria, updateMaquinaria } = useMaquinaria();

  const [form, setForm] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    placa: '',
    anio: '',
    ubicacion: '',
    unidadMedida: 'HORAS',
    lecturaActual: 0,
    estado: 'ACTIVO',
    mantenimientos: [],
  });

  useEffect(() => {
    if (maquinaria) {
      setForm({
        ...maquinaria,
        mantenimientos: maquinaria.mantenimientos || [],
      });
    } else {
      setForm({
        tipo: '',
        marca: '',
        modelo: '',
        numeroSerie: '',
        placa: '',
        anio: '',
        ubicacion: '',
        unidadMedida: 'HORAS',
        lecturaActual: 0,
        estado: 'ACTIVO',
        mantenimientos: [],
      });
    }
  }, [maquinaria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMantenimientoChange = (index, field, value) => {
    const nuevos = [...form.mantenimientos];
    nuevos[index][field] = value;
    setForm((prev) => ({ ...prev, mantenimientos: nuevos }));
  };

  const agregarMantenimiento = () => {
    setForm((prev) => ({
      ...prev,
      mantenimientos: [
        ...prev.mantenimientos,
        { nombre: '', frecuencia: '', unidad: 'HORAS', ultimaLectura: 0 },
      ],
    }));
  };

  const quitarMantenimiento = (index) => {
    const nuevos = [...form.mantenimientos];
    nuevos.splice(index, 1);
    setForm((prev) => ({ ...prev, mantenimientos: nuevos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tipo || !form.unidadMedida) {
      toast.error('Completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      ...form,
      anio: form.anio ? Number(form.anio) : undefined,
      lecturaActual: Number(form.lecturaActual),
      mantenimientos: form.mantenimientos.map((m) => ({
        ...m,
        frecuencia: Number(m.frecuencia),
        ultimaLectura: Number(m.ultimaLectura || 0),
      })),
    };

    try {
      if (maquinaria) {
        await updateMaquinaria(maquinaria._id, payload);
        toast.success('Maquinaria actualizada correctamente');
      } else {
        await createMaquinaria(payload);
        toast.success('Maquinaria registrada correctamente');
      }
      onClose();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al guardar maquinaria';
      toast.error(mensaje);
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-surface text-text-primary rounded-lg p-6 w-full max-w-2xl animate-fade-in shadow-lg overflow-y-auto max-h-[95vh]">
        <h2 className="text-xl font-semibold mb-4">
          {maquinaria ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select name="tipo" value={form.tipo} onChange={handleChange}
            className="w-full bg-input text-text-primary p-2 rounded border border-neutral-700" required>
            <option value="">Selecciona tipo</option>
            {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <input name="marca" placeholder="Marca" value={form.marca || ''} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700" />
          <input name="modelo" placeholder="Modelo" value={form.modelo || ''} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700" />
          <input name="numeroSerie" placeholder="N° Serie" value={form.numeroSerie || ''} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700" />
          <input name="placa" placeholder="Placa" value={form.placa || ''} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700" />
          <input type="number" name="anio" placeholder="Año" value={form.anio || ''} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700" />
          <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion || ''} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700" />

          <select name="unidadMedida" value={form.unidadMedida} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700">
            {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <select name="estado" value={form.estado} onChange={handleChange}
            className="w-full bg-input p-2 rounded border border-neutral-700">
            {estados.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>

          {/* Tipos de mantenimiento */}
          <div className="mt-4 border-t border-neutral-600 pt-4">
            <h3 className="font-semibold mb-2">Mantenimientos</h3>
            {form.mantenimientos.map((m, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center mb-2">
                <input
                  placeholder="Nombre"
                  value={m.nombre}
                  onChange={(e) => handleMantenimientoChange(index, 'nombre', e.target.value)}
                  className="bg-input p-2 rounded border border-neutral-700"
                />
                <input
                  type="number"
                  placeholder="Frecuencia"
                  value={m.frecuencia}
                  onChange={(e) => handleMantenimientoChange(index, 'frecuencia', e.target.value)}
                  className="bg-input p-2 rounded border border-neutral-700"
                />
                <select
                  value={m.unidad}
                  onChange={(e) => handleMantenimientoChange(index, 'unidad', e.target.value)}
                  className="bg-input p-2 rounded border border-neutral-700"
                >
                  {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <input disabled
                  type="number"
                  placeholder="Última lectura"
                  value={m.ultimaLectura}
                  onChange={(e) => handleMantenimientoChange(index, 'ultimaLectura', e.target.value)}
                  className="bg-input p-2 rounded border border-neutral-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    const confirmacion = window.prompt(`⚠️ ¿Estás seguro que deseas eliminar este mantenimiento?\n\nEscribe la placa del equipo (${form.placa}) para confirmar:`);

                    if (confirmacion === form.placa) {
                      quitarMantenimiento(index);
                      toast.success('Mantenimiento eliminado');
                    } else if (confirmacion !== null) {
                      toast.error('Placa incorrecta. No se eliminó el mantenimiento.');
                    }
                  }}
                  className="text-red-400 hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={agregarMantenimiento}
              className="mt-2 text-sm bg-button-secondary text-black px-3 py-1 rounded hover:bg-neutral-300">
              + Agregar Mantenimiento
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose}
              className="bg-button-secondary text-black px-4 py-2 rounded hover:bg-neutral-300">
              Cancelar
            </button>
            <button type="submit"
              className="bg-button-primary text-white px-4 py-2 rounded hover:bg-blue-600">
              {maquinaria ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaquinariaModal;
