import { useEffect } from "react"
import { useBoleta } from "../context/BoletasContext"
import BoletaCard from "../components/BoletaCard"

function BoletaPage() {
  const { getBoletas, boletas } = useBoleta()
  useEffect(() => {
    getBoletas()
  }, [])
  if (boletas.length === 0) return (<h1>No tasks</h1>)
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
      {
        boletas.map((boleta) => (
          <BoletaCard key={boleta._id} boleta={boleta} />
        ))
      }
    </div>
  )
}
export default BoletaPage