const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/nehaDrivingSchool")
  .then(() => {
    console.log("Connected to MongoDB");
    const RegistrationSchema = new mongoose.Schema({
      name: String,
      phone: String,
      vehicle: String,
      date: {
        type: Date,
        default: Date.now
      }
    });
    
    const Registration = mongoose.model("Registration", RegistrationSchema);
    
    Registration.find().then(registrations => {
      console.log("\n=== ALL REGISTRATIONS IN DATABASE ===\n");
      registrations.forEach((reg, index) => {
        console.log(`${index + 1}. Name: ${reg.name}`);
        console.log(`   Phone: ${reg.phone}`);
        console.log(`   Vehicle: ${reg.vehicle}`);
        console.log(`   Date: ${reg.date}`);
        console.log("---");
      });
      mongoose.connection.close();
    });
  })
  .catch(err => console.log("Connection error:", err));
