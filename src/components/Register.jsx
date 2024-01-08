import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, TextField, Button } from '@mui/material';
import { useUserAuth } from '../context/UserAuthContext';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import styles from './Register.module.css';
import { auth } from '../firebase';

const Register = () => {
  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useUserAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (step === 1) {
        // Step 1: Check email
        await signUp('', email, password);

        // Move to step 2
        setStep(2);
      } else if (step === 2) {
        // Step 2: Register with username
        await signUp(username, email, password);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {error && (
          <Alert severity="error" variant="filled" className="my-3">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="mb-4 relative">
              <TextField
                type="email"
                label="Email"
                variant="standard"
                className="w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mb-4 relative">
                <TextField
                  type={passwordVisible ? 'text' : 'password'}
                  label="Password"
                  variant="standard"
                  className="bg-white w-full"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute top-5 right-0 pr-2 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEye : faEyeSlash}
                    id="eyeIcon"
                    style={{ color: '#999999' }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mb-4 relative">
              <TextField
                type="text"
                id="standard-basic"
                label="Username"
                variant="standard"
                className="w-full"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2"
          >
            {step === 1 ? 'Next' : 'Register'}
          </button>
        </form>

        {step === 2 && (
          <div>
            <button
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-700 mb-2"
              onClick={() => setStep(1)}
            >
              Go Back to Step 1
            </button>
            <p className="mt-4">
              Already have an account?{' '}
              <Link to="/Login" className="text-blue-500">
                Log in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
