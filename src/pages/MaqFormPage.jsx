import { useForm } from 'react-hook-form';
import { useMaq } from '../context/MaqContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MaqFormPage() {

  const { register, handleSubmit } = useForm()
  const { createMaqs } = useMaq()
  const navigate = useNavigate()
  const { user } = useAuth();

  console.log(user)

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createMaqs(data);
      navigate('/add-maq');
    } catch (error) {
      console.error('Error:', error);
    }
  });

  //Verificar si el usuario es admin
  if (user.role !== 'operador') {
    navigate('/');
    return null; // Evitar que el resto del componente se renderice si el usuario no es admin
  }

  return (
    <div className="container mx-auto bg-transparent">
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="p-2">
          <label htmlFor="numeroControl">CT</label>
          <input
            type="text"
            placeholder="numeroControl"
            {...register("numeroControl")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
            autoFocus
          />
        </div>
        <div className="p-2">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            placeholder="fecha"
            {...register("fecha")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        <div className="p-2">
          <label htmlFor="cliente">Cliente</label>
          <input
            type="text"
            placeholder="cliente"
            {...register("cliente")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        {/* Agrega más divs para otros campos de formulario */}
        {/* Por ejemplo: */}
        <div className="p-2">
          <label htmlFor="almacen">Almacen</label>
          <input
            type="text"
            placeholder="almacen"
            {...register("almacen")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        {/* Agrega más divs para otros campos de formulario */}
        {/* Por ejemplo: */}
        <div className="p-2">
          <label htmlFor="maquina">Maquina</label>
          <input
            type="text"
            placeholder="maquina"
            {...register("maquina")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        {/* Continúa agregando más divs para otros campos de formulario */}

        <div className="p-2">
          <label htmlFor="operador">Operador</label>
          <input
            type="text"
            placeholder="operador"
            {...register("operador")}
            value={user.name}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        <div className="p-2">
          <label htmlFor="turno">Turno</label>
          <select
            {...register("turno")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          >
            <option value="">Seleccione un turno...</option>
            <option value="dia">Día</option>
            <option value="noche">Noche</option>
          </select>
        </div>
        <div className="p-2">
          <label htmlFor="serviceType">Tipo de servicio</label>
          <input
            type="text"
            placeholder="Tipo de servicio"
            {...register("serviceType")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        <div className="p-2">
          <label htmlFor="inicio">Inicio</label>
          <input
            type="text"
            placeholder="inicio"
            {...register("inicio")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        <div className="p-2">
          <label htmlFor="fin">Fin</label>
          <input
            type="text"
            placeholder="fin"
            {...register("fin")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        <div className="p-2">
          <label htmlFor="total">Total</label>
          <input
            type="text"
            placeholder="total"
            {...register("total")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>
        <div className="p-2">
          <label htmlFor="tarifa">Tarifa</label>
          <input
            type="text"
            placeholder="tarifa"
            {...register("tarifa")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2"
          />
        </div>

        <br />

        <button className="bg-indigo-500 px-3 py-2 rounded-md">Save</button>

        <br />

      </form>
    </div>
  )
}

export default MaqFormPage;