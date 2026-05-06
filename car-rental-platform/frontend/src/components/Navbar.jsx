import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🚗 Car Rental
        </Link>

        <div className="navbar-menu">
          {user?.role === 'CUSTOMER' ? (
            <>
              <Link to="/customer/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/customer/browse" className="nav-link">Browse Cars</Link>
              <Link to="/customer/bookings" className="nav-link">My Bookings</Link>
            </>
          ) : (
            <>
              <Link to="/host/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/host/add-car" className="nav-link">Add Car</Link>
              <Link to="/host/manage-cars" className="nav-link">Manage Cars</Link>
              <Link to="/host/bookings" className="nav-link">Bookings</Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.username}</span>
          <button onClick={handleLogout} className="button button-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
