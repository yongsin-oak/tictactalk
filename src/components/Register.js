import React, { useState } from 'react';

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (inputType, setState) => {
    setState((prev) => !prev);
    const passwordInput = document.getElementById(inputType);
    passwordInput.type = passwordVisible ? 'password' : 'text';
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        <form>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border p-2 rounded"
              placeholder="Username"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border p-2 rounded"
              placeholder="Email"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              className="w-full border p-2 rounded pr-10"
              placeholder="Password"
            />
            {/* Eye icon to toggle password visibility */}
            <div
              className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('password', setPasswordVisible)}
            >
              <i className={`far ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} text-gray-500`}></i>
            </div>
          </div>

          <div className="mb-4 relative">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className="w-full border p-2 rounded pr-10"
              placeholder="Confirm Password"
            />
            {/* Eye icon to toggle password visibility */}
            <div
              className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('confirmPassword', setConfirmPasswordVisible)}
            >
              <i
                className={`far ${confirmPasswordVisible ? 'fa-eye' : 'fa-eye-slash'} text-gray-500`}
              ></i>
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
            Already have an account? <a href="/Login" className="text-blue-500">Log in here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
