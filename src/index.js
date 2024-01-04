// src/App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import Login from './components/Login.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register.jsx';
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';
import App from './App.jsx';
import TicTacToe from './components/tictactoe.jsx';
import ProtectedRoute from './auth/protectedRoute.jsx';
import ProtectedRoute2 from './auth/protectedRoute2.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Login",
    element: <ProtectedRoute2><Login /></ProtectedRoute2>
  },
  {
    path: "/Register",
    element: <ProtectedRoute2><Register /></ProtectedRoute2>
  },
  {
    path: "/tictactoe",
    element: <ProtectedRoute><TicTacToe /></ProtectedRoute>
  }

])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)
