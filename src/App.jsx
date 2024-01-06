import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useUserAuth } from './context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import HomePage from './components/HomePage';
import HomePageLoging from './components/HomePageLoging';


function Home() {
  const { logOut, user } = useUserAuth();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Home Page</h1>
        {user ? (
          <HomePageLoging></HomePageLoging>
        ) : (
          <HomePage></HomePage>
        )}
      </div>
    </div>
  );
}

export default Home;
