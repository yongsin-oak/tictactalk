import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Collapse } from '@mui/material';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Edit } from '@mui/icons-material';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {

        if (socket) {
            return; // Avoid creating a new socket if one is already present
        }
        // const newSocket = io('https://tictactalk.as.r.appspot.com/', {
        //     transports: ['websocket'],
        //     autoConnect: true,
        //     cors: {
        //         origin: '*',
        //     },
        // });
        const newSocket = io('http://localhost:8080', {
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

    }, [user.displayName, user.photoURL]);

    useEffect(() => {
        if (!socket) return;
    }, [socket]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.displayName.trim()) {
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

    async function generateRoomCode() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let roomCode = "";

        for (let i = 0; i < 5; i++) {
            roomCode += letters[Math.floor(Math.random() * letters.length)];
        }
        const roomsCollectionRef = collection(db, 'rooms');
        const roomCodeQuery = query(roomsCollectionRef, where("roomCode", "==", roomCode));

        try {
            const querySnapshot = await getDocs(roomCodeQuery);
            if (querySnapshot.size === 0) {
                // No document with the generated roomCode exists, return it
                return roomCode;
            } else {
                // A document with the generated roomCode exists, regenerate a new one
                return generateRoomCode(); // Recursively call the function to generate a new roomCode
            }
        } catch (error) {
            console.error("Error checking roomCode existence:", error);
            return null;
        }
    }
    const handleCreateRoom = async() => {
        const newRoomCode = await generateRoomCode();
        navigate(`/roomgame?&roomCode=${encodeURIComponent(newRoomCode)}`);
    };
    const handleJoinRoom = () => {
        navigate(`/roomgame?&roomCode=${encodeURIComponent(roomCode)}`);
    };
    const handleRoomCodeChange = (event) => {
        setRoomCode(event.target.value);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setImageUrl(URL.createObjectURL(file));
    };
    const setImg = () => {
        updateProfile(auth.currentUser, {
            photoURL: imageUrl,
        });
        setIsModalOpen(false);
    }
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="text-center">
            <h1 className="text-7xl font-thin">Tic Tac Talk</h1>
            {/* {user.photoURL && (
                <img src={user.photoURL} alt="" className='w-10 h-10 rounded-full mx-auto my-5' />
            )}
            {!user.photoURL && (
                <AccountCircleIcon sx={{ fontSize: 40 }} className='mx-auto my-5'></AccountCircleIcon>

            )} */}
            <div onClick={openModal} style={{ cursor: 'pointer' }}>
                {user.photoURL ? (
                    <img src={user.photoURL} alt="" className='w-10 h-10 rounded-full mx-auto my-5' />
                ) : (
                    <AccountCircleIcon sx={{ fontSize: 40 }} className='mx-auto my-5'></AccountCircleIcon>
                )}
            </div>
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-3" />
                        <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Close</button>
                        {imageUrl && (
                            <>
                                <img src={imageUrl} alt="" className='w-40 h-40 rounded-full mx-auto my-5' />
                                <button className='bg-green-600 text-white px-4 py-2 rounded' onClick={setImg}>Choose this!</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div>
                {error && <Collapse in={open}>
                    <Alert onClose={() => { setOpen(false); }} severity={iserror ? "error" : "success"} variant="filled" className='my-3'>{error}</Alert>
                </Collapse>}
                <form onSubmit={handleSubmit}>
                    <div className='flex w-full justify-center items-center'>
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
                <Box mt={2} className="gap-2 grid w-6/12 m-auto">
                    <motion.button className="h-14 w-full bg-green-500 hover:bg-green-400 
                text-white font-thin py-2 px-4 border-b-4 
                border-green-700 hover:border-green-500 rounded
                 text-2xl" whileTap={{ transform: "translateY(5px)" }}
                        onClick={handleCreateRoom}>
                        Create Room
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
