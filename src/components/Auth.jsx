import React, { useState } from 'react';
import Login from './Login'; // Import your Login component
import Register from './Register'; // Import your Register component
import { motion } from 'framer-motion';
import './Auth.css';
import { Link } from 'react-router-dom';

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
            <div className='text-2xl absolute top-2 left-2'>
                <Link to="/">
                    return
                </Link>
            </div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-8 shadow-md w-96 mx-auto my-auto" style={{ backgroundColor: "#F6D6D6", borderRadius: "25px" }}>
                <div className={`LoginToggle ${login === true ? "left" : "right"}`}>
                    <button className='h-12 w-full z-10 text-center' onClick={setTrue}>
                        <span>Login</span>
                    </button>
                    <button className='h-12 w-full z-10 text-center' onClick={setfalse}>
                        <span>Register</span>
                    </button>
                </div>
                {login ? (
                    <Login />
                ) : (
                    <Register />
                )}
            </motion.div>
        </div>
    );
};

export default AuthPage;
