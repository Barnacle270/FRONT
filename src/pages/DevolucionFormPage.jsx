import { useForm } from 'react-hook-form';
import { useTransporte } from '../context/TransporteContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function DevolucionFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { updateDevoluciones, getDevolucionesById, getCamiones, getConductores, errors2, camiones, conductores } = useTransporte();
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = useParams(); // Obtener el ID de la URL si es una edición
  const [mensajeExito, setMensajeExito] = useState(null);
  const [devuelto, setDevuelto] = useState(false); // Estado del checkbox
  const [estadoInicial, setEstadoInicial] = useState('PENDIENTE'); // Estado inicial del formulario

  const handleUpdateDevoluciones = async (data) => {
    try {
      const estadoFinal = devuelto ? 'DEVUELTO' : estadoInicial;
      await updateDevoluciones(params.id, {
        ...data,
        fechat: dayjs(data.fechat).utc().format(), // Formato correcto para MongoDB
        fechaVen: dayjs(data.fechaVen).utc().format(), // Formato correcto para MongoDB
        fechaDev: dayjs(data.fechaDev).utc().format(), // Formato correcto para MongoDB
        estado: estadoFinal, // Usar el estadoFinal calculado
      });
      // Mostrar mensaje de éxito por 2 segundos y luego redireccionar
      setMensajeExito('¡Operación de actualización realizada con éxito!');
      setTimeout(() => {
        setMensajeExito(null);
        navigate('/contenedores');
      }, 2000);
    } catch (error) {
      console.error('Error en la actualización:', error);
    }
  };

  const onSubmit = (data) => {
    if (params.id) {
      handleUpdateDevoluciones(data);
    }
  };

  const handleChangeDevuelto = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const confirmacion = window.confirm('¿Estás seguro que quieres cambiar el estado del contenedor a "DEVUELTO"?');
      if (confirmacion) {
        setDevuelto(true);
      } else {
        e.preventDefault(); // Evita marcar el checkbox si se cancela
      }
    } else {
      setDevuelto(false);
    }
  };

  useEffect(() => {
    const loadDevoluciones = async () => {
      if (params.id) {
        const devoluciones = await getDevolucionesById(params.id);
        setValue('fechat', dayjs(devoluciones.fechat).format('YYYY-MM-DD'));
        setValue('fechaVen', dayjs(devoluciones.fechaVen).format('YYYY-MM-DD'));
        setValue('cliente', devoluciones.cliente);
        setValue('detalle', devoluciones.detalle);
        setValue('almacenDev', devoluciones.almacenDev);
        setValue('comprobanteDev', devoluciones.comprobanteDev);
        setValue('fechaDev', dayjs(devoluciones.fechaDev).format('YYYY-MM-DD'));
        setValue('conductorDev', devoluciones.conductorDev);
        setValue('placaDev', devoluciones.placaDev);
        setValue('estado', devoluciones.estado);

        // Asignar el estado del checkbox
        setDevuelto(devoluciones.estado === 'DEVUELTO');
        setEstadoInicial(devoluciones.estado); // Guardar el estado inicial
      }
    };

    loadDevoluciones();
    getCamiones();
    getConductores();
  }, [params.id]); // Asegúrate de incluir id en la dependencia para que se vuelva a cargar cuando cambie

  if (user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto bg-zinc-800 p-6 rounded-lg shadow-lg">
      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="bg-green-500 p-2 text-white text-center my-2">
          {mensajeExito}
        </div>
      )}

      {/* Mensajes de error */}
      {Array.isArray(errors2) &&
        errors2.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 text-white text-center my-2">
            {error}
          </div>
        ))}

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >

        {/* fecha */}
        <div className="p-2">
          <label htmlFor="fechat" className="block mb-1 font-medium text-gray-300">Fecha</label>
          <input
            disabled
            type="date"
            placeholder="Fecha"
            {...register("fechat")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* fecha de vencimiento */}
        <div className="p-2">
          <label htmlFor="fechaVen" className="block mb-1 font-medium text-gray-300">Fecha de Vencimiento</label>
          <input
            required
            type="date"
            placeholder="Fecha de Vencimiento"
            {...register("fechaVen")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* cliente */}
        <div className="p-2">
          <label htmlFor="cliente" className="block mb-1 font-medium text-gray-300">Cliente</label>
          <input
            disabled
            type="text"
            placeholder="Cliente"
            {...register("cliente")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* detalle */}
        <div className="p-2">
          <label htmlFor="detalle" className="block mb-1 font-medium text-gray-300">Detalle</label>
          <input
            disabled
            type="text"
            placeholder="Detalle"
            {...register("detalle")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* almacen de devolucion */}
        <div className="p-2">
          <label htmlFor="almacenDev" className="block mb-1 font-medium text-gray-300">Almacen de Devolución</label>
          <input
            required
            type="text"
            placeholder="Almacen de Devolución"
            {...register("almacenDev")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* comprobante de devolucion */}
        <div className="p-2">
          <label htmlFor="comprobanteDev" className="block mb-1 font-medium text-gray-300">Comprobante de Devolución</label>
          <input
            type="text"
            placeholder="Comprobante de Devolución"
            {...register("comprobanteDev")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* fecha de devolucion */}
        <div className="p-2">
          <label htmlFor="fechaDev" className="block mb-1 font-medium text-gray-300">Fecha de Devolución</label>
          <input
            required
            type="date"
            placeholder="Fecha de Devolución"
            {...register("fechaDev")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* conductor */}
        <div className="p-2">
          <label htmlFor="conductorDev" className="block mb-1 font-medium text-gray-300">Conductor</label>
          <select
            required
            {...register("conductorDev")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione una conductor</option>
            {conductores.map((conductor) => (
              <option key={conductor._id} value={conductor.nombrec}>{conductor.nombrec}</option>
            ))}
          </select>
        </div>

        {/* Select input for Placa de Camión */}
        <div className="p-2">
          <label htmlFor="placaDev" className="block mb-1 font-medium text-gray-300">Placa de Camión</label>
          <select
            required
            {...register("placaDev")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione una Placa de Camión</option>
            {camiones.map((camion) => (
              <option key={camion._id} value={camion.placa}>{camion.placa}</option>
            ))}
          </select>
        </div>

        {/* Checkbox para Devuelto */}
        <div className="p-2">
          <label className="block mb-1 font-medium text-gray-300">¿Devuelto?</label>
          <input
            type="checkbox"
            checked={devuelto}
            onChange={handleChangeDevuelto}
            className="mr-2"
          />
        </div>

        {/* Botones de acción */}
        <div className="col-span-2 lg:col-span-4 p-2">
          <button
            type="submit"
            className="w-full bg-highlight text-white py-2 px-4 rounded-md hover:bg-focus focus:outline-none focus:bg-focus"
          >
            Actualizar Devolución
          </button>
        </div>
      </form>
    </div>
  );
}

export default DevolucionFormPage;
