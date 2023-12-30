import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import "../dist/output.css"
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
import { useUserAuth } from '../context/UserAuthContext'

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, user} = useUserAuth();

  let navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    // If the user is already logged in, redirect to the home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try{
      await logIn(email, password);
    } catch(err){
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        {error && <Alert variatnt="danger">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="email" id="email" name="email" className="w-full border p-2 rounded" placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="mb-4 relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              className="w-full border p-2 rounded pr-10"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} id="eyeIcon" style={{color: "#999999",}}/>
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
