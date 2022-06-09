const mongoose = require("mongoose");
const books = require("./books");
const students = require("./students");

const loanSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true
  },
  outDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  returnDate: {
    type: Date
    //required: true,
    //default: Date.now
  }
});

module.exports = mongoose.model("loans", loanSchema);
