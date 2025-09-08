import { useAuth } from "../context/AuthContext";

function GeneralPage() {
  const { user } = useAuth();

  return (
    <section className="p-6 space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">
          Bienvenido{user ? `, ${user.username}` : ""} 👋
        </h1>
        <p className="text-sm mt-2">
          Aquí encontrarás información general sobre tu trabajo.
        </p>
      </div>

    </section>
  );
}

export default GeneralPage;
