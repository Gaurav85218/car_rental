import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import BrowseCars from './pages/customer/BrowseCars';
import CarDetails from './pages/customer/CarDetails';
import BookingHistory from './pages/customer/BookingHistory';

// Host Pages
import HostDashboard from './pages/host/Dashboard';
import AddCar from './pages/host/AddCar';
import ManageCars from './pages/host/ManageCars';
import EditCar from './pages/host/EditCar';
import HostBookings from './pages/host/Bookings';

// Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {user && <Navbar user={user} setUser={setUser} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute user={user} role="CUSTOMER">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/browse"
          element={
            <PrivateRoute user={user} role="CUSTOMER">
              <BrowseCars />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/car/:id"
          element={
            <PrivateRoute user={user} role="CUSTOMER">
              <CarDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/bookings"
          element={
            <PrivateRoute user={user} role="CUSTOMER">
              <BookingHistory />
            </PrivateRoute>
          }
        />

        {/* Host Routes */}
        <Route
          path="/host/dashboard"
          element={
            <PrivateRoute user={user} role="HOST">
              <HostDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/host/add-car"
          element={
            <PrivateRoute user={user} role="HOST">
              <AddCar />
            </PrivateRoute>
          }
        />
        <Route
          path="/host/manage-cars"
          element={
            <PrivateRoute user={user} role="HOST">
              <ManageCars />
            </PrivateRoute>
          }
        />
        <Route
          path="/host/edit-car/:id"
          element={
            <PrivateRoute user={user} role="HOST">
              <EditCar />
            </PrivateRoute>
          }
        />
        <Route
          path="/host/bookings"
          element={
            <PrivateRoute user={user} role="HOST">
              <HostBookings />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'CUSTOMER' ? '/customer/dashboard' : '/host/dashboard') : '/customer/browse'} />} />
      </Routes>
    </Router>
  );
}

export default App;
