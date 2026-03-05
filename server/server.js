const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// middleware
app.use(cors());
app.use(express.json());

// ===== JWT MIDDLEWARE =====
// Verify JWT token from request headers
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Check if user has specific role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied - insufficient permissions" });
    }
    next();
  };
};

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
    res.json({ success: true, message: "Registration Successful", registration: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving registration", error: error.message });
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
    res.json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving registrations", error: error.message });
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
    res.json({ success: true, message: "Attendance Recorded", data: newAttendance });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error recording attendance", error: error.message });
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
    res.json({ success: true, message: "Course Created", data: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating course", error: error.message });
  }
});

// GET - Get all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving courses", error: error.message });
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
    res.json({ success: true, message: "Instructor Created", data: newInstructor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating instructor", error: error.message });
  }
});

// GET - Get all instructors
app.get("/instructors", async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: instructors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving instructors", error: error.message });
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
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student"
    });
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      message: "Signup Successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Get user profile
app.get("/auth/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ 
      success: true, 
      data: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update user profile
app.put("/auth/profile/:userId", async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }
    
    // Check if email already exists (for other users)
    const existingUser = await User.findOne({ email, _id: { $ne: req.params.userId } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email },
      { new: true }
    ).select("-password");
    
    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      data: user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Change password
app.put("/auth/change-password/:userId", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old password and new password are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.json({ success: true, message: "Payment recorded successfully", data: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error recording payment", error: error.message });
  }
});

// GET - Get all payments
app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving payments", error: error.message });
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
  res.json({ success: true, message: "Neha Motor Driving School Backend Running" });
});

// ===== ERROR HANDLING MIDDLEWARE =====
// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});