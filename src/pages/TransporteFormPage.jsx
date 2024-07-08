import { useForm } from 'react-hook-form';
import { useTransporte } from '../context/TransporteContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function TransporteFormPage() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { createTransporte, updateTransporte, getTransporteById, getCliente, getCamiones, getConductores, cliente, camiones, conductores, errors2 } = useTransporte();
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = useParams(); // Obtener el ID de la URL si es una edición
  const [mensajeExito, setMensajeExito] = useState(null);


  const handleUpdateTransporte = async (data) => {
    try {
      await updateTransporte(params.id, {
        ...data,
        fechat: dayjs(data.fechat).utc().format(),
      });
      //mostrar mensaje de exito por 2 segundos y luero redireccionar
      setMensajeExito('¡Operación de actualización realizada con éxito!');
      setTimeout(() => {
        setMensajeExito(null);
        navigate('/transporte');
      }, 1000);
    } catch (error) {
      console.error('Error en la actualización:', error);
    }
  };

  // Función para manejar la creación de un nuevo transporte
  const handleCreateTransporte = async (data) => {
    try {
      await createTransporte({
        ...data,
        fechat: dayjs(data.fechat).utc().format(),
      });

      //mostrar mensaje de exito por 2 segundos y luero resetear
      setMensajeExito('¡Operación de creación realizada con éxito!');
      setTimeout(() => {
        setMensajeExito(null);
      }
        , 4000);
      reset();
    } catch (error) {
      console.error('Error en la creación:', error);
    }
  };

  const onSubmit = (data) => {
    if (params.id) {
      handleUpdateTransporte(data);
    } else {
      handleCreateTransporte(data);
    }
  };


  useEffect(() => {
    const loadTransporte = async () => {
      if (params.id) {
        const transporte = await getTransporteById(params.id);
        setValue('fechat', dayjs(transporte.fechat).format('YYYY-MM-DD'));
        setValue('cliente', transporte.cliente);
        setValue('puntoPartida', transporte.puntoPartida);
        setValue('puntoDestino', transporte.puntoDestino);
        setValue('guiaRemitente', transporte.guiaRemitente);
        setValue('guiaTransportista', transporte.guiaTransportista);
        setValue('placa', transporte.placa);
        setValue('conductor', transporte.conductor);
        setValue('tipoServicio', transporte.tipoServicio);
        setValue('detalle', transporte.detalle);
        setValue('estado', transporte.estado);
        setValue('turno', transporte.turno);
      }
    };

    loadTransporte();
    getCliente();
    getCamiones();
    getConductores();
  }, []); // Asegúrate de incluir id en la dependencia para que se vuelva a cargar cuando cambie

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
            type="date"
            placeholder="Fecha"
            {...register("fechat")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Select input for Cliente */}
        <div className="p-2">
          <label htmlFor="cliente" className="block mb-1 font-medium text-gray-300">Cliente</label>
          <select
            {...register("cliente")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione un cliente</option>
            {cliente.map((client) => (
              <option key={client._id} value={client.rz}>{client.rz}</option>
            ))}
          </select>
        </div>

        {/* punto de partida */}
        <div className="p-2">
          <label htmlFor="puntoPartida" className="block mb-1 font-medium text-gray-300">Punto de Partida</label>
          <input
            type="text"
            placeholder="Punto de Partida"
            {...register("puntoPartida")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* punto de destino */}
        <div className="p-2">
          <label htmlFor="puntoDestino" className="block mb-1 font-medium text-gray-300">Punto de Destino</label>
          <input
            type="text"
            placeholder="Punto de Destino"
            {...register("puntoDestino")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* guia del remitente */}
        <div className="p-2">
          <label htmlFor="guiaRemitente" className="block mb-1 font-medium text-gray-300">Guía del Remitente</label>
          <input
            type="text"
            placeholder="Guía del Remitente"
            {...register("guiaRemitente")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* guia del transportista */}
        <div className="p-2">
          <label htmlFor="guiaTransportista" className="block mb-1 font-medium text-gray-300">Guía del Transportista</label>
          <input
            type="text"
            placeholder="Guía del Transportista"
            {...register("guiaTransportista")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Select input for Placa de Camión */}
        <div className="p-2">
          <label htmlFor="placa" className="block mb-1 font-medium text-gray-300">Placa de Camión</label>
          <select
            {...register("placa")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione una placa</option>
            {camiones.map((camion) => (
              <option key={camion._id} value={camion.placa}>{camion.placa}</option>
            ))}
          </select>
        </div>

        {/* conductor */}
        <div className="p-2">
          <label htmlFor="conductor" className="block mb-1 font-medium text-gray-300">Conductor</label>
          <select
            {...register("conductor")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione una conductor</option>
            {conductores.map((conductor) => (
              <option key={conductor._id} value={conductor.nombrec}>{conductor.nombrec}</option>
            ))}
          </select>
        </div>

        {/* tipo de servicio / select*/}
        <div className="p-2">
          <label htmlFor="tipoServicio" className="block mb-1 font-medium text-gray-300">Tipo de Servicio</label>
          <select
            {...register("tipoServicio")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione un tipo de servicio</option>
            <option value="RETIRO">RETIRO</option>
            <option value="SERVICIO">SERVICIO</option>
            <option value="DEVOLUCION">DEVOLUCION</option>
            <option value="ASIGNACION">ASIGNACION</option>
            <option value="EXPORTACION">EXPORTACION</option>
            <option value="CARGA SUELTA">CARGA SUELTA</option>
            <option value="TOLVA">TOLVA</option>
          </select>
        </div>



        {/* detalle */}
        <div className="p-2">
          <label htmlFor="detalle" className="block mb-1 font-medium text-gray-300">Detalle</label>
          <input
            type="text"
            placeholder="Detalle"
            {...register("detalle")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* turno SELECT */ }

        <div className="p-2">
          <label htmlFor="turno" className="block mb-1 font-medium text-gray-300">Turno</label>
          <select
            {...register("turno")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          >
            <option value="">Seleccione un turno</option>
            <option value="NORMAL">NORMAL</option>
            <option value="F. HORA">F. HORA</option>
          </select>
        </div>


        {/* estado */}
        <div className="p-2">
          <label htmlFor="estado" className="block mb-1 font-medium text-gray-300">Estado</label>
          <input
            type="text"
            placeholder="Estado"
            disabled
            {...register("estado")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Botón de guardar */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center mt-2">
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-105">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransporteFormPage;