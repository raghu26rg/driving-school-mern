const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
