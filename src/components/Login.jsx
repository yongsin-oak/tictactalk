import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useUserAuth } from '../context/UserAuthContext';
import './Login.css'

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await logIn(email, password);
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('User not found');
          break;
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        default:
          setError('Something went wrong. Please try again.');
          break;
      }
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        {error && <Alert severity="error" variant="filled" className='my-3'>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            
            <input
              type="text"
              id="email"
              name="email"
              className="w-full border p-2 rounded"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="text-gray-500 label-placeholder">
              Email
            </label>
          </div>

          <div className="mb-4 relative">
            
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              className="w-full border p-2 rounded pr-10"
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="text-gray-500 label-placeholder">
              Password
            </label>
            <div
              className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} id="eyeIcon" style={{ color: "#999999" }} />
            </div>
          </div>

          <Link to="/Register" className="text-sm text-blue-500 block mb-4">
            Forgot Password?
          </Link>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2">
            Log In
          </button>

          <p className="mt-4">
            Don't have an account? <Link to="/Register" className="text-blue-500">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
