// src/App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';
import App from './App.jsx';
import ProtectedRoute from './auth/protectedRoute.jsx';
import ProtectedRouteUser from './auth/protectedRouteUser.jsx';
import Game from './components/Game.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Game",
    element: <ProtectedRoute><Game /></ProtectedRoute>
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)
