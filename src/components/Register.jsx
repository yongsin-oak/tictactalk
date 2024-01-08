import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { Alert, TextField } from '@mui/material';
import { useUserAuth } from '../context/UserAuthContext';

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(username, email, password);
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password should be at least 8 characters");
          break;
        case "auth/email-already-in-use":
          setError("Email address is already in use");
          break;
        default:
          setError("Something went wrong. Please try again.");
          break;
      }
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className='text-2xl absolute top-2 left-2'>
        <Link to="/">
          return
        </Link>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {error && <Alert severity="error" variant="filled" className='my-3'>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <TextField type='text'
              id="standard-basic"
              label="Username"
              variant="standard"
              className='w-full'
              onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="mb-4 relative">
            <TextField type='email'
              id="standard-basic"
              label="Email"
              variant="standard"
              className='w-full'
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-4 relative">
            <TextField type={passwordVisible ? 'text' : 'password'}
              id="standard-basic"
              label="Password"
              variant="standard"
              className='bg-white w-full'
              onChange={(e) => setPassword(e.target.value)} />
            <div
              className="absolute top-5 right-0 pr-2 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} id="eyeIcon" style={{ color: "#999999" }} />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2"
          >
            Register
          </button>

          <p className="mt-4">
            Already have an account? <Link to="/Login" className="text-blue-500">Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
