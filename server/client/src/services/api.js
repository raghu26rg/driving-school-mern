const API_URL = "http://localhost:5000";

// ===== REGISTRATION APIs =====
export const registerStudent = async (formData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  return response.text();
};

export const getRegistrations = async (search = "", vehicle = "") => {
  let url = `${API_URL}/registrations`;
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (vehicle) params.append("vehicle", vehicle);
  if (params.toString()) url += `?${params.toString()}`;
  const response = await fetch(url);
  return response.json();
};

export const getRegistrationById = async (id) => {
  const response = await fetch(`${API_URL}/registrations/${id}`);
  return response.json();
};

export const updateRegistration = async (id, formData) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  return response.json();
};

export const deleteRegistration = async (id) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    method: "DELETE"
  });
  return response.json();
};

// ===== ATTENDANCE APIs =====
export const markAttendance = async (attendanceData) => {
  const response = await fetch(`${API_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendanceData)
  });
  return response.text();
};

export const getAttendance = async () => {
  const response = await fetch(`${API_URL}/attendance`);
  return response.json();
};

export const getAttendanceByStudent = async (studentName) => {
  const response = await fetch(`${API_URL}/attendance/${studentName}`);
  return response.json();
};

export const updateAttendance = async (id, attendanceData) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendanceData)
  });
  return response.json();
};

export const deleteAttendance = async (id) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: "DELETE"
  });
  return response.json();
};

// ===== COURSES APIs =====
export const createCourse = async (courseData) => {
  const response = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData)
  });
  return response.json();
};

export const getCourses = async () => {
  const response = await fetch(`${API_URL}/courses`);
  return response.json();
};

export const getCourseById = async (id) => {
  const response = await fetch(`${API_URL}/courses/${id}`);
  return response.json();
};

export const updateCourse = async (id, courseData) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData)
  });
  return response.json();
};

export const deleteCourse = async (id) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: "DELETE"
  });
  return response.json();
};

// ===== INSTRUCTORS APIs =====
export const createInstructor = async (instructorData) => {
  const response = await fetch(`${API_URL}/instructors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(instructorData)
  });
  return response.json();
};

export const getInstructors = async () => {
  const response = await fetch(`${API_URL}/instructors`);
  return response.json();
};

export const getInstructorById = async (id) => {
  const response = await fetch(`${API_URL}/instructors/${id}`);
  return response.json();
};

export const updateInstructor = async (id, instructorData) => {
  const response = await fetch(`${API_URL}/instructors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(instructorData)
  });
  return response.json();
};

export const deleteInstructor = async (id) => {
  const response = await fetch(`${API_URL}/instructors/${id}`, {
    method: "DELETE"
  });
  return response.json();
};

// ===== AUTHENTICATION APIs =====
export const signup = async (name, email, password, role = "student") => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

// ===== PAYMENTS APIs =====
export const addPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};

export const getPayments = async () => {
  const response = await fetch(`${API_URL}/payments`);
  return response.json();
};

export const deletePayment = async (id) => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE"
  });
  return response.json();
};

export const updatePayment = async (id, paymentData) => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};

// ===== DASHBOARD APIs =====
export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/dashboard/stats`);
  return response.json();
};
