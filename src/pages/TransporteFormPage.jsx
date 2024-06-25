import { useForm } from 'react-hook-form';

import { useTransporte } from '../context/TransporteContext';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TransporteFormPage() {

  const { register, handleSubmit } = useForm()

  const { createTransporte } = useTransporte()

  const navigate = useNavigate()
  const { user } = useAuth();

  console.log(user)

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createTransporte(data);
      navigate('/add-transporte');
    } catch (error) {
      console.error('Error:', error);
    }
  });

  //Verificar si el usuario es admin
  if (user.role !== 'admin') {
    navigate('/');
    return null; // Evitar que el resto del componente se renderice si el usuario no es admin
  }

  return (
    <div className="container mx-auto bg-zinc-800 p-6 rounded-lg shadow-lg">
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { id: "fecha", label: "Fecha", type: "date" },
          { id: "cliente", label: "Cliente", type: "text" },
          { id: "puntoPartida", label: "Punto de Partida", type: "text" },
          { id: "puntoDestino", label: "Punto de Destino", type: "text" },
          { id: "guiaRemitente", label: "Guía del Remitente", type: "text" },
          { id: "guiaTransportista", label: "Guía del Transportista", type: "text" },
          { id: "placa", label: "Placa", type: "text" },
          { id: "conductor", label: "Conductor", type: "text" },
          { id: "tipoServicio", label: "Tipo de Servicio", type: "text" },
          { id: "detalle", label: "Detalle", type: "text" },
          { id: "almacenDev", label: "Almacén de Devolución", type: "text" },
          { id: "comprobanteDev", label: "Comprobante de Devolución", type: "text" },
          { id: "estado", label: "Estado", type: "text" },
          { id: "turno", label: "Turno", type: "text" },
          { id: "planilla", label: "Planilla", type: "text" },
          { id: "combustible", label: "Combustible", type: "text" },
        ].map((field) => (
          <div className="p-2" key={field.id}>
            <label htmlFor={field.id} className="block mb-1 font-medium text-gray-300">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.label}
              {...register(field.id)}
              className="w-full  bg-zinc-700 text-white px-4 py-2 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

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