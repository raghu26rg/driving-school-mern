import React, { useState, useEffect } from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import RegistrationList from "./components/RegistrationList";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceList from "./components/AttendanceList";
import CourseForm from "./components/CourseForm";
import CourseList from "./components/CourseList";
import InstructorForm from "./components/InstructorForm";
import InstructorList from "./components/InstructorList";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import EnhancedDashboard from "./components/EnhancedDashboard";
import StudentDashboard from "./components/StudentDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import PaymentsTab from "./components/PaymentsTab";
import ReportsTab from "./components/ReportsTab";
import SettingsTab from "./components/SettingsTab";
import UserProfile from "./components/UserProfile";
import Toast, { useToast } from "./components/Toast";
import { 
  getRegistrations, 
  getAttendance, 
  getCourses, 
  getInstructors,
  getToken,
  setToken,
  clearToken
} from "./services/api";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [registrations, setRegistrations] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  // Toast notifications
  const { toasts, showToast } = useToast();

  useEffect(() => {
    // Check if user has a valid token
    const existingToken = getToken();
    const savedUser = localStorage.getItem("user");
    if (existingToken && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      fetchAllData();
    } else {
      // Clear localStorage if token doesn't exist
      clearToken();
      localStorage.removeItem("user");
    }
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [regs, att, crs, inst] = await Promise.all([
        getRegistrations(),
        getAttendance(),
        getCourses(),
        getInstructors()
      ]);
      setRegistrations(regs);
      setAttendanceList(att);
      setCourses(crs);
      setInstructors(inst);
      showToast("Data loaded successfully", "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowSignup(false);
    setActiveTab("dashboard");
    fetchAllData();
    showToast(`Welcome, ${user.name}!`, "success");
  };

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowSignup(false);
    setActiveTab("dashboard");
    fetchAllData();
    showToast(`Account created successfully! Welcome, ${user.name}!`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearToken();
    localStorage.removeItem("user");
    setShowSignup(false);
    setActiveTab("dashboard");
    showToast("Logged out successfully", "success");
  };

  // Render different UI based on role
  const renderTabs = () => {
    if (currentUser?.role === "student") {
      return (
        <>
          <button
            className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            ✓ My Attendance
          </button>
          <button
            className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            📚 Courses
          </button>
          <button
            className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            💳 My Payments
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 My Profile
          </button>
        </>
      );
    } else if (currentUser?.role === "instructor") {
      return (
        <>
          <button
            className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            ✓ Attendance
          </button>
          <button
            className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            📚 Courses
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 My Profile
          </button>
        </>
      );
    } else {
      // Admin - all tabs
      return (
        <>
          <button
            className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "registration" ? "active" : ""}`}
            onClick={() => setActiveTab("registration")}
          >
            📝 Registration
          </button>
          <button
            className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            ✓ Attendance
          </button>
          <button
            className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            📚 Courses
          </button>
          <button
            className={`tab-button ${activeTab === "instructors" ? "active" : ""}`}
            onClick={() => setActiveTab("instructors")}
          >
            👨‍🏫 Instructors
          </button>
          <button
            className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            💳 Payments
          </button>
          <button
            className={`tab-button ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            📋 Reports
          </button>
          <button
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 My Profile
          </button>
        </>
      );
    }
  };

  const renderContent = () => {
    if (currentUser?.role === "student") {
      return (
        <>
          {activeTab === "dashboard" && (
            <StudentDashboard currentUser={currentUser} attendanceList={attendanceList} />
          )}
          {activeTab === "attendance" && (
            <div>
              <h3>📋 Your Attendance Record</h3>
              <AttendanceList 
                attendanceList={attendanceList.filter(a => a.studentName === currentUser.name)} 
                onRefresh={fetchAllData}
                isStudentView={true}
              />
            </div>
          )}
          {activeTab === "courses" && (
            <CourseList courses={courses} onRefresh={fetchAllData} isStudentView={true} />
          )}
          {activeTab === "payments" && (
            <div>
              <h3>💳 My Payment History</h3>
              <PaymentsTab 
                students={registrations}
                courses={courses}
                onRefresh={fetchAllData}
                isStudentView={true}
                studentName={currentUser.name}
              />
            </div>
          )}
          {activeTab === "profile" && (
            <UserProfile currentUser={currentUser} />
          )}
        </>
      );
    } else if (currentUser?.role === "instructor") {
      return (
        <>
          {activeTab === "dashboard" && (
            <InstructorDashboard 
              currentUser={currentUser} 
              attendanceList={attendanceList}
              students={registrations}
            />
          )}
          {activeTab === "attendance" && (
            <>
              <AttendanceForm onSuccess={fetchAllData} />
              <AttendanceList attendanceList={attendanceList} onRefresh={fetchAllData} />
            </>
          )}
          {activeTab === "courses" && (
            <CourseList courses={courses} onRefresh={fetchAllData} isInstructorView={true} />
          )}
          {activeTab === "profile" && (
            <UserProfile currentUser={currentUser} />
          )}
        </>
      );
    } else {
      // Admin - full access
      return (
        <>
          {activeTab === "dashboard" && (
            <EnhancedDashboard 
              registrations={registrations}
              attendanceList={attendanceList}
              courses={courses}
              instructors={instructors}
            />
          )}
          {activeTab === "registration" && (
            <>
              <RegistrationForm onSuccess={fetchAllData} />
              <RegistrationList registrations={registrations} onRefresh={fetchAllData} />
            </>
          )}
          {activeTab === "attendance" && (
            <>
              <AttendanceForm onSuccess={fetchAllData} />
              <AttendanceList attendanceList={attendanceList} onRefresh={fetchAllData} />
            </>
          )}
          {activeTab === "courses" && (
            <>
              <CourseForm onSuccess={fetchAllData} />
              <CourseList courses={courses} onRefresh={fetchAllData} />
            </>
          )}
          {activeTab === "instructors" && (
            <>
              <InstructorForm onSuccess={fetchAllData} />
              <InstructorList instructors={instructors} onRefresh={fetchAllData} />
            </>
          )}
          {activeTab === "payments" && (
            <PaymentsTab 
              students={registrations}
              courses={courses}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === "reports" && (
            <ReportsTab 
              registrations={registrations}
              attendanceList={attendanceList}
              courses={courses}
              instructors={instructors}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab currentUser={currentUser} />
          )}
          {activeTab === "profile" && (
            <UserProfile currentUser={currentUser} />
          )}
        </>
      );
    }
  };

  if (!currentUser) {
    return (
      <div className="container">
        <Toast toasts={toasts} />
        <div className="card">
          <h1>🚗 Neha Motor Driving School</h1>
          <p className="subtitle">
            Learn safe and professional driving with expert instructors
          </p>
          
          {showSignup ? (
            <>
              <SignupForm onSuccess={handleSignupSuccess} />
              <p style={{ marginTop: "20px" }}>
                Already have an account?{" "}
                <button
                  onClick={() => setShowSignup(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1e3a8a",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px"
                  }}
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onSuccess={handleLoginSuccess} />
              <p style={{ marginTop: "20px" }}>
                Don't have an account?{" "}
                <button
                  onClick={() => setShowSignup(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1e3a8a",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px"
                  }}
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Toast toasts={toasts} />
      <div className="card">
        <div className="header-top">
          <h1>🚗 Neha Motor Driving School</h1>
          <div className="user-info">
            <span>Welcome, {currentUser.name} ({currentUser.role})</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>

        <p className="subtitle">
          Learn safe and professional driving with expert instructors
        </p>

        {/* Tabs Navigation - Role-based */}
        <div className="tabs">
          {renderTabs()}
        </div>

        {/* Loading Indicator */}
        {isLoading && <div className="loading-indicator">⏳ Loading data...</div>}

        {/* Content - Role-based */}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;