// src/App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';
import App from './App.jsx';
import ProtectedRoute from './auth/protectedRoute.jsx';
import Tictactoe from './components/tictactoe.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/roomgame",
    element: <ProtectedRoute><Tictactoe /></ProtectedRoute>
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>

)
