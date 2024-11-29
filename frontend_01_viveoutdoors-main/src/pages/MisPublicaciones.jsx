import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MisPublicaciones = () => {
  const URL = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]); //inicialmente es un arreglo vacío

  const obtenerPublicaciones = async () => {
    try {
      const response = await axios.get(URL + "/publicaciones");
      setPublicaciones(response.data.obtenerPublicaciones || []);
      console.log(
        "Publicaciones obtenidas:",
        response.data.obtenerPublicaciones
      );
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }
  };
  // Función para obtener datos desde el backend
  useEffect(() => {
    // se ejecuta después del primer renderizado del componente.
    obtenerPublicaciones();
  }, []);

  const handleEstadoClick = async (id, nuevoEstado) => {
    try {
      const ruta =
        nuevoEstado === "Activo"
          ? URL + `/publicacionactiva/${id}` // se ejecuta direccion a .env.
          : URL + `/publicacioninactiva/${id}`; // se ejecuta direccion a .env.
      await axios.put(ruta);
      console.log(`Publicación ${id} se ha marcado como ${nuevoEstado}`); // Actualizar el estado de las publicaciones después de la modificación
      obtenerPublicaciones();
    } catch (error) {
      console.error("Error al cambiar el estado de la publicación:", error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Publicaciones</h2>{" "}
        <Button
          className="p-2"
          variant="warning"
          size="sm"
          onClick={() => navigate("/admin/crearpublicacion")}
        >
          Crear Publicación
        </Button>
      </div>

      <Row>
        {Array.isArray(publicaciones) && publicaciones.length > 0 ? (
          publicaciones.map((publicacion) => (
            <Col
              key={publicacion.id_publicacion}
              sm={12}
              md={12}
              lg={12}
              className="mb-4"
            >
              <Card>
                <Row className="g-0">
                  <Col md={4}>
                    <Card.Img
                      className="p-3 m-1" //   variant="top"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "200px",
                      }}
                      src={publicacion.producto_imagen}
                      alt={publicacion.producto_nombre}
                      fluid
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{publicacion.producto_nombre}</Card.Title>
                      <Card.Text>{publicacion.producto_descripcion}</Card.Text>
                      <Card.Text>
                        Categoria: {publicacion.categoria_nombre}
                      </Card.Text>
                      <Card.Text>Precio: {publicacion.precio}</Card.Text>
                      <Card.Text>
                        Stock: {publicacion.stock} unidades disponibles
                      </Card.Text>

                      <Row>
                        <Col>
                          <Button
                            variant={
                              publicacion.estado === "Activo"
                                ? "success"
                                : "secondary"
                            }
                            className="me-2"
                            onClick={() =>
                              publicacion.estado === "Inactivo" &&
                              handleEstadoClick(
                                publicacion.id_publicacion,
                                "Activo"
                              )
                            }
                          >
                            Activo
                          </Button>
                          <Button
                            variant={
                              publicacion.estado === "Inactivo"
                                ? "success"
                                : "secondary"
                            }
                            onClick={() =>
                              publicacion.estado === "Activo" &&
                              handleEstadoClick(
                                publicacion.id_publicacion,
                                "Inactivo"
                              )
                            }
                          >
                            Inactivo
                          </Button>
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <Button variant="info">Ver publicación</Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                </Row>
                <Card.Footer>
                  <small className="text-muted">
                    Producto creado: {publicacion.fecha_creacion} ; Última
                    actualización: {publicacion.fecha_actualizacion}
                  </small>
                </Card.Footer>
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
export default MisPublicaciones;

//función que recibe el id de la publicación y su estado actual, según el estado realiza la solicitud a la ruta correspondiente y actualiza el estado de la interfaz
//   const handleEstadoClick = async (id, estadoActual) => {
//     try {
//       if (estadoActual === "Activo") {
//         await axios.put(`http://localhost:3000/publicacioninactiva/${id}`);
//         console.log(`Publicación ${id} se ha marcado como Inactiva`);
//       } else if (estadoActual === "Inactivo") {
//         await axios.put(`http://localhost:3000/publicacionactiva/${id}`);
//         console.log(`Publicación ${id} se ha marcado como Activa`);
//       }
//       // Actualizar el estado de las publicaciones después de la modificación
//       obtenerPublicaciones();
//     } catch (error) {
//       console.error("Error al cambiar el estado de la publicación:", error);
//     }
//   };
