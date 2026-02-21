const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  course: String,

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Registration", RegistrationSchema);