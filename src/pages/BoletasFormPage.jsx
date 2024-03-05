import { useState } from 'react'; // Importa useState
import { useForm } from 'react-hook-form';

//import { useTask } from '../context/TaskContext';
import { useBoleta } from '../context/BoletasContext'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function BoletasFormPage() {

  const { register, handleSubmit } = useForm()
  const { createBoletas } = useBoleta()
  const navigate = useNavigate()
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null); // Estado local para almacenar la imagen seleccionada

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); // Actualiza el estado con el archivo seleccionado
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('dni', data.dni);
    formData.append('mes', data.mes);
    formData.append('year', data.year);
    formData.append('image', selectedImage); // Agrega la imagen al FormData

    try {
      await createBoletas(formData);
      navigate('/boletas');
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Verificar si el usuario es admin
  if (user.role !== 'admin') {
    navigate('/boletas');
    return null; // Evitar que el resto del componente se renderice si el usuario no es admin
  }

  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>

        <form onSubmit={onSubmit} encType="multipart/form-data" >
          <label htmlFor="dni">DNI</label>
          <input
            type="text"
            placeholder="dni"
            {...register("dni")}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2'
            autoFocus
          />

          <label htmlFor="mes">Mes</label>
          <select
            rows="3"
            placeholder="mes"
            {...register("mes")}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2'
          >
            <option value="Enero">Enero</option>
            <option value="Febrero">Febrero</option>
            <option value="Marzo">Marzo</option>
            <option value="Abril">Abril</option>
            <option value="Mayo">Mayo</option>
            <option value="Junio">Junio</option>
            <option value="Julio">Julio</option>
            <option value="Agosto">Agosto</option>
            <option value="Septiembre">Septiembre</option>
            <option value="Octubre">Octubre</option>
            <option value="Noviembre">Noviembre</option>
            <option value="Diciembre">Diciembre</option>
          </select>

          <label htmlFor="year">Año</label>
          <select
            rows="3"
            placeholder="año"
            {...register("year")}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2'
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          <label htmlFor="image">Archivo</label>
          <input
            type="file" name="image"
            onChange={handleImageChange} // Maneja el cambio de la imagen
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-mb my-2'
          />

          <button className='bg-indigo-500 px-3 py-2 rounded-md'>Save</button>
        </form>
      </div>
    </div>
  )
}
export default BoletasFormPage