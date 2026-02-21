const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/nehaDrivingSchool")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Registration Schema
const RegistrationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicle: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// Attendance Schema
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

// Courses Schema
const CoursesSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  vehicle: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Instructors Schema
const InstructorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicle: String,
  experience: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Users Schema (for authentication)
const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Payments Schema
const PaymentsSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "UPI", "Bank Transfer"],
    default: "Cash"
  },
  paymentStatus: {
    type: String,
    enum: ["Completed", "Pending", "Failed"],
    default: "Completed"
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Registration = mongoose.model("Registration", RegistrationSchema);
const Attendance = mongoose.model("Attendance", AttendanceSchema);
const Course = mongoose.model("Course", CoursesSchema);
const Instructor = mongoose.model("Instructor", InstructorsSchema);
const User = mongoose.model("User", UsersSchema);
const Payment = mongoose.model("Payment", PaymentsSchema);

// ===== REGISTRATION ROUTES =====

// POST - Save registration
app.post("/register", async (req, res) => {
  try {
    const newUser = new Registration(req.body);
    await newUser.save();
    res.send("Registration Successful");
  } catch (error) {
    res.status(500).send("Error saving data");
  }
});

// GET - Get all registrations
app.get("/registrations", async (req, res) => {
  try {
    const { search, vehicle } = req.query;
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    
    if (vehicle) {
      filter.vehicle = vehicle;
    }
    
    const registrations = await Registration.find(filter).sort({ date: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get single registration by ID
app.get("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update registration
app.put("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json({ message: "Registration Updated", registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete registration
app.delete("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json({ message: "Registration Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== ATTENDANCE ROUTES =====

// POST - Mark attendance
app.post("/attendance", async (req, res) => {
  try {
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.send("Attendance Recorded");
  } catch (error) {
    res.status(500).send("Error recording attendance");
  }
});

// GET - Get all attendance records
app.get("/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get attendance by student name
app.get("/attendance/:studentName", async (req, res) => {
  try {
    const attendance = await Attendance.find({ 
      studentName: req.params.studentName 
    }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update attendance
app.put("/attendance/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance Updated", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete attendance
app.delete("/attendance/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== COURSES ROUTES =====

// POST - Create course
app.post("/courses", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json({ message: "Course Created", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get single course
app.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update course
app.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course Updated", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete course
app.delete("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== INSTRUCTORS ROUTES =====

// POST - Create instructor
app.post("/instructors", async (req, res) => {
  try {
    const newInstructor = new Instructor(req.body);
    await newInstructor.save();
    res.json({ message: "Instructor Created", instructor: newInstructor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all instructors
app.get("/instructors", async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get single instructor
app.get("/instructors/:id", async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: "Instructor not found" });
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update instructor
app.put("/instructors/:id", async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instructor) return res.status(404).json({ message: "Instructor not found" });
    res.json({ message: "Instructor Updated", instructor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete instructor
app.delete("/instructors/:id", async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) return res.status(404).json({ message: "Instructor not found" });
    res.json({ message: "Instructor Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== USER AUTHENTICATION ROUTES =====

// POST - Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = new User({ name, email, password, role: role || "student" });
    await newUser.save();
    res.json({ message: "Signup Successful", user: { id: newUser._id, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ message: "Login Successful", user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all users (admin only)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== DASHBOARD STATISTICS =====

// GET - Dashboard stats
app.get("/dashboard/stats", async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await Instructor.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const presentCount = await Attendance.countDocuments({ status: "Present" });
    const absentCount = await Attendance.countDocuments({ status: "Absent" });
    
    res.json({
      registrations: totalRegistrations,
      attendance: totalAttendance,
      courses: totalCourses,
      instructors: totalInstructors,
      users: totalUsers,
      present: presentCount,
      absent: absentCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== PAYMENTS ROUTES =====

// POST - Add payment
app.post("/payments", async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    await newPayment.save();
    res.json({ message: "Payment recorded successfully", payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all payments
app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete payment
app.delete("/payments/:id", async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update payment
app.put("/payments/:id", async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("Neha Motor Driving School Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});