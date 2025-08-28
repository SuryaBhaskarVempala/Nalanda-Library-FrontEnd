import React from 'react';
import '../styles/NotFound.css';

const NotFound = () => {

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="error-code">404</h1>
        <h2 className="message">Oops! The page you are looking for does not exist.</h2>
        <p className="hint">You might want to check the URL or return to the homepage.</p>
        <button className="button" onClick={() => window.location.href = '/'}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound; 