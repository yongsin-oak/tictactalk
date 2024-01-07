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
import ProtectedRouteUser from './auth/protectedRouteUser.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import UserProfile from './components/UserProfile.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Login",
    element: <ProtectedRouteUser><Login /></ProtectedRouteUser>
  },
  {
    path: "/Register",
    element: <ProtectedRouteUser><Register /></ProtectedRouteUser>
  },
  {
    path: "/Tictactoe",
    element: <ProtectedRoute><TicTacToe /></ProtectedRoute>
  },
  {
    path: "/UserProfile",
    element: <ProtectedRoute><UserProfile /></ProtectedRoute>
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)
