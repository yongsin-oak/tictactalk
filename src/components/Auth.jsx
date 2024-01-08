import React, { useState } from 'react';
import Login from './Login'; // Import your Login component
import Register from './Register'; // Import your Register component
import { motion } from 'framer-motion';
import './Auth.css';

const AuthPage = () => {
    const [login, setLogin] = useState(true);

    const setTrue = () => {
        setLogin(true);
    };
    const setfalse = () => {
        setLogin(false);
    };
    return (
        <div className="h-screen flex items-center justify-center relative">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white p-8 rounded shadow-md w-96 mx-auto my-auto relative">
                {login ? (
                    <Login />
                ) : (
                    <Register />
                )}
                <div className={`LoginToggle ${login === true ? "left" : "right"}`}>
                    <button className='h-12 w-12 z-10 mx-12' onClick={setTrue}>Login</button>
                    <button className='h-12 w-12 z-10 mx-12' onClick={setfalse}>Register</button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
