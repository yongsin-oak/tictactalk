import React, { useEffect } from 'react';
import { useUserAuth } from './context/UserAuthContext';
import HomePage from './components/HomePage';
import HomepageLogging from './components/HomepageLogging';
import io from 'socket.io-client'; // Import the socket.io-client library
import './App.css';

const App = () => {
  const { user } = useUserAuth();

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:5000'); // Update with your server URL

    // Add any socket event listeners or emit events as needed

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

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
