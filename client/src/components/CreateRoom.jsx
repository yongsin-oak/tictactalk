// CreateRoom.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function CreateRoom() {
    const [roomCode, setRoomCode] = useState('');

    const generateRoomCode = () => {
        // Generate a random room code (you can customize this logic)
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(newCode);
    };

    return (
        <div className='w-full justify-center items-center m-auto flex'>
            <motion.div className='w-2/4 flex-row justify-center'>
                <h2>Create a Room</h2>
                <p>Room Code: {roomCode}</p>
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={generateRoomCode}
                >
                    Generate Room Code
                </motion.button>

                <Link to={`/room/${roomCode}`}>
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Go to Room
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}

export default CreateRoom;
