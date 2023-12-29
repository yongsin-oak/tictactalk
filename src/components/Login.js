// src/components/Login.js
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = () => {
  const togglePasswordVisibility = (inputId, iconId) => {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form>
          <div className="mb-4">
            <input type="text" id="username" name="username" className="w-full border p-2 rounded" placeholder="Username" />
          </div>

          <div className="mb-4 relative">
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border p-2 rounded pr-10"
              placeholder="Password"
            />
            <div
              className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('password', 'eyeIcon')}
            >
              <i id="eyeIcon" className="far fa-eye-slash text-gray-500"></i>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <input type="checkbox" id="rememberMe" name="rememberMe" className="mr-2" />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <a href="#" className="text-sm text-blue-500 block mb-4">
            Forgot Password?
          </a>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mb-2">
            Log In
          </button>

          <p className="mt-4">
            Don't have an account? <a href="/Register" className="text-blue-500">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
