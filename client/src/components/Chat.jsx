import React, { useState, useEffect } from 'react';

const Chat = ({ socket, roomCode, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [anotherPlayer, setAnotherPlayer] = useState('');

    useEffect(() => {
        // Listen for incoming messages from the server
        socket.on('chatMessage', (message) => {
            setMessages(message);
            // setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up socket listener when component unmounts
        return () => {
            socket.off('chatMessage');
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            socket.emit('sendMessage', { message: newMessage, roomCode: roomCode, displayName: user.displayName });
            setNewMessage('');
            socket.emit('typing', {roomCode, displayName: user.displayName, isTyping: false });
        }
    };
    const handleChange = (e) => {
        setNewMessage(e.target.value);
        socket.emit('typing', {roomCode, displayName: user.displayName, isTyping: true });
        if (e.target.value === ''){
            socket.emit('typing', {roomCode, displayName: user.displayName, isTyping: false });
        }
        
        setTimeout(() => {
            socket.emit('typing', {roomCode, displayName: user.displayName, isTyping: false });
        }, 7000);
    }

    socket.on('typing', ({ roomCode: receivedRoomCode, isTyping, displayName }) => {
        if (receivedRoomCode === roomCode) {
            setAnotherPlayer(displayName);
            setIsTyping(isTyping);
        }
    });
    return (
        <div className='text-start'>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message.sender} : {message.message}</p>
                ))}
            </div>
            {isTyping && <p>{anotherPlayer} is typing...</p>}
            <form>
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleChange}
                    className=' px-1'
                />
                <button onClick={sendMessage} type='submit' className='mx-2'>Send</button>
            </form>
        </div>
    );
};

export default Chat;
