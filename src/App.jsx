import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useUserAuth } from './context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';

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
          <HomepageLogging></HomepageLogging>
        ) : (
          <HomePage></HomePage>
        )}
      </div>
    </div>
  );
}

export default Home;
