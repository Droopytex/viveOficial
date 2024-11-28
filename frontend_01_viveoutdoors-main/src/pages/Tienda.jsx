import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import SidebarTienda from "../components/SidebarTienda";

import axios from "axios";

const Tienda = () => {
  const URL = import.meta.env.VITE_URL;
  const [productos, setProductos] = useState([]); //inicialmente es un arreglo vacío

  const obtenerTienda = async () => {
    try {
      const response = await axios.get(URL + "/tienda");
      setProductos(response.data || []);
      console.log("Productos obtenidos para la tienda:", response.data);
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }
  };
  // Función para obtener datos desde el backend
  useEffect(() => {
    // se ejecuta después del primer renderizado del componente.
    obtenerTienda();
  }, []);

  const agregarAlCarrito = (producto) => {
    // Obtener el carrito actual del localStorage
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    // Agregar el producto al carrito
    const nuevoCarrito = [...carritoActual, producto];

    // Guarda el carrito actualizado en el localStorage
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    console.log("Producto añadido al carrito:", producto);
  };

  return (
    <>
      <h1>Tienda</h1>
      <Container className="mt-5 fluid">
        <Row>
          <Col md={3} lg={3} className="mb-4">
            {/* Sidebar en el lado izquierdo */}
            <SidebarTienda />
          </Col>

          <Col md={9}>
            {/* Productos en el lado derecho */}
            <Row lg={3} md={3} sm={12}>
              {Array.isArray(productos) && productos.length > 0 ? (
                productos.map((producto) => (
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
                        {producto.sale === "activo" && (
                          <h6 style={{ marginTop: "5px" }}>
                            <Badge bg="danger">SALE</Badge>
                          </h6>
                        )}
                        <Card.Text
                          style={{ margin: "5px 0", fontSize: "12px" }}
                        >
                          {producto.categoria_nombre}
                        </Card.Text>
                        <Card.Title style={{ fontSize: "18px" }}>
                          {producto.producto_nombre}
                        </Card.Title>
                        <Card.Text style={{ margin: "5px 0" }}>
                          {" "}
                          ${producto.producto_precio}
                        </Card.Text>

                        <Button
                          style={{
                            width: "100%", // Botón ocupa todo el ancho
                            margin: "0 auto",
                            whiteSpace: "nowrap", // Evita que el texto del botón se corte
                            fontSize: "14px",
                          }}
                          variant="warning"
                          onClick={() => agregarAlCarrito(producto)}
                        >
                          Agregar al Carrito
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
      </Container>
    </>
  );
};

export default Tienda;
