import React from 'react';
import { Link } from 'react-router-dom';
import './Customer.css';

const CustomerDashboard = () => {
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome to Car Rental Platform</h1>
        <p>Find and rent your perfect car</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/customer/browse" className="dashboard-card">
          <div className="card-icon">🚗</div>
          <h2>Browse Cars</h2>
          <p>Explore available cars and find the perfect one for your needs</p>
        </Link>

        <Link to="/customer/bookings" className="dashboard-card">
          <div className="card-icon">📅</div>
          <h2>My Bookings</h2>
          <p>View and manage your car rental bookings</p>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
