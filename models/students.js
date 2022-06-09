const mongoose = require("mongoose");

const studentSchema = {
  name: {
    type: String,
    required: true
  }
};

module.exports = mongoose.model("students", studentSchema);
