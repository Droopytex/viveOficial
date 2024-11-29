// npm init --yes
// npm i express
// npm i express-fileupload  -- PENDIENTE AÚN
// npm i pg
// npm i pg-format
// npm i jsonwebtoken
// npm i nodemon -D
// npm i morgan
// npm i dotenv
// npm i bcryptjs
// npm i cors
// npm i supertest
// npm install cookie-parser
// npm install express-session  --se puede eliminar
// npm i helmet
// npm i express-validator
// crear .env
// crear .gitignore
// abrir psql y crear database y table

// Importamos las dependencias necesarias para nuestra aplicación

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//importamos funciones necesarias para las rutas
const {
  leerPublicaciones,
  insertarProducto,
  insertarPublicacion,
  insertarImagenProducto,
  publicacionActiva,
  publicacionInactiva,
  insertarProductosCategorias,
  obtenerCategorias,
  obtenerDatosPersonales,
  obtenerVentas,
  obtenerTienda,
  cambiarDatosPersonales,
  obtenerCategoriasHome,
  obtenerSalesHome,
  insertarProductosSale,
} = require("./consultas/consultas.js");
const {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
} = require("./consultas/consultasUsuarios.js");

const {
  getProductos,
  getProductoById,
  getProductosSale,
  getProductosCategorias,
} = require("./consultas/consultas.js");

require("dotenv").config(); // Cargamos las variables de entorno desde el archivo .env

// Creamos una instancia de Express
const app = express();

const PORT = process.env.PORT || 5432;

// Iniciamos el servidor y mostramos un mensaje para confirmar que está funcionando
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});

// Configuración de CORS
app.use(cors({
  origin: 'https://viveoficial-1.onrender.com', // Cambia esto por la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Si necesitas enviar cookies o encabezados de autorización
}));
// const { PORT, SECRET_JWT_KEY } = process.env;

// Middlewares
app.use(cors()); // Permite que nuestra API sea accesible desde diferentes orígenes
app.use(morgan("dev")); // Registra las solicitudes en la consola para facilitar el desarrollo
app.use(helmet());
app.use(express.json()); // Permite que nuestra aplicación entienda el formato JSON en las solicitudes
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extraer el token del formato 'Bearer <token>'
  if (!token) {
    return res
      .status(403)
      .json({ message: "Acceso denegado, no hay token de autentificación." });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token no válido o expirado" });
  }
};

// DEFINIMOS NUESTRAS RUTAS ----------------------

// Añadimos una ruta adicional para mostrar un saludo
app.get("/", (req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API! Esperamos que disfrutes tu experiencia.",
  });
});

// RUTA POST PARA REGISTRO DE NUEVOS USUARIOS --------------------------
app.post(
  "/registro",
  body("nombre").isString().notEmpty(),
  body("apellido").isString().notEmpty(),
  body("email").isEmail(),
  body("telefono").isString().notEmpty(),
  //body('rol').isString().notEmpty(),  ---> en el registro no se elige rol, se agrega por default en el insert
  body("password").isString().isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    registrarUsuario(req, res, next);
  }
);

//RUTA LOGIN PARA INGRESO DE USUARIOS YA REGISTRADOS --------------------------
app.post(
  "/login",
  body("email").isString().notEmpty(),
  body("password").isString().isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    iniciarSesion(req, res, next);
  }
);

// RUTAS PARA CERRAR SESIÓN  --------------------------
app.post("/logout", cerrarSesion);
//app.get('/protected', accesoProtegido);

// RUTA PARA OBTENER PUBLICACIONES Y QUE SE ENLISTEN
app.get("/publicaciones", async (req, res) => {
  try {
    const obtenerPublicaciones = await leerPublicaciones();
    res.json({ obtenerPublicaciones });
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// RUTA PARA CREAR UNA NUEVA PUBLICACIÓN: la cual inserta un nuevo producto e imagen
//modifica cuatro tablas: publicacion, imagen, producto, categoria

app.post("/crearpublicacion", verifyToken, async (req, res) => {
  const {
    nombre,
    descripcion,
    stock,
    precio,
    url,
    texto_alternativo,
    id_categoria,
  } = req.body;

  const id_usuario = req.user.id; // obtener el id_usuario de token JWT

  try {
    // Insertar el producto y obtener su ID
    const nuevoProducto = await insertarProducto(
      nombre,
      descripcion,
      stock,
      precio
    );

    // Insertar la imagen del producto con el ID del nuevo producto
    const nuevaImagen = await insertarImagenProducto(
      nuevoProducto.id_producto,
      url,
      texto_alternativo
    );

    // Insertar la publicación con el ID del nuevo producto
    const nuevaPublicacion = await insertarPublicacion(
      nuevoProducto.id_producto,
      id_usuario
    );

    // Insertar el producto con su categoría respectivo
    const nuevoProductoCategoria = await insertarProductosCategorias(
      nuevoProducto.id_producto,
      id_categoria
    );

    // Insertar el producto en tabla sale como inactivo por defecto
    const nuevoProductoSale = await insertarProductosSale(
      nuevoProducto.id_producto
    );

    res.status(201).json({
      mensaje: "Publicación creada exitosamente",
      producto: nuevoProducto,
      categoria: nuevoProductoCategoria,
      imagen: nuevaImagen,
      publicacion: nuevaPublicacion,
      sale: nuevoProductoSale,
    });
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    res.status(500).json({ error: "Error al crear la publicación" });
  }
});

// RUTA PARA PRODUCTOS
// obtención de productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// obtención de productos por id
app.get("/productos/:id", async (req, res) => {
  try {
    const { id_producto } = req.params;
    const producto = await getProductoById(id_produto);
    res.json(producto);
  } catch (error) {
    res
      .status(error.code || 500)
      .send(error.message || "Error interno del servidor");
  }
});

// obtención de productos por categorias
app.get("/productos_categorias", async (req, res) => {
  try {
    const productos_categorias = await getProductosCategorias();
    res.json(productos_categorias);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// obtención de categorias y sus nombres
app.get("/categorias", async (req, res) => {
  try {
    const categorias = await obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// obtención de productos en Sale
app.get("/productos_sale", async (req, res) => {
  try {
    const productos_sale = await getProductosSale();
    res.json(productos_sale);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// activar publicación
app.put("/publicacionactiva/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await publicacionActiva(id);
    res.status(200).json({ message: "Estado actualizado: Activo" });
  } catch (error) {
    console.error("Error al actualizar el estado de la publicación:", error);
    res.status(500).json({ error: "Error al activar la publicación" });
  }
});

// desactivar publicación
app.put("/publicacioninactiva/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await publicacionInactiva(id);
    res.status(200).json({ message: "Estado actualizado: Inactivo" });
  } catch (error) {
    console.error("Error al actualizar el estado de la publicación:", error);
    res.status(500).json({ error: "Error al activar la publicación" });
  }
});

// obtener datos personales del usuario por ID
app.get("/datospersonales", verifyToken, async (req, res) => {
  const id_usuario = req.user.id; // ID extraído del token

  try {
    const datosPersonales = await obtenerDatosPersonales(id_usuario);
    if (datosPersonales) {
      res.status(200).json(datosPersonales);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener los datos personales:", error);
    res.status(500).json({ error: "Error al obtener los datos personales" });
  }
});

// MODIFICAR DATOS DE USUARIO
app.put("/datospersonales", verifyToken, async (req, res) => {
  const datosActualizados = req.body; // Datos enviados desde el frontend
  // console.log("id que llega mas datos en la ruta:" ,  datosActualizados )
  try {
    const resultado = await cambiarDatosPersonales(datosActualizados);
    res.status(200).json(resultado); // Responder con los datos actualizados
  } catch (error) {
    console.error("Error al actualizar los datos personales:", error);
    res.status(500).json({ error: "No se pudo actualizar la información." });
  }
});

// RUTA PARA OBTENER VENTAS / PEDIDOS Y QUE SE ENLISTEN
app.get("/ventas", async (req, res) => {
  try {
    const getVentas = await obtenerVentas();
    res.json({ getVentas });
  } catch (error) {
    console.error("Error al obtener lista de ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});

// RUTA PARA OBTENER PRODUCTOS Y QUE SE ENLISTEN EN LA TIENDA, SOLO AQUELLOS QUE ESTAN ACTIVOS EN PUBLICACIONES
app.get("/tienda", async (req, res) => {
  try {
    const tienda = await obtenerTienda();
    res.json(tienda);
  } catch (error) {
    console.error("Error al obtener lista de ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});

// RUTA PARA OBTENER LOS CUATRO PRODUCTOS PARA LA SECCION DE CATEGORIAS EN EL HOME
app.get("/categoriashome", async (req, res) => {
  try {
    const categoriasHome = await obtenerCategoriasHome();
    res.json(categoriasHome);
    console.log("resultado que devuelve la ruta: ", categoriasHome);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// RUTA PARA OBTENER LOS CUATRO PRODUCTOS sales EN EL HOME
app.get("/saleshome", async (req, res) => {
  try {
    const salesHome = await obtenerSalesHome();
    res.json(salesHome);
    console.log("resultado que devuelve la ruta: ", salesHome);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    error: "Lo sentimos, recurso no encontrado. ¡Intenta otra vez!",
    error,
  });
});
