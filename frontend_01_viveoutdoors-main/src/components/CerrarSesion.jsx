import { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import axios from "axios";

const CerrarSesion = () => {
  const URL = import.meta.env.VITE_URL;
  useEffect(() => {
    const realizarLogout = async () => {
      try {
        const respuesta = await axios.post(URL + "/logout");
        console.log("Respuesta del backend:", respuesta.data);
        // Borrar el token del localStorage al cerrar sesión
        localStorage.removeItem("token");
        // Borrar los datos del carrito del localStorage al cerrar sesión
        localStorage.removeItem("carrito");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };
    realizarLogout();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  return (
    <>
      <Card>
        <Card.Body className="text-center  flex-column">
          <Card.Title>Has cerrado sesión correctamente</Card.Title>

          <Button
            variant="warning"
            onClick={() => (window.location.href = "/tienda")}
          >
            Sigue revisando nuestra tienda
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default CerrarSesion;
