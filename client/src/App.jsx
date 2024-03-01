import React from 'react';
import { useUserAuth } from './context/UserAuthContext';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import NavigationBar from './components/NavigationBar';
import './App.css';

const App = () => {
  const { user } = useUserAuth();

  return (
    <div className='h-screen flex flex-col'>
      <NavigationBar></NavigationBar>
      <div className="flex items-center justify-center w-screen flex-1" >
        {user ? (
          <HomepageLogging></HomepageLogging>
        ) : (
          <HomePage></HomePage>
        )}
      </div>
    </div>
  );
}

export default App;
