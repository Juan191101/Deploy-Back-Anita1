const express = require("express");
const router = express.Router();
const Card = require("../models/cards");

router.post("/create", async (req, res) => {
  try {
    const { title, description, carousel, frontPage } = req.body;

    // Crea una nueva tarjeta utilizando el modelo sin incluir frontPage
    const newCard = new Card({
      title,
      description,
      carousel, 
      frontPage
    });

    // Guarda la tarjeta en la base de datos
    await newCard.save();

    res.json(newCard);
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    res.status(500).send("Error al crear la tarjeta");
  }
});



// Ruta para obtener todas las tarjetas
router.get("/", async (req, res) => {
    try {
      const cards = await Card.find(); // Consulta todas las tarjetas en la base de datos
  
      res.json(cards); // Devuelve las tarjetas en formato JSON como respuesta
    } catch (error) {
      console.error("Error al obtener las tarjetas:", error);
      res.status(500).send("Error al obtener las tarjetas");
    }
  });

  // Ruta para obtener los datos de una tarjeta por su ID
router.get("/:id", async (req, res) => {
  try {
    const cardId = req.params.id;

    // Busca la tarjeta por su ID en la base de datos
    const card = await Card.findById(cardId);

    if (!card) {
      // Si no se encuentra la tarjeta, devuelve un error 404
      return res.status(404).send("Tarjeta no encontrada");
    }

    res.json(card); // Devuelve los datos de la tarjeta en formato JSON como respuesta
  } catch (error) {
    console.error("Error al obtener la tarjeta:", error);
    res.status(500).send("Error al obtener la tarjeta");
  }
});


module.exports = router;