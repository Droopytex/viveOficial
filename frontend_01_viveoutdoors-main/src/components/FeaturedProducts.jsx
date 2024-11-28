import { Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const FeaturedProducts = () => {
  const URL = import.meta.env.VITE_URL;
  const [salesHome, setSalesHome] = useState([]); //inicialmente es un arreglo vacío

  const obtenerSalesHome = async () => {
    try {
      const response = await axios.get(URL + "/saleshome");
      setSalesHome(response.data || []);
      console.log("Productos sales obtenidos para el Home:", response.data);
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }
  };
  // Función para obtener datos desde el backend
  useEffect(() => {
    // se ejecuta después del primer renderizado del componente.
    obtenerSalesHome();
  }, []);

  return (
    <div className="mt-4 text-center">
      <h2>Productos Destacados</h2>
      <Row>
        <Col md={12}>
          <Row lg={4} md={4} sm={12}>
            {Array.isArray(salesHome) && salesHome.length > 0 ? (
              salesHome.map((producto) => (
                <Col key={producto.id_producto} className="mb-3">
                  <Card
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Card.Img
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100px",
                        margin: "0px",
                      }}
                      src={producto.imagen_url}
                    />
                    <Card.Body
                      style={{
                        padding: "10px",
                        flex: "1", //ocupa el espacio restante de la card
                        display: "flex",
                        flexDirection: "column", // organización vertical
                        justifyContent: "space-between", // distribución uniforme dentro del card
                      }}
                    >
                      {producto.producto_estado === "activo" && (
                        <h6 style={{ marginTop: "5px" }}>
                          <Badge bg="danger">SALE</Badge>
                        </h6>
                      )}
                      <Card.Text style={{ margin: "5px 0", fontSize: "13px" }}>
                        {producto.categoria_nombre}
                      </Card.Text>
                      <Card.Title style={{ fontSize: "16px" }}>
                        {producto.producto_nombre}
                      </Card.Title>
                      <Card.Text style={{ margin: "5px 0" }}>
                        {" "}
                        ${producto.precio}
                      </Card.Text>

                      <Button
                        style={{
                          width: "100%", // Botón ocupa todo el ancho
                          margin: "0 auto",
                          whiteSpace: "nowrap", // Evita que el texto del botón se corte
                          fontSize: "14px",
                        }}
                        variant="outline-warning text-black"
                        onClick={() => (window.location.href = "/tienda")}
                      >
                        Ver más
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No hay publicaciones disponibles.</p>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturedProducts;
