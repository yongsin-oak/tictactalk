import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
function HomepageLogging() {
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
        <div>
            <p>Welcome, {user.displayName}!</p>
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
    );
}

export default HomepageLogging