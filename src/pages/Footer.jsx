import React from "react";
import "../styles/Navbar.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Nalanda Library. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
