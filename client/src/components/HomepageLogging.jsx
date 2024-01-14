import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Collapse } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Edit } from '@mui/icons-material';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';

function HomepageLogging() {
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();
    const [iserror, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(true);
    const [username, setUserName] = useState({
        displayName: user.displayName,
    });

    useEffect(() => {
        // Update form values when user changes (e.g., on login)
        setUserName({
            displayName: user.displayName,
        });
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.displayName.trim()) {
            // Display an error alert if the username is blank
            setIsError(true);
            setError("Username cannot be blank");
            setOpen(true);
            return;
        }

        try {
            // Update user profile in Firebase Authentication
            await updateProfile(auth.currentUser, {
                displayName: username.displayName,
            });

            // Wait for the authentication state to change
            await new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (updatedUser) => {
                    if (updatedUser && updatedUser.displayName === username.displayName) {
                        resolve();
                        unsubscribe(); // Unsubscribe once the condition is met
                    }
                });
            });

            // Update user document in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                username: username.displayName,
            });

            // Reset error state
            setIsError(false);
            setError("Username changed successfully");
        } catch (error) {
            setIsError(true);
            setError(error.message);
        }

        // Ensure the alert is open
        setOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserName((prevValues) => ({ ...prevValues, [name]: value }));
    };

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
            {error && <Collapse in={open}>
                <Alert onClose={() => { setOpen(false); }} severity={iserror ? "error" : "success"} variant="filled" className='my-3'>{error}</Alert>
            </Collapse>}
            <form onSubmit={handleSubmit}>
                <div className='flex w-full justify-center'>
                    <p>
                        Welcome,
                    </p>
                    <input
                        type="text"
                        name="displayName"
                        className='mx-1 w-1/4 bg-transparent px-1 focus:outline-none'
                        placeholder='Name?'
                        onChange={handleChange}
                        value={username.displayName}
                        autoComplete="off"
                    />
                    <motion.button whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}>
                        <Edit></Edit>
                    </motion.button>
                </div>
            </form>
            {/* Rest of your code */}
            <Box mt={2} className="gap-2 grid w-4/12 m-auto">
                <Link to="/tictactoe" className='grid'>
                    <motion.button className="h-14 w-full bg-green-500 hover:bg-green-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-green-700 hover:border-green-500 rounded
                 text-2xl" whileTap={{ transform: "translateY(5px)" }}>
                        Play!
                    </motion.button>
                </Link>

                <button
                    className="bg-transparent h-14 w-full 
                hover:bg-red-500 
                text-red-700 font-thin 
                hover:text-white py-2 px-4 border border-red-500 
                hover:border-transparent rounded
                text-2xl" onClick={handleLogout}>
                    Log out
                </button>
                <Link to="/CreateRoom">
                    <motion.button
                        className="bg-transparent h-14 w-full 
            hover:bg-blue-500 
            text-blue-700 font-thin 
            hover:text-white py-2 px-4 border border-blue-500 
            hover:border-transparent rounded text-base"
                        whileTap={{ transform: 'translateY(5px)' }}
                    >
                        Create Room
                    </motion.button>
                </Link>
            </Box>
        </div>
    );
}

export default HomepageLogging;
