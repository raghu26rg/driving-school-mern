import React, { useState, useEffect } from "react";
import { getPayments, addPayment, deletePayment } from "../services/api";

const PaymentsTab = ({ students, courses, onRefresh, isStudentView = false, studentName = "" }) => {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    studentName: isStudentView ? studentName : "",
    courseId: "",
    amount: "",
    paymentMethod: "Cash",
    paymentStatus: "Completed"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.courseId || !formData.amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addPayment(formData);
      setFormData({ 
        studentName: isStudentView ? studentName : "", 
        courseId: "", 
        amount: "", 
        paymentMethod: "Cash", 
        paymentStatus: "Completed" 
      });
      fetchPayments();
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this payment record?")) {
      try {
        await deletePayment(id);
        fetchPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const filteredPayments = isStudentView
    ? payments.filter(p => p.studentName === studentName)
    : payments.filter(p => 
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = filteredPayments.filter(p => p.paymentStatus === "Pending").reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = filteredPayments.filter(p => p.paymentStatus === "Completed").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-section">
      <div className="payment-stats">
        <div className="stat-card">
          <h4>Total Paid</h4>
          <p className="stat-value">₹{totalCompleted.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <p className="stat-value" style={{ color: "#ff6b6b" }}>₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Total</h4>
          <p className="stat-value">{filteredPayments.length}</p>
        </div>
      </div>

      {/* Only admins and instructors can record payments */}
      {!isStudentView && (
        <form onSubmit={handleSubmit} className="form-section">
          <h3>Record Payment</h3>
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
            />
          </div>
          <div className="form-group">
            <label>Course *</label>
            <select name="courseId" value={formData.courseId} onChange={handleChange}>
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseName} - ₹{course.price}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <button type="submit" className="btn-submit">Record Payment</button>
        </form>
      )}

      <div className="list-section">
        <h3>{isStudentView ? "Your Payment History" : "Payment History"}</h3>
        {!isStudentView && (
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        )}

        <table className="table">
          <thead>
            <tr>
              {!isStudentView && <th>Student</th>}
              <th>Course</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              {!isStudentView && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map(payment => (
              <tr key={payment._id}>
                {!isStudentView && <td>{payment.studentName}</td>}
                <td>{payment.courseId}</td>
                <td>₹{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>
                  <span className={`status-badge status-${payment.paymentStatus.toLowerCase()}`}>
                    {payment.paymentStatus}
                  </span>
                </td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                {!isStudentView && (
                  <td>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
            No payment records found
          </p>
        )}

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
