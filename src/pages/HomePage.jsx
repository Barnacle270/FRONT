import { useAuth } from "../context/AuthContext";

function HomePage() {

  const { user } = useAuth();

  return (
    <div className="bg-blue-500 text-white p-4 rounded-md shadow-md flex items-center justify-center">
    <p className="text-center">
      <span className="text-xl">Bienvenido</span> <span className="text-lg font-bold">{user.name}</span>
    </p>
  </div>
  
  )
}

export default HomePage