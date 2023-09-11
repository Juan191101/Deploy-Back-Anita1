const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/user");
const cardsRoute = require("./routes/cards");
const cors = require("cors");
const morgan = require('morgan');
const multer = require('multer')
const uploadRoute = require("./routes/uploads"); // Importa las rutas de carga de archivos


// settings
const app = express();
const port = process.env.PORT || 3002;

// Configurar CORS para permitir solicitudes desde "http://localhost:5173"
app.use(cors());
app.options( cors());

// middlewares
app.use(express.json());
app.use("/api", userRoute);
app.use("/cards", cardsRoute);
app.use("/upload", uploadRoute);
app.use(morgan('dev')); // Registra las solicitudes en la consola


// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

// server listening
app.listen(port, () => console.log("Server listening to", port));
