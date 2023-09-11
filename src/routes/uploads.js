const express = require("express");
const router = express.Router();
const multer = require('multer');
const cloudinary = require("../cloudinary/cloudinaryConfig")
const Card = require("../models/cards");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });


// Ruta para cargar una imagen y actualizar el atributo frontPage de una tarjeta por su ID
router.post('/front/:cardId', upload.single('file'), async (req, res) => {
    try {
      const cardId = req.params.cardId;
      const { file } = req; // Obtiene el archivo cargado
  
      // Verifica si hay errores al subir la imagen a Cloudinary
      if (file && file.error) {
        console.error("Error al subir la imagen a Cloudinary:", file.error);
        return res.status(500).send("Error al subir la imagen a Cloudinary");
      }
  
      // Sube la imagen a Cloudinary
      cloudinary.uploader.upload(file.path, {
        transformation: [
          { width: 800, height: 600, crop: 'fill' }, // Tamaño deseado
        ],
      }, function (error, result) {
        if (error) {
          console.error("Error al subir la imagen a Cloudinary:", error);
          return res.status(500).send("Error al subir la imagen a Cloudinary");
        }
  
        const imageUrl = result.secure_url; // Obtiene la URL de la imagen cargada desde Cloudinary
  
        // Busca la tarjeta por su ID en la base de datos
        Card.findById(cardId, async (err, card) => {
          if (err || !card) {
            console.error("Error al buscar la tarjeta:", err);
            return res.status(404).send("Tarjeta no encontrada");
          }
  
          // Actualiza el atributo frontPage de la tarjeta con la nueva URL de imagen
          card.frontPage = imageUrl;
  
          // Guarda los cambios en la base de datos
          await card.save();
  
          res.json(card); // Devuelve los datos de la tarjeta actualizada con la nueva URL de imagen
        });
      });
    } catch (error) {
      console.error("Error al cargar la imagen y actualizar el frontPage:", error);
      res.status(500).send("Error al cargar la imagen y actualizar el frontPage");
    }
  });
  
  // Ruta para agregar imagenes al carrusel de una carta
  router.post('/carousel/:cardId', upload.array('files'), async (req, res) => {
    try {
      const cardId = req.params.cardId;
      const { files } = req; // Obtiene los archivos cargados
  
      // Verifica si hay errores al subir las imágenes a Cloudinary
      for (const file of files) {
        if (file.error) {
          console.error("Error al subir una imagen a Cloudinary:", file.error);
          return res.status(500).send("Error al subir una imagen a Cloudinary");
        }
      }
  
      const uploadedImages = [];
  
      // Sube las imágenes a Cloudinary y guarda las URL
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          transformation: [
            { width: 800, height: 600, crop: 'fill' }, // Tamaño deseado
          ],
        });
        uploadedImages.push(result.secure_url);
      }
  
      // Busca la tarjeta por su ID en la base de datos
      const card = await Card.findById(cardId);
  
      if (!card) {
        // Si no se encuentra la tarjeta, devuelve un error 404
        return res.status(404).send("Tarjeta no encontrada");
      }
  
      // Obtiene las URLs de las imágenes existentes y las concatena con las nuevas URLs
      const existingImages = card.carousel || [];
      const allImages = existingImages.concat(uploadedImages);
  
      // Actualiza el atributo carousel con las imágenes combinadas
      card.carousel = allImages;
  
      // Guarda los cambios en la base de datos
      await card.save();
  
      res.json(card); // Devuelve los datos de la tarjeta actualizada con las nuevas URLs de imágenes
    } catch (error) {
      console.error("Error al cargar las imágenes y actualizar el carousel:", error);
      res.status(500).send("Error al cargar las imágenes y actualizar el carousel");
    }
  });
  
  
module.exports = router;
