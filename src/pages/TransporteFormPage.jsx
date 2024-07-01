import { useForm } from 'react-hook-form';
import { useTransporte } from '../context/TransporteContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

function TransporteFormPage() {
  const { register, handleSubmit, reset } = useForm();
  const { createTransporte, getCliente, cliente, getCamiones, camiones, errors2 } = useTransporte();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [registroExitoso, setRegistroExitoso] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await createTransporte(data);
      if (response && response.savedTransporte) {
        reset(); // Resetear el formulario
        setRegistroExitoso(true); // Mostrar mensaje de éxito
        setTimeout(() => setRegistroExitoso(false), 3000); // Ocultar el mensaje después de 3 segundos
      } else {
        console.log('Error al guardar transporte:', response);
      }
    } catch (error) {
      console.error('Error en onSubmit:', error);
    }
  });

  useEffect(() => {
    getCliente();
    getCamiones();
  }, []);

  if (cliente.length === 0) {
    return (
      <h1 className="text-center text-2xl font-bold mt-8">
        No hay servicios registrados, ir a{' '}
        <Link
          to={'/add-transporte'}
          className="px-3 py-2 mt-8 bg-indigo-500 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
        >
          Registrar servicio
        </Link>
      </h1>
    );
  }

  if (user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto bg-zinc-800 p-6 rounded-lg shadow-lg">
      {/* Mensaje de éxito */}
      {registroExitoso && (
        <div className="bg-green-500 p-2 text-white text-center my-2">
          ¡Registrado exitosamente!
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
        onSubmit={onSubmit}
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
          <input
            type="text"
            placeholder="Conductor"
            {...register("conductor")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* tipo de servicio */}
        <div className="p-2">
          <label htmlFor="tipoServicio" className="block mb-1 font-medium text-gray-300">Tipo de Servicio</label>
          <input
            type="text"
            placeholder="Tipo de Servicio"
            {...register("tipoServicio")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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

        {/* almacen de devolucion */}
        <div className="p-2">
          <label htmlFor="almacenDev" className="block mb-1 font-medium text-gray-300">Almacén de Devolución</label>
          <input
            type="text"
            placeholder="Almacén de Devolución"
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

        {/* estado */}
        <div className="p-2">
          <label htmlFor="estado" className="block mb-1 font-medium text-gray-300">Estado</label>
          <input
            type="text"
            placeholder="Estado"
            {...register("estado")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* turno */}
        <div className="p-2">
          <label htmlFor="turno" className="block mb-1 font-medium text-gray-300">Turno</label>
          <input
            type="text"
            placeholder="Turno"
            {...register("turno")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* planilla */}
        <div className="p-2">
          <label htmlFor="planilla" className="block mb-1 font-medium text-gray-300">Planilla</label>
          <input
            type="text"
            placeholder="Planilla"
            {...register("planilla")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* combustible */}
        <div className="p-2">
          <label htmlFor="combustible" className="block mb-1 font-medium text-gray-300">Combustible</label>
          <input
            type="text"
            placeholder="Combustible"
            {...register("combustible")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Botón de guardar */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center mt-4">
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-3 rounded-md shadow-lg transition duration-300 transform hover:scale-105">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransporteFormPage;