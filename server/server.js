const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const waitingPlayers = [];

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle player looking for a match
    socket.on("findMatch", () => {
        if (waitingPlayers.length > 0) {
            const opponentSocket = waitingPlayers.pop();
            startGame(socket, opponentSocket);
        } else {
            waitingPlayers.push(socket);
        }
    });

    // Handle player disconnect
    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
        const index = waitingPlayers.indexOf(socket);
        if (index !== -1) {
            waitingPlayers.splice(index, 1);
        }
    });
});

function startGame(player1, player2) {
    // Set up a unique room for the game
    const roomName = `game_${player1.id}_${player2.id}`;

    // Join players to the game room
    player1.join(roomName);
    player2.join(roomName);

    // Notify players that the game has started
    io.to(roomName).emit("gameStart", { roomName });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
