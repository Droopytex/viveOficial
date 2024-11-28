import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles.css";

const CategorySacos = () => {
  const URL = import.meta.env.VITE_URL;
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(URL + "/productos");
        // Filtrar solo los productos de la categoría "Sacos"
        const sacos = response.data.filter(
          (producto) => producto.categoria === "Sacos"
        );

        setProductos(sacos);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        alert(
          "Hubo un problema al cargar los productos. Intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  });

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center">Categoría: Sacos</h1>
      <div className="row">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div className="col-12 col-md-4 mb-4" key={producto.id}>
              <div className="card">
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.titulo}
                />
                <div className="card-body">
                  <h5 className="card-title">{producto.titulo}</h5>
                  <p className="card-text">
                    {producto.detalle.substring(0, 100)}...
                  </p>
                  <h6 className="font-weight-bold">{producto.precio}</h6>
                  <Link
                    to={`/detalle/${producto.id}`} // Navegación a la página de detalles
                    className="btn btn-primary"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default CategorySacos;
