import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LiaPaperPlane } from "react-icons/lia";

const Chat = ({ socket, roomCode, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [anotherPlayer, setAnotherPlayer] = useState('');
    const chatContainerRef = useRef(null);


    useEffect(() => {
        socket.on('chatMessage', (message) => {
            console.log(message);
            setMessages(message);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            socket.emit('sendMessage', { message: newMessage, roomCode: roomCode, displayName: user.displayName, email: user.email });
            setNewMessage('');
            socket.emit('typing', { roomCode, displayName: user.displayName, isTyping: false });
        }
    };
    const handleChange = (e) => {
        setNewMessage(e.target.value);
        socket.emit('typing', { roomCode, displayName: user.displayName, isTyping: true });
        if (e.target.value === '') {
            socket.emit('typing', { roomCode, displayName: user.displayName, isTyping: false });
        }

        setTimeout(() => {
            socket.emit('typing', { roomCode, displayName: user.displayName, isTyping: false });
        }, 7000);
    }

    socket.on('typing', ({ roomCode: receivedRoomCode, isTyping, displayName }) => {
        if (receivedRoomCode === roomCode) {
            setAnotherPlayer(displayName);
            setIsTyping(isTyping);
        }
    });
    return (
        <motion.div className='text-start w-5/6 relative p-5 h-2/3 bg-white rounded-lg m-auto'
            initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <div ref={chatContainerRef} className='relative top-0 overflow-y-scroll max-h-96 overflow-x-hidden
                border border-gray-400 p-2 rounded-md flex flex-col'>
                {messages.map((message, index) => (
                    <motion.div key={index} className={` mb-3 p-2 rounded-xl w-1/2 relative
                    ${message.email === user.email ? 'left-1/2 bg-green-200' : 'left-0 bg-red-200'}`}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ wordWrap: 'break-word' }}>
                        <p className={`font-extrabold ${message.email === user.email ? 'text-end' : 'text-start'}`}>
                            {message.sender}
                        </p>
                        <p className={`${message.email === user.email ? 'text-end' : 'text-start'}`}>
                            {message.message}
                        </p>
                    </motion.div>

                ))}
            </div>
            {isTyping && <p>{anotherPlayer} is typing...</p>}
            <form className='relative bottom-0 flex mt-5'>
                <div className='w-full border-2 rounded-full px-2 border-green-500 relative'>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleChange}
                        className='bg-transparent focus:outline-none w-4/5 h-10'
                        maxLength={30}
                    />
                    <button onClick={sendMessage} type='submit' className='mx-2 absolute right-0 top-0 bottom-0 my-auto'><LiaPaperPlane /></button>
                </div>
            </form>
        </motion.div>
    );
};

export default Chat;
