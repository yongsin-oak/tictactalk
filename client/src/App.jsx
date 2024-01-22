import React, { useEffect } from 'react';
import { useUserAuth } from './context/UserAuthContext';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import io from 'socket.io-client';
import './App.css';

const App = () => {
  const { user } = useUserAuth();
  const socket = io('http://localhost:5000'); // Replace with your server URL

  useEffect(() => {
    // ComponentDidMount equivalent
    console.log('Connecting to Socket.io server');

    // Event listener for connection
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    // Event listener for disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    // ComponentWillUnmount equivalent
    return () => {
      console.log('Disconnecting from Socket.io server');
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, [socket]); // Run the effect only when the socket instance changes

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
