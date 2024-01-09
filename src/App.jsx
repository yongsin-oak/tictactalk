import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useUserAuth } from './context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import './App.css';

function Home() {
  const { user } = useUserAuth();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-thin mb-6">Tic Tac Talk</h1>
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
