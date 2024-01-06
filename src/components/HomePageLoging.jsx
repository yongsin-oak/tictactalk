import React from 'react'
import { Button, Link, Box } from '@mui/material'
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
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
            <p>Welcome, {user}!</p>
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
    )
}

export default HomePage