const express = require("express");
const userSchema = require("../models/user");

const router = express.Router();

// create user
router.post("/users", (req, res) => {
  const user = userSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all users
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Ruta para buscar un usuario por el atributo "name"
router.get('/users/:email', (req, res) => {
  const { email } = req.params; // Obtiene el valor de "name" desde los parámetros de la URL

  userSchema.findOne({ email }) // Busca un usuario con el nombre especificado
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;
// delete a user
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// update a user
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { name, age, email } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
