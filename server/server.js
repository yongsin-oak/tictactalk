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

const waitingUsers = [];

io.on("connection", (socket) => {
    console.log("connected: " + socket.id);

    socket.on("findMatch", () => {
        console.log("User wants to find a match:", socket.id);

        // Check if the user is already waiting
        if (!waitingUsers.includes(socket.id)) {
            // Add the user to the list of waiting users
            waitingUsers.push(socket.id);

            // Check if there is another user looking for a match
            if (waitingUsers.length >= 2) {
                // Pair the first two users found
                const user1 = waitingUsers.shift();
                const user2 = waitingUsers.shift();

                // Emit an event to both users to indicate a match has been found
                io.to(user1).emit("matchFound", { opponent: user2 });
                io.to(user2).emit("matchFound", { opponent: user1 });

                console.log("Match found between", user1, "and", user2);
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
