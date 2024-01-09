import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

function HomePage() {
    return (
        <div className="grid grid-cols-2 justify-center gap-2 w-full">
            <Link to="/Auth">
                <button class="h-14 w-4/5 
                bg-blue-500 hover:bg-blue-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-blue-700 hover:border-blue-500 rounded
                 text-2xl">
                    Login
                </button>
            </Link>

            <Link to="/Auth">
                <button
                class="bg-transparent h-14 w-4/5 
                hover:bg-blue-500 
                text-blue-700 font-thin 
                hover:text-white py-2 px-4 border border-blue-500 
                hover:border-transparent rounded
                text-2xl">
                    Register
                </button>
            </Link>
        </div>
    );
}

export default HomePage;
