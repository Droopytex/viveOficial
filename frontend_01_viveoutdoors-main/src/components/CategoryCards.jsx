import { Row, Col, Button, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const CategoryCards = () => {
  const URL = import.meta.env.VITE_URL;
  const [productosCategoria, setProductosCategoria] = useState([]); //inicialmente es un arreglo vacío

  const obtenerCategoryCards = async () => {
    try {
      const response = await axios.get(URL + "/categoriashome");
      setProductosCategoria(response.data || []);
      console.log(
        "Productos por categoria obtenidos para el Home:",
        response.data
      );
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }
  };
  // Función para obtener datos desde el backend
  useEffect(() => {
    // se ejecuta después del primer renderizado del componente.
    obtenerCategoryCards();
  }, []);

  return (
    <>
      <Row className="mt-5">
        <Col md={12}>
          {/* Productos en el lado derecho */}
          <Row lg={4} md={4} sm={12}>
            {Array.isArray(productosCategoria) &&
            productosCategoria.length > 0 ? (
              productosCategoria.map((producto) => (
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
                      <Card.Title
                        className="text-center"
                        style={{ fontSize: "22px" }}
                      >
                        {producto.categoria_nombre}
                      </Card.Title>

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
                        Ver Mas
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
    </>
  );
};

export default CategoryCards;
