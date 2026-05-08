import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'CUSTOMER' ? '/customer/dashboard' : '/host/dashboard'} />;
  }

  return children;
};

export default PrivateRoute;
