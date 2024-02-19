import React from 'react';
import { useUserAuth } from './context/UserAuthContext';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import './App.css';

const App = () => {
  const { user } = useUserAuth();

  return (
    <div className="flex h-screen items-center justify-center w-screen">
      {user ? (
        <HomepageLogging></HomepageLogging>
      ) : (
        <HomePage></HomePage>
      )}
    </div>
  );
}

export default App;
