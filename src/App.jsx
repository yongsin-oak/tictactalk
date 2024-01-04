import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useUserAuth } from './context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';


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
          <div>
            <p>Welcome, {user.email}!</p>
            <Box mt={2} className="gap-2 grid w-4/12 m-auto">
              <Link to="/tictactoe" className='grid'>
                <Button variant="contained" color="success">
                  Play test
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outlined" color="error">
                Logout
              </Button>
            </Box>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            <Link to="/login">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="outlined">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
