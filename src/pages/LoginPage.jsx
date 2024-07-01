import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function LoginPage() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { signin, errors: signinErrors, isAuthenticated } = useAuth();

  console.log(signinErrors)

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data)
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/")

  }, [isAuthenticated]);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {
          signinErrors.map((error, i) => (
            <div key={i} className='bg-red-500 p-2 text-white text-center my-2'>{error}</div>
          ))
        }
        <h1 className="text-2xl font-bold">Login</h1>
        <form
          onSubmit={onSubmit}
        >
          <input type="text" {...register("dni", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='DNI'
          />
          {errors.dni && <p className='text-red-500'>Porfavor ingrese un correo</p>}
          <input type="password" {...register("password", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Password'
          />
          {errors.password && <p className='text-red-500'>Porfavor ingrese una contraseña</p>}
          <button className="bg-sky-500 text-white px-4 py-2 rounded-md my-2" type="submit">Login</button>
        </form>

      </div>
    </div>
  )
}

export default LoginPage