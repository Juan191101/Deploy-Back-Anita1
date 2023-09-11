const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  frontPage: {
    type: String,
    required: false
  },
  carousel: [{
    type: String,
    required: false
  }],
  description: {
    type: String,
    required: true
  }
},{
  tymestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Card', cardSchema);