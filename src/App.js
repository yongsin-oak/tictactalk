// src/App.js
import React from 'react';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';


// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
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
  );
}