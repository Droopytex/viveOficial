import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Modal,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";

import axios from "axios";

const DatosPersonales = () => {
  const URL = import.meta.env.VITE_URL;
  const [datos, setDatos] = useState(null); // Estado para almacenar los datos del usuario
  const [error, setError] = useState(null); // Estado para manejar errores
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // const id_usuario = datos.id; // ID del usuario
      const response = await axios.put(URL + "/datospersonales", datos, config);

      setDatos(response.data); // Actualizar los datos
      handleClose();
      // fetchDatosPersonales(); // Recargar los datos del componente
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  useEffect(() => {
    const fetchDatosPersonales = async () => {
      try {
        const token = localStorage.getItem("token"); // Supone que el token se almacena en localStorage tras iniciar sesión
        if (!token) {
          throw new Error("Usuario no autenticado");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado Authorization
          },
        };

        const response = await axios.get(URL + "/datospersonales", config);
        setDatos(response.data); // Guardar los datos obtenidos en el estado
      } catch (err) {
        setError(err.message || "Error al obtener los datos personales");
      }
    };

    fetchDatosPersonales();
  }, []);

  if (error) {
    return <p className="error">{error}</p>; // Mostrar mensaje de error si ocurre
  }

  if (!datos) {
    return <p>Cargando datos...</p>; // Mostrar mensaje mientras se cargan los datos
  }

  return (
    <Container>
      <Row className="mt-4">
        <Card>
          <Card.Header as="h5">Información Personal</Card.Header>
          <Card.Body>
            {/* <Card.Title>Special title treatment</Card.Title> */}
            <Card.Text>
              <Row className="m-2">
                <Col md={6}>
                  <p>
                    <strong>Nombre:</strong> {datos.nombre}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Apellido:</strong> {datos.apellido}
                  </p>
                </Col>
              </Row>
              <Row className="m-2">
                <Col md={6}>
                  <p>
                    <strong>Teléfono:</strong> {datos.telefono}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Email:</strong> {datos.email}
                  </p>
                </Col>
              </Row>
            </Card.Text>
            <Button variant="primary" onClick={handleShow}>
              Editar Información
            </Button>
          </Card.Body>
        </Card>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Información del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={datos.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellido" className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={datos.apellido}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelefono" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={datos.telefono}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={datos.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DatosPersonales;
