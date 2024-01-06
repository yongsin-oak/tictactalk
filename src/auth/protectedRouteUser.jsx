import React from 'react'
import { useUserAuth } from '../context/UserAuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute2({ children }) {
  const { user } = useUserAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute2