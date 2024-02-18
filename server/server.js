const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const app = express();

const whitelist = ["http://127.0.0.1:3000", "http://localhost:3000", "https://tictactalk.web.app/"];

const admin = require('firebase-admin');

const serviceAccount = require('./tictactalk-firebase-adminsdk-tlb1y-ca38f272aa.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions));
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "https://tictactalk.web.app/", 
        methods: ["GET", "POST"],
        credentials: true
    }
});
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const rooms = {};
const roomsCollection = firestore.collection('rooms');
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('authenticate', ({ token }) => {
        console.log(`token: ${token}`)
    })

    socket.on('joinRoom', async ({ roomCode, user }) => {
        socket.join(roomCode);
        try {
            const roomDoc = await roomsCollection.doc(roomCode).get();

            if (!roomDoc.exists) {
                const roles = "xo";
                let role = "";
                for (let i = 0; i < 1; i++) {
                    role += roles[Math.floor(Math.random() * 2)];
                }
                rooms[roomCode] = {
                    players: [{ name: user.displayName, id: socket.id }],
                };
                // Room doesn't exist, create a new one
                await roomsCollection.doc(roomCode).set({
                    players: [{ name: user.displayName, id: user.uid, role: role }],
                    turns: role === 'x' ? 0 : 1,
                    squares: Array(9).fill(""),
                    pieceSizes: Array(9).fill(-1),
                    gameStarted: false,
                    winner: null,
                    xAvailableSizes: [3, 3, 3],
                    oAvailableSizes: [3, 3, 3],
                    message: []
                });
            } else {
                const players = roomDoc.data().players;
                const currentRoomData = (await roomsCollection.doc(roomCode).get()).data();
                if (currentRoomData.players.length === 1 && players[0].id === user.uid) {
                    return;
                }
                if (currentRoomData.players.length === 2) {
                    if (players[0].id === user.uid || players[1].id === user.uid) {
                        const currentPlayer = currentRoomData.players[currentRoomData.turns];
                        const anotherPlayer = currentRoomData.players[currentRoomData.turns === 0 ? 1 : 0];
                        // io.to(roomCode).emit('gameStart', currentPlayer, anotherPlayer);
                        io.to(roomCode).emit('gameStart', {
                            currentPlayer: currentPlayer, anotherPlayer: anotherPlayer,
                        });
                        io.to(roomCode).emit('updateBoard', {
                            squares: currentRoomData.squares, nextPlayer: currentRoomData.players[currentRoomData.turns].name,
                            pieceSizes: currentRoomData.pieceSizes, playerTurn: currentRoomData.players[currentRoomData.turns].role,
                            xAvailableSizes: currentRoomData.xAvailableSizes, oAvailableSizes: currentRoomData.oAvailableSizes,
                        });
                        const updatedRoomDoc = (await roomsCollection.doc(roomCode).get()).data().message;
                        io.to(roomCode).emit('chatMessage', updatedRoomDoc);
                    }
                    return;
                }
                rooms[roomCode].players.push({ name: user.displayName, id: socket.id });

                players.push({ name: user.displayName, id: user.uid, role: players[0].role === "x" ? "o" : "x" });

                await roomsCollection.doc(roomCode).update({ players: players });

            }

            const currentRoomData = (await roomsCollection.doc(roomCode).get()).data();

            if (currentRoomData.players.length === 2) {
                const currentPlayer = currentRoomData.players[currentRoomData.turns];
                const anotherPlayer = currentRoomData.players[currentRoomData.turns === 0 ? 1 : 0];
                roomsCollection.doc(roomCode).update({ gameStarted: true });
                // io.to(roomCode).emit('gameStart', currentPlayer, anotherPlayer);
                io.to(roomCode).emit('gameStart', {
                    currentPlayer: currentPlayer, anotherPlayer: anotherPlayer,
                });
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });

    socket.on('sendMessage', async (message) => {
        const currentRoomDataMessage = (await roomsCollection.doc(message.roomCode).get()).data().message;
        // currentRoomDataMessage.push(message);
        const storeMessage = { message: message.message, sender: message.displayName };

        await currentRoomDataMessage.push(storeMessage);

        await roomsCollection.doc(message.roomCode).update({ message: currentRoomDataMessage });

        const updatedRoomDoc = (await roomsCollection.doc(message.roomCode).get()).data().message;
        io.to(message.roomCode).emit('chatMessage', updatedRoomDoc);
    });

    socket.on('typing', ({ roomCode, displayName, isTyping }) => {
        // socket.broadcast.emit('typing', { isTyping });
        socket.to(roomCode).emit('typing', { roomCode, isTyping, displayName });
    });

    socket.on('playerMove', async ({ roomCode, newBoard, pieceSizes, winner, xAvailableSizes, oAvailableSizes }) => {
        const roomDoc = (await roomsCollection.doc(roomCode).get()).data();
        if (roomDoc.exists) return;
        await roomsCollection.doc(roomCode).update({ squares: newBoard })
        await roomsCollection.doc(roomCode).update({ turns: roomDoc.turns === 0 ? 1 : 0 });
        await roomsCollection.doc(roomCode).update({ pieceSizes: pieceSizes });
        await roomsCollection.doc(roomCode).update({ winner: winner });
        await roomsCollection.doc(roomCode).update({ xAvailableSizes: xAvailableSizes });
        await roomsCollection.doc(roomCode).update({ oAvailableSizes: oAvailableSizes });
        const updatedRoomDoc = (await roomsCollection.doc(roomCode).get()).data();

        io.to(roomCode).emit('updateBoard', {
            squares: updatedRoomDoc.squares, nextPlayer: updatedRoomDoc.players[updatedRoomDoc.turns].name,
            pieceSizes: updatedRoomDoc.pieceSizes, playerTurn: updatedRoomDoc.players[updatedRoomDoc.turns].role,
            winner: updatedRoomDoc.winner, xAvailableSizes: updatedRoomDoc.xAvailableSizes,
            oAvailableSizes: updatedRoomDoc.oAvailableSizes,
        });
    });

    socket.on('disconnect', async () => {
        console.log(`Socket disconnected: ${socket.id}`);
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter((player) => player.id !== socket.id);

            if (rooms[roomCode].players.length === 0) {
                await roomsCollection.doc(roomCode).delete();
                delete rooms[roomCode];
            }
        }
    });
});


