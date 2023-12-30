import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import "../dist/output.css"
import { useUserAuth } from '../context/UserAuthContext'
import { Link, useNavigate, userNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp, user} = useUserAuth();

  let navigate = useNavigate();

  useEffect(() => {
    // If the user is already logged in, redirect to a specific page (e.g., '/home')
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const togglePasswordVisibility = (inputType, setState) => {
    setState((prev) => !prev);
    const passwordInput = document.getElementById(inputType);
    passwordInput.type = passwordVisible ? 'password' : 'text';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try{
      await signUp(email, password);
      navigate("/");
    } catch(err){
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {error && <Alert variatnt="danger">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label htmlFor="username" className="text-gray-500">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border p-2 rounded"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div> */}

          <div className="mb-4">
            <label htmlFor="email" className="text-gray-500">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border p-2 rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="text-gray-500">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              className="w-full border p-2 rounded pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye icon to toggle password visibility */}
            <div
              className="absolute top-9 right-0 pr-2 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('password', setPasswordVisible)}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} id="eyeIcon" style={{color: "#999999",}}/>
            </div>
          </div>

          {/* <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="text-gray-500">Confirm Password</label>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className="w-full border p-2 rounded pr-10"
            />
            <div
              className="absolute top-9 right-0 pr-2 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('confirmPassword', setConfirmPasswordVisible)}
            >
              <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} id="eyeIcon" style={{color: "#999999",}}/>
            </div>
          </div> */}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2"
          >
            Register
          </button>

          <p className="mt-4">
            Already have an account? <a href="/Login" className="text-blue-500">Log in here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
