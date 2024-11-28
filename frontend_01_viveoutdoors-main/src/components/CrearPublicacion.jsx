import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";

const CrearPublicacion = () => {
  const URL = import.meta.env.VITE_URL;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [url, setUrl] = useState("");
  const [texto_alternativo, setTextoalternativo] = useState("");
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
  const [id_categoria, setIdCategoria] = useState(""); // Estado para la categoría seleccionada

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get(URL + "/categorias");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    obtenerCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre,
      descripcion,
      stock,
      precio,
      url,
      texto_alternativo,
      id_categoria,
    };

    console.log(payload);

    try {
      // Obtener el token de autenticación de alguna fuente (por ejemplo, localStorage)
      const token = localStorage.getItem("token"); // Asegúrate de tener el token guardado previamente
      console.log("Token recuperado:", token);

      if (!token) {
        alert("No se encontró un token válido. Inicia sesión nuevamente.");
        return;
      }

      // Configurar los encabezados con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Enviar la solicitud POST con el token
      const respuesta = await axios.post(
        URL + "/crearpublicacion",
        payload,
        config // Aquí se pasa la configuración con los encabezados
      );

      console.log("Publicación creada", respuesta.data);

      // Mostrar mensaje de éxito en el modal
      setModalMessage("Su publicación se creó correctamente.");
      setShowModal(true);

      // Resetear formulario
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      setUrl("");
      setTextoalternativo("");
      setIdCategoria("");
    } catch (error) {
      let errorMsg = "El producto no pudo ser creado.";
      if (error.response) {
        // Manejo específico de errores del backend
        console.error("Error en la respuesta del servidor:", error.response);
        if (error.response.status === 403) {
          alert("No tienes permisos para realizar esta acción.");
        } else {
          alert(`Error: ${error.response.data.message || "Algo salió mal"}`);
        }
      } else {
        console.error("Error al crear la publicación:", error);
        alert("Error al conectar con el servidor.");
      }
      // Mostrar mensaje de error en el modal
      setModalMessage(errorMsg);
      setShowModal(true);
    }
  };

  return (
    <div>
      <h2>Crear Publicación</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="precio">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="stock">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="url">
          <Form.Label>URL de la Imagen</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="texto_alternativo">
          <Form.Label>Texto Alternativo de la Imagen</Form.Label>
          <Form.Control
            type="text"
            value={texto_alternativo}
            onChange={(e) => setTextoalternativo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="categoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            as="select"
            value={id_categoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Crear Publicación
        </Button>
      </Form>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrearPublicacion;
