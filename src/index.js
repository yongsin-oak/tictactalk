// src/App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import Login from './components/Login.jsx';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register.jsx';
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';
import App from './App.jsx';
import TicTacToe from './components/tictactoe.jsx';
import ProtectedRoute from './auth/protectedRoute.jsx';
import ProtectedRoute2 from './auth/protectedRoute2.jsx';

// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";

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

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/Login" element={<Login />} />
//         <Route path="/Register" element={<Register />} />
//       </Routes>
//     </BrowserRouter>
      /* <GoogleOAuthProvider clientId="379005474410-li3se0jp9c9anaa6e1v6q81b9urqc3kp.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={credentialResponse => {
            const details = jwtDecode(credentialResponse.credential);
            console.log(details);
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
      </GoogleOAuthProvider>; */
//   );
// }