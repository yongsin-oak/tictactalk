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
            <p>Welcome, {user.displayName || 'User'}!</p>
            <Box mt={2} className="gap-2 grid w-4/12 m-auto">
                <Link to="/tictactoe" className='grid'>
                    <button class="h-14 w-full bg-green-500 hover:bg-green-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-green-700 hover:border-green-500 rounded
                 text-2xl">
                        Play!
                    </button>
                </Link>
                <Link to="/UserProfile" className='grid'>
                    <button class="h-14 w-full bg-blue-500 hover:bg-blue-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-blue-700 hover:border-blue-500 rounded
                 text-2xl">
                        Profile
                    </button>
                </Link>
                <button
                    class="bg-transparent h-14 w-full 
                hover:bg-red-500 
                text-red-700 font-thin 
                hover:text-white py-2 px-4 border border-red-500 
                hover:border-transparent rounded
                text-2xl" onClick={handleLogout}>
                    Log out
                </button>
            </Box>
        </div>
    );
}

export default HomepageLogging