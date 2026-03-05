# 🚗 Neha Motor Driving School - MERN Web Application

A full-stack driving school management system built with MERN (MongoDB, Express, React, Node.js) stack. This application provides role-based access for students, instructors, and administrators to manage courses, attendance, payments, and reports.

## ✨ Features

### 👨‍💼 Admin Dashboard
- **Complete System Control**: Manage all aspects of the driving school
- **8 Main Tabs**: Dashboard, Registration, Attendance, Courses, Instructors, Payments, Reports, Settings
- **User Management**: View and manage all users (students, instructors, admins)
- **Analytics**: Real-time statistics with visual charts and metrics
- **Data Export**: Export all data to CSV format for analysis
- **System Settings**: Configure school information and application settings

### 📚 Student Features
- **Personal Dashboard**: Track attendance rate, sessions completed, and progress
- **My Attendance**: View personal attendance history
- **Browse Courses**: View all available courses with details
- **Payment History**: Track payment status and transactions
- **Limited Permissions**: Students can only view their own data

### 👨‍🏫 Instructor Features
- **Class Dashboard**: Track students, attendance rates, and session statistics
- **Attendance Management**: Mark and manage student attendance
- **Course Browsing**: View available courses
- **Student Performance**: Monitor individual student attendance percentages

### 🎯 Core Features
- ✅ **Role-Based Access Control**: Different UIs for students, instructors, and admins
- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete for all entities
- ✅ **Search & Filtering**: Find registrations by name, phone, or vehicle type
- ✅ **Pagination**: Browse large datasets efficiently
- ✅ **Payment Tracking**: Record and manage student payments with multiple payment methods
- ✅ **Attendance System**: Mark attendance with status (Present/Absent)
- ✅ **Course Management**: Create and manage driving courses with pricing
- ✅ **Instructor Management**: Manage instructor profiles and assignments
- ✅ **Real-time Notifications**: Toast notifications for all actions
- ✅ **Reports & Analytics**: Dashboard with statistics and data export
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Session Persistence**: Users remain logged in across page refreshes

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 17+** - UI library
- **React Hooks** - State management
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests

## 📦 Project Structure

```
driving-school-mern/
├── server/
│   ├── server.js                 # Express API server
│   ├── checkDatabase.js          # Database utility script
│   ├── package.json              # Backend dependencies
│   └── client/                   # React frontend
│       ├── public/
│       │   ├── index.html
│       │   └── ...
│       ├── src/
│       │   ├── App.js            # Main app component
│       │   ├── App.css           # Global styles
│       │   ├── index.js
│       │   ├── components/       # React components
│       │   │   ├── StudentDashboard.js
│       │   │   ├── InstructorDashboard.js
│       │   │   ├── EnhancedDashboard.js
│       │   │   ├── RegistrationForm.js
│       │   │   ├── RegistrationList.js
│       │   │   ├── AttendanceForm.js
│       │   │   ├── AttendanceList.js
│       │   │   ├── CourseForm.js
│       │   │   ├── CourseList.js
│       │   │   ├── InstructorForm.js
│       │   │   ├── InstructorList.js
│       │   │   ├── LoginForm.js
│       │   │   ├── SignupForm.js
│       │   │   ├── PaymentsTab.js
│       │   │   ├── ReportsTab.js
│       │   │   ├── SettingsTab.js
│       │   │   └── Toast.js
│       │   └── services/
│       │       └── api.js        # API service layer
│       └── package.json          # Frontend dependencies
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally on port 27017)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/driving-school-mern.git
cd driving-school-mern
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd server/client
npm install
```

### Database Setup

Ensure MongoDB is running on your local machine:
```bash
mongod
```

The application will automatically create a database named `nehaDrivingSchool` with collections for:
- Registrations
- Attendance
- Courses
- Instructors
- Users
- Payments

### Running the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
node server.js
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend Server:**
```bash
cd server/client
npm start
```
Frontend runs on: `http://localhost:3000`

### Test Accounts

Create test accounts during application startup:

**Admin Account:**
- Email: admin@example.com
- Password: admin123
- Role: Admin

**Instructor Account:**
- Email: instructor@example.com
- Password: instructor123
- Role: Instructor

**Student Account:**
- Email: student@example.com
- Password: student123
- Role: Student

---

## 📦 Deployment

You can deploy the project easily using Render for the backend and Vercel for the frontend.

### 1. Backend on Render
1. Create a free account at [render.com](https://render.com) and connect your GitHub repo.
2. Add a new **Web Service** and point it at the `server` folder of this repo.
3. Set build/ start commands:
   ```bash
   # build (optional)
   npm install
   # start
   node server.js
   ```
4. Configure environment variables on Render:
   - `MONGO_URI` – your MongoDB Atlas connection string
   - `JWT_SECRET` – any long random string
   - (optional) `PORT` – default 5000
5. Deploy and wait. Your backend will be available at `https://<your-service>.onrender.com`.

### 2. Frontend on Vercel
1. Sign in at [vercel.com](https://vercel.com) and import the same GitHub repository.
2. Set the project root to `server/client`.
3. Configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add an environment variable:
   - `REACT_APP_API_URL` = `https://<your-service>.onrender.com`
5. Deploy. Vercel will provide a URL like `https://<your-app>.vercel.app`.

> Note: The client code uses `process.env.REACT_APP_API_URL || 'http://localhost:5000'` so it automatically points to the backend URL in production.

### 3. Additional Notes
- You can also host both frontend and backend on Render (backend as Web Service, frontend as Static Site) if you prefer a single platform.
- Make sure the MongoDB Atlas IP whitelist includes Render/Vercel IPs or set it open during development.
- After deployment, test sign‑up/login and profile features to ensure environment variables are working.

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: String (student/instructor/admin),
  createdAt: Date
}
```

### Registrations Collection
```javascript
{
  name: String,
  phone: String,
  vehicle: String,
  date: Date
}
```

### Attendance Collection
```javascript
{
  studentName: String,
  instructorName: String,
  date: Date,
  time: String,
  status: String (Present/Absent)
}
```

### Courses Collection
```javascript
{
  courseName: String,
  vehicle: String,
  duration: String,
  price: Number,
  description: String,
  createdAt: Date
}
```

### Instructors Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  vehicle: String,
  experience: String,
  createdAt: Date
}
```

### Payments Collection
```javascript
{
  studentName: String,
  courseId: String,
  amount: Number,
  paymentMethod: String,
  paymentStatus: String,
  date: Date,
  createdAt: Date
}
```

## 🎯 User Roles & Permissions

### Student
- ✓ View personal dashboard
- ✓ View own attendance
- ✓ Browse courses
- ✓ View payment history
- ✗ Cannot create/edit/delete
- ✗ Cannot access admin features

### Instructor
- ✓ View class dashboard
- ✓ Mark and manage attendance
- ✓ Browse courses
- ✓ View student performance
- ✗ Cannot manage courses
- ✗ Cannot access payments or reports

### Admin
- ✓ Full system access
- ✓ Manage registrations
- ✓ Manage attendance
- ✓ Create and edit courses
- ✓ Manage instructors
- ✓ Record payments
- ✓ Generate reports
- ✓ Access settings
- ✓ View all statistics

## 🎨 UI/UX Features

- **Role-Based Interfaces**: Different UI for students, instructors, and admins
- **Responsive Design**: Mobile-first approach works on all devices
- **Toast Notifications**: Real-time feedback on user actions
- **Gradient Backgrounds**: Modern, professional color schemes
- **Hover Effects**: Interactive elements respond to user interaction
- **Modal Dialogs**: Inline editing without page navigation
- **Loading States**: Visual indicators during data fetching
- **Pagination**: Browse large datasets efficiently
- **Search & Filter**: Find specific records quickly
- **Status Badges**: Color-coded status indicators

## 🔍 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login
- `GET /users` - Get all users (admin only)

### Registrations
- `POST /register` - Register new student
- `GET /registrations` - Get all registrations (with search & filter)
- `PUT /registrations/:id` - Update registration
- `DELETE /registrations/:id` - Delete registration

### Attendance
- `POST /attendance` - Mark attendance
- `GET /attendance` - Get all attendance records
- `GET /attendance/:studentName` - Get attendance by student
- `PUT /attendance/:id` - Update attendance
- `DELETE /attendance/:id` - Delete attendance

### Courses
- `POST /courses` - Create course
- `GET /courses` - Get all courses
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Instructors
- `POST /instructors` - Create instructor
- `GET /instructors` - Get all instructors
- `PUT /instructors/:id` - Update instructor
- `DELETE /instructors/:id` - Delete instructor

### Payments
- `POST /payments` - Record payment
- `GET /payments` - Get all payments
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

### Dashboard
- `GET /dashboard/stats` - Get system statistics

## 📝 Available Scripts

### Backend
```bash
cd server
npm install    # Install dependencies
node server.js # Start server
```

### Frontend
```bash
cd server/client
npm install    # Install dependencies
npm start      # Start development server
npm build      # Build for production
npm test       # Run tests
```

## 🚨 Common Issues & Solutions

### MongoDB Connection Error
**Issue**: `MongooseError: Cannot connect to MongoDB`
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Check connection string in `server.js`
- Default: `mongodb://127.0.0.1:27017/nehaDrivingSchool`

### Port Already in Use
**Issue**: `Error: listen EADDRINUSE :::5000` or `:::3000`
**Solution**:
```bash
# Kill process on port 5000
netstat -ano | findstr :5000

# Kill process on port 3000
netstat -ano | findstr :3000
```

### No Data Showing
**Issue**: Database is empty
**Solution**: Create some test data using the signup form and add registrations through the admin panel

### CORS Errors
**Issue**: `No 'Access-Control-Allow-Origin' header`
**Solution**: CORS is enabled in `server.js` - ensure backend is running

## 📚 Features Roadmap

- [ ] Email notifications for attendance
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] SMS notifications
- [ ] Student progress tracking
- [ ] Certificate generation
- [ ] Advanced analytics & charts
- [ ] Batch operations
- [ ] API documentation (Swagger)
- [ ] Unit & integration tests
- [ ] Docker containerization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**RAGHAVENDRA**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built with React, Node.js, Express, and MongoDB
- Inspired by real-world driving school management systems
- Special thank you to the open-source community

## 📞 Contact & Support

For questions, issues, or suggestions, please:
1. Open an issue on GitHub
2. Send an email to your.email@example.com
3. Check existing documentation

---

Made with ❤️ by RAGHAVENDRA
