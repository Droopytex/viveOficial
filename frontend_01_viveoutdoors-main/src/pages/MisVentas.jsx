import { useState, useEffect } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MisVentas = () => {
  const URL = import.meta.env.VITE_URL;
  //const navigate = useNavigate();
  const [ventas, setVentas] = useState([]); //inicialmente es un arreglo vacío

  const obtenerVentas = async () => {
    try {
      const response = await axios.get(URL + "/ventas");
      //   console.log("respuesta obtendida : " response);
      setVentas(response.data.getVentas || []);
      console.log(
        "Ventas obtenidas respuesta del axios:",
        response.data.getVentas
      );
      console.log("Ventas almacenadas en variable: ", ventas);
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }
  };
  // Función para obtener datos desde el backend
  useEffect(() => {
    // se ejecuta después del primer renderizado del componente.
    obtenerVentas();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Ventas</h2>
      </div>

      <Row>
        {Array.isArray(ventas) && ventas.length > 0 ? (
          ventas.map((venta) => (
            <Col key={venta.n_pedido} sm={12} md={12} lg={12} className="mb-4">
              <Card>
                <Row className="g-0">
                  <Col md={6}>
                    <Card.Body>
                      <Card.Title>
                        Número de pedido: {venta.n_pedido}
                      </Card.Title>
                      <Card.Text>Fecha del pedido:</Card.Text>
                      <Card.Text> {venta.fecha_pedido}</Card.Text>

                      <h5>
                        {" "}
                        <Badge bg="danger">
                          Total del pedido: {venta.total}
                        </Badge>
                      </h5>
                    </Card.Body>
                  </Col>
                  <Col md={6}>
                    <Card.Body>
                      <Card.Text>
                        Nombre de Cliente: {venta.nombre} {venta.apellido}{" "}
                      </Card.Text>
                      <Card.Text>Email: {venta.email}</Card.Text>
                      <Card.Text>Teléfono: {venta.teléfono}</Card.Text>
                      <Card.Text>
                        Dirección: {venta.dirección} {venta.ciudad}
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <p>No hay publicaciones disponibles.</p>
        )}
      </Row>
    </div>
  );
};
export default MisVentas;
