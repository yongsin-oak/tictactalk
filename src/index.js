// src/App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';
import App from './App.jsx';
import TicTacToe from './components/tictactoe.jsx';
import ProtectedRoute from './auth/protectedRoute.jsx';
import ProtectedRouteUser from './auth/protectedRouteUser.jsx';
import AuthPage from './components/Auth.jsx';
import DrawX from './components/DrawXO.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Auth",
    element: <ProtectedRouteUser><AuthPage /></ProtectedRouteUser>
  },
  {
    path: "/Tictactoe",
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
