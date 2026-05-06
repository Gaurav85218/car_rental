import React from 'react';
import { Link } from 'react-router-dom';
import './Host.css';

const HostDashboard = () => {
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Host Dashboard</h1>
        <p>Manage your car rental business</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/host/add-car" className="dashboard-card">
          <div className="card-icon">➕</div>
          <h2>Add New Car</h2>
          <p>List a new car for rent</p>
        </Link>

        <Link to="/host/manage-cars" className="dashboard-card">
          <div className="card-icon">🚗</div>
          <h2>Manage Cars</h2>
          <p>Edit or delete your listed cars</p>
        </Link>

        <Link to="/host/bookings" className="dashboard-card">
          <div className="card-icon">📅</div>
          <h2>Bookings</h2>
          <p>View bookings for your cars</p>
        </Link>
      </div>
    </div>
  );
};

export default HostDashboard;
