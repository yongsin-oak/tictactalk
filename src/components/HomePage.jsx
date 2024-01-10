import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthPage from './Auth';

function HomePage() {
    const [showLogin, setShowLogin] = useState(true);

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleRegisterClick = () => {
        setShowLogin(false);
    };
    return (
        <div className="justify-center gap-2 w-full">
            <Link to="/Auth" onClick={handleLoginClick}>
                <button class="h-14 w-4/5 
                bg-blue-500 hover:bg-blue-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-blue-700 hover:border-blue-500 rounded
                 text-2xl">
                    Login
                </button>
            </Link>
        </div>
    );
}

export default HomePage;
