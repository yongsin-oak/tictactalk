import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Collapse } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Edit } from '@mui/icons-material';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

function HomepageLogging() {
    const [roomCode, setRoomCode] = useState('');
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();
    const [iserror, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(true);
    const [socket, setSocket] = useState(null);
    const [username, setUserName] = useState({
        displayName: user.displayName,
    });

    useEffect(() => {
        if (socket) {
            return; // Avoid creating a new socket if one is already present
        }
        const newSocket = io('http://127.0.0.1:3001', {
            transports: ['websocket'],
            autoConnect: true,
            cors: {
                origin: '*',
            },
        });
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.close();
            }
        };
    }, []);
    useEffect(() => {
        setUserName({
            displayName: user.displayName,
        });
    }, [user]);

    useEffect(() => {
        if (!socket) return;
    }, [socket]);

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
    // const handleFindMatch = () => {
    //     socket.emit('findMatch', { userId: user.uid });
    // };

    function generateRoomCode() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let roomCode = "";

        for (let i = 0; i < 5; i++) {
            roomCode += letters[Math.floor(Math.random() * letters.length)];
        }

        return roomCode;
    }
    const handleCreateRoom = () => {
        const newRoomCode = generateRoomCode();
        navigate(`/roomgame?&roomCode=${encodeURIComponent(newRoomCode)}`);
    };
    const handleJoinRoom = () => {
        // if (roomCode.length === 0) {
        //     setErrorMessage('RoomCode?');
        //     setShowAlert(true);
        //     return;
        // }

        /* The above code is using JavaScript to navigate to a specific URL. It is using template literals
        to construct the URL with the values of the `name` and `roomCode` variables. The
        `encodeURIComponent` function is used to encode the values in case they contain special
        characters that could break the URL. */
        navigate(`/roomgame?&roomCode=${encodeURIComponent(roomCode)}`);
    };
    const handleRoomCodeChange = (event) => {
        setRoomCode(event.target.value);
    };
    return (
        <div className="text-center">
            <h1 className="text-7xl font-thin mb-6">Tic Tac Talk</h1>
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
                <Box mt={2} className="gap-2 grid w-4/12 m-auto">
                    <motion.button className="h-14 w-full bg-green-500 hover:bg-green-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-green-700 hover:border-green-500 rounded
                 text-2xl" whileTap={{ transform: "translateY(5px)" }}
                        onClick={handleCreateRoom}>
                        Play!
                    </motion.button>
                    <div className='mb-2'>
                        <label className='font-bold text-gray-700 block' htmlFor="roomCode">RoomCode?</label>
                        <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' id='roomCode' type="text" value={roomCode} onChange={handleRoomCodeChange} placeholder="AZSQCT" />
                    </div>
                    <motion.button className="h-14 w-full bg-green-500 hover:bg-green-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-green-700 hover:border-green-500 rounded
                 text-2xl" whileTap={{ transform: "translateY(5px)" }}
                        onClick={handleJoinRoom}>
                        Join
                    </motion.button>
                    <button
                        className="bg-transparent h-14 w-full 
                hover:bg-red-500 
                text-red-700 font-thin 
                hover:text-white py-2 px-4 border border-red-500 
                hover:border-transparent rounded
                text-2xl" onClick={handleLogout}>
                        Log out
                    </button>
                </Box>
            </div>
        </div>

    );
}

export default HomepageLogging;
