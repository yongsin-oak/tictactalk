import React from 'react';
import { useUserAuth } from './context/UserAuthContext';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import io from 'socket.io-client';
import './App.css';

const App = () => {
  const { user } = useUserAuth();
  const socket = io('http://localhost:5000'); // Replace with your server URL

  socket.on('connect', () => {
    console.log('Connected to Socket.io server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io server');
  });

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

export default App;
