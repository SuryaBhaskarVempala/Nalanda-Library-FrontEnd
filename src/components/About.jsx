import React from "react";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">📚 Nalanda Library Management System</h1>
      <p className="about-intro">
        A full-stack <strong>MERN</strong> application designed to streamline library operations 
        with modern features and a clean, responsive UI. 
        Built with <span className="highlight">MongoDB, Express, React, Node.js</span>, 
        this system also supports RESTful APIs  for maximum flexibility.
      </p>

      <div className="about-sections">
        <div className="about-card">
          <h2>⚡ Tech Stack</h2>
          <ul>
            <li>Frontend: React (Responsive, Black Theme UI)</li>
            <li>Backend: Node.js, Express.js</li>
            <li>Database: MongoDB (Mongoose ODM)</li>
            <li>APIs: REST </li>
            <li>Authentication: JWT (Role-based: Admin & Member)</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>📖 Features</h2>
          <ul>
            <li>🔐 User Authentication & Roles (Admin / Member)</li>
            <li>📕 Book Management (Add, Update, Delete, List with Pagination & Filters)</li>
            <li>📌 Borrow & Return Books (with availability check)</li>
            <li>📜 Borrow History per Member</li>
            <li>🔎 Advanced Filters (Genre, Author, Search, Sorting by Date)</li>
            <li>📊 Reports: Most Borrowed Books, Active Members, Book Availability</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>🚀 Highlights</h2>
          <ul>
            <li>Clean & maintainable code structure</li>
            <li>MongoDB Aggregations for analytics & reports</li>
            <li>Responsive design (Desktop & Mobile)</li>
            <li>Minimal, industrial-grade UI with black theme</li>
            <li>Future-ready with Rest & Cloud Deployment capability</li>
          </ul>
        </div>
      </div>

      <p className="about-footer">
        💡 Designed to demonstrate **scalable architecture, clean code practices, and 
        full-stack expertise**. Aimed to deliver a production-ready, modern library system.
      </p>
    </div>
  );
}

export default About;
