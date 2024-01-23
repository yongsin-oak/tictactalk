import React, { useEffect } from 'react';
import { useUserAuth } from './context/UserAuthContext';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import io from 'socket.io-client';
import './App.css';

const App = () => {
  const { user } = useUserAuth();

  return (
    <div className="flex h-screen items-center justify-center">
      {user ? (
        <HomepageLogging></HomepageLogging>
      ) : (
        <HomePage></HomePage>
      )}
    </div>
  );
}

export default App;
