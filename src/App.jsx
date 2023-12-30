import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useUserAuth } from './context/UserAuthContext';
import './dist/output.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Home Page</h1>

        {user ? (
          <div className="space-y-4 flex">
            {/* Other content for logged-in users */}
            <p>Welcome, {user.email}!</p>
            <Button onClick={handleLogout} variant="contained" color="error">
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-4 flex">
            {/* Content for users who are not logged in */}
            <Link to="/login" className="mx-2">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>

            <Link to="/register" className="mx-2">
              <Button variant="outlined">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
