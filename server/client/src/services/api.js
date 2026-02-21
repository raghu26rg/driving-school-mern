const API_URL = "http://localhost:5000";

// ===== JWT TOKEN MANAGEMENT =====
// Get token from localStorage
export const getToken = () => localStorage.getItem("authToken");

// Store token in localStorage
export const setToken = (token) => localStorage.setItem("authToken", token);

// Clear token from localStorage
export const clearToken = () => localStorage.removeItem("authToken");

// Get authorization header with token
const getAuthHeader = () => {
  const token = getToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

// ===== API RESPONSE HANDLER =====
// Wrapper to handle API responses consistently
export const handleResponse = async (response) => {
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }
  // Return data directly if it exists, otherwise return entire response
  return json.data || json;
};

// ===== REGISTRATION APIs =====
export const registerStudent = async (formData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
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
  const response = await fetch(url, {
    headers: getAuthHeader()
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Failed to fetch registrations");
  return json.data || json;
};

export const getRegistrationById = async (id) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    headers: getAuthHeader()
  });
  return response.json();
};

export const updateRegistration = async (id, formData) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(formData)
  });
  return response.json();
};

export const deleteRegistration = async (id) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });
  return response.json();
};

// ===== ATTENDANCE APIs =====
export const markAttendance = async (attendanceData) => {
  const response = await fetch(`${API_URL}/attendance`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(attendanceData)
  });
  return response.text();
};

export const getAttendance = async () => {
  const response = await fetch(`${API_URL}/attendance`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const getAttendanceByStudent = async (studentName) => {
  const response = await fetch(`${API_URL}/attendance/${studentName}`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const updateAttendance = async (id, attendanceData) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(attendanceData)
  });
  return response.json();
};

export const deleteAttendance = async (id) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });
  return response.json();
};

// ===== COURSES APIs =====
export const createCourse = async (courseData) => {
  const response = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(courseData)
  });
  return response.json();
};

export const getCourses = async () => {
  const response = await fetch(`${API_URL}/courses`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const getCourseById = async (id) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const updateCourse = async (id, courseData) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(courseData)
  });
  return response.json();
};

export const deleteCourse = async (id) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });
  return response.json();
};

// ===== INSTRUCTORS APIs =====
export const createInstructor = async (instructorData) => {
  const response = await fetch(`${API_URL}/instructors`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(instructorData)
  });
  return response.json();
};

export const getInstructors = async () => {
  const response = await fetch(`${API_URL}/instructors`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const getInstructorById = async (id) => {
  const response = await fetch(`${API_URL}/instructors/${id}`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const updateInstructor = async (id, instructorData) => {
  const response = await fetch(`${API_URL}/instructors/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(instructorData)
  });
  return response.json();
};

export const deleteInstructor = async (id) => {
  const response = await fetch(`${API_URL}/instructors/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
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
  const data = await response.json();
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

// ===== PAYMENTS APIs =====
export const addPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(paymentData)
  });
  return handleResponse(response);
};

export const getPayments = async () => {
  const response = await fetch(`${API_URL}/payments`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const deletePayment = async (id) => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });
  return response.json();
};

export const updatePayment = async (id, paymentData) => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};

// ===== DASHBOARD APIs =====
export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};
