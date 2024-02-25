import React, { useState, useEffect } from 'react';

const ChatTeam = ({ socket, roomCode, user, role }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [anotherPlayer, setAnotherPlayer] = useState('');

    useEffect(() => {
        // Listen for incoming messages from the server

        socket.on('chatTeamMessage', (message) => {
            if(role === message.role) {
                setMessages(message.updatedRoomDoc);
            }
        });
        // return () => {
        //     socket.off('chatTeamMessage');
        // };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            socket.emit('sendTeamMessage', { message: newMessage, roomCode: roomCode, role: role, displayName: user.displayName });
            setNewMessage('');
            socket.emit('typingTeam', { displayName: user.displayName, isTyping: false });
        }
    };
    const handleChange = (e) => {
        setNewMessage(e.target.value);
        socket.emit('typingTeam', { displayName: user.displayName, isTyping: true });
        if (e.target.value === ''){
            socket.emit('typingTeam', { displayName: user.displayName, isTyping: false });
        }
        
        setTimeout(() => {
            socket.emit('typingTeam', { displayName: user.displayName, isTyping: false });
        }, 7000);
    }

    socket.on('typingTeam', ({ team, isTyping, displayName }) => {
        setAnotherPlayer(displayName);
        setIsTyping(isTyping);
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
                    className='p-1'
                />
                <button onClick={sendMessage} type='submit' className='mx-2'>Send</button>
            </form>
        </div>
    );
};

export default ChatTeam;
