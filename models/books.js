const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
});
module.exports = mongoose.model("books", bookSchema);
