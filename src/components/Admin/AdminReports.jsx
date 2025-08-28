import React, { useEffect, useState } from "react";
import "../../styles/AdminReports.css";
import axios from "axios";

function AdminReports() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);
  const [bookStats, setBookStats] = useState({ total: 0, borrowed: 0, available: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {

          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/admin/`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          });
          setBorrowedBooks(data.borrowedBooks);
          setActiveMembers(data.activeMembers);
          setBookStats(data.bookStats);
        }
        else {
          window.location.href = '/login';
        }

      } catch (err) {
        console.error("Error fetching reports:", err);
        setErrors("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "400px", minHeight: "30vh", color: "#fff" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "400px", minHeight: "30vh", color: "red" }}>{error}</p>;
  return (
    <div className="reports-container">
      <h2 className="reports-title">📊 Library Reports</h2>

      {/* Book Availability Summary */}
      <div className="stats-cards">
        <div className="stat-card total">
          <h3>Total Books</h3>
          <p>{bookStats.total}</p>
        </div>
        <div className="stat-card borrowed">
          <h3>Borrowed</h3>
          <p>{bookStats.borrowed}</p>
        </div>
        <div className="stat-card available">
          <h3>Available</h3>
          <p>{bookStats.available}</p>
        </div>
      </div>

      {/* Most Borrowed Books */}
      <div className="report-section-container">
        <div className="report-section">
          <h3>📚 Most Borrowed Books</h3>
          <ul className="report-list">
            {borrowedBooks.map((book, index) => (
              <li key={index}>
                <span>{book.title}</span>
                <span className="count">{book.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Members */}
        <div className="report-section">
          <h3>👤 Active Members</h3>
          <ul className="report-list">
            {activeMembers.map((member, index) => (
              <li key={index}>
                <span>{member.name}</span>
                <span className="count">{member.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
