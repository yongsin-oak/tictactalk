import React, { useState, useEffect } from 'react';

const Chat = ({ socket, roomCode, displayName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Listen for incoming messages from the server
        socket.on('chatMessage', (message) => {
            console.log(message);
            setMessages(message);
            // setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up socket listener when component unmounts
        return () => {
            socket.off('chatMessage');
        };
    }, [socket]);

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            // Emit a new message to the server
            socket.emit('sendMessage', { message: newMessage, roomCode: roomCode, displayName: displayName });

            // Clear the input field
            setNewMessage('');
        }
    };

    return (
        <div className='text-start'>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message.sender} : {message.message}</p>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
