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
const forceSecure = (req, res, next) => {
    if (req.secure)
        return next(); // https -- Continue

    res.redirect('https://' + req.hostname + req.url)
}
app.all('*', forceSecure);

app.use(cors(corsOptions));
const server = http.createServer(app);
// const io = socketio(server, {
//     cors: {
//         origin: "https://tictactalk.web.app/",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });
const io = socketio(server);
const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.write(`<h1>Socket Start Port : ${PORT}</h1>`);
    res.end();
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const rooms = {};
let waitingRoom = []
const roomsCollection = firestore.collection('rooms');
// const waitingRoom = []
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('waitingPlayer', ({ user }) => {
        console.log(`Socket : ${socket.id} is Waiting Player`);
        waitingRoom.push({ name: user.displayName, id: socket.id });
        console.log(waitingRoom)
        setInterval(findMatch, 1000);
    })
    socket.on('cancelWaiting', () => {
        console.log(`Socket : ${socket.id} is Cancel Waiting`);
        const index = waitingRoom.findIndex(player => player.id === socket.id);
        if (index !== -1) {
            waitingRoom.splice(index, 1);
        }
        console.log(waitingRoom)
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
                    players: [{ email: user.email, id: socket.id }],
                };
                // console.log(rooms[roomCode]);
                await roomsCollection.doc(roomCode).set({
                    players: [{ name: user.displayName, email: user.email, role: role }],
                    turns: role === 'x' ? 0 : 1,
                    squares: Array(9).fill(""),
                    pieceSizes: Array(9).fill(-1),
                    gameStarted: false,
                    winner: null,
                    xAvailableSizes: [3, 3, 3],
                    oAvailableSizes: [3, 3, 3],
                    message: [],
                });
            } else {
                const players = roomDoc.data().players;
                const currentRoomData = (await roomsCollection.doc(roomCode).get()).data();
                if (currentRoomData.players.length === 1 && players[0].email === user.email) {
                    return;
                }
                if (currentRoomData.gameStarted) {
                    const currentPlayer = currentRoomData.players[currentRoomData.turns];
                    const anotherPlayer = currentRoomData.players[currentRoomData.turns === 0 ? 1 : 0];

                    if (currentRoomData.players[0].email === user.email || currentRoomData.players[1].email === user.email) {
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

                        rooms[roomCode].players.push({ email: user.email, id: socket.id });
                    }
                    return;
                }

                rooms[roomCode].players.push({ email: user.email, id: socket.id });

                players.push({ name: user.displayName, email: user.email, role: players[0].role === "x" ? "o" : "x" });

                await roomsCollection.doc(roomCode).update({ players: players });

            }

            const currentRoomData = (await roomsCollection.doc(roomCode).get()).data();

            if (currentRoomData.players.length === 2) {
                const currentPlayer = currentRoomData.players[currentRoomData.turns];
                const anotherPlayer = currentRoomData.players[currentRoomData.turns === 0 ? 1 : 0];
                roomsCollection.doc(roomCode).update({ gameStarted: true });
                io.to(roomCode).emit('gameStart', {
                    currentPlayer: currentPlayer, anotherPlayer: anotherPlayer
                });
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });

    socket.on('joinRoomTeam', async ({ roomCode, user }) => {
        socket.join(roomCode);
        try {
            const roomDoc = await roomsCollection.doc(roomCode).get();

            if (!roomDoc.exists) {
                const teamRoles = ["navigator", "driver"];
                let teamRole = "";
                for (let i = 0; i < 1; i++) {
                    teamRole += teamRoles[Math.floor(Math.random() * 2)];
                }
                rooms[roomCode] = {
                    players: [{ email: user.email, id: socket.id }],
                };
                await roomsCollection.doc(roomCode).set({
                    players: [{ name: user.displayName, email: user.email, role: 'x' }],
                    teamX: [{ name: user.displayName, email: user.email, teamRole: teamRole }],
                    turns: 'x',
                    squares: Array(9).fill(""),
                    pieceSizes: Array(9).fill(-1),
                    gameStarted: false,
                    winner: null,
                    xAvailableSizes: [3, 3, 3],
                    oAvailableSizes: [3, 3, 3],
                    message: [],
                    messageX: [],
                    messageO: [],
                });
            } else {
                const players = roomDoc.data().players;
                const playersO = roomDoc.data().teamO;
                const playersX = roomDoc.data().teamX;
                const currentRoomData = (await roomsCollection.doc(roomCode).get()).data();
                for (let index = 0; index < players.length; index++) {
                    if (currentRoomData.players.length < 4 && players[index].email === user.email) {
                        return;
                    }
                }
                if (currentRoomData.gameStarted) {
                    for (let index = 0; index < players.length; index++) {
                        if (currentRoomData.players[index].email === user.email) {
                            const driverX = currentRoomData.teamX[0].teamRole === 'driver' ? currentRoomData.teamX[0] : currentRoomData.teamX[1];
                            const driverO = currentRoomData.teamO[0].teamRole === 'driver' ? currentRoomData.teamO[0] : currentRoomData.teamO[1];
                            const naviX = currentRoomData.teamX[0].teamRole === 'navigator' ? currentRoomData.teamX[0] : currentRoomData.teamX[1];
                            const naviO = currentRoomData.teamO[0].teamRole === 'navigator' ? currentRoomData.teamO[0] : currentRoomData.teamO[1];
                            io.to(roomCode).emit('gameStartTeam', {
                                driverX: driverX, driverO: driverO, naviX: naviX, naviO: naviO,
                            });
                            const driverXSee = [...currentRoomData.squares];
                            const naviXSee = [...currentRoomData.squares];
                            const driverOSee = [...currentRoomData.squares];
                            const naviOSee = [...currentRoomData.squares];
                            for (let index = 0; index < currentRoomData.squares.length; index++) {
                                if (naviXSee[index] === 'x') {
                                    naviXSee[index] = '';
                                }
                                if (driverXSee[index] === 'o') {
                                    driverXSee[index] = '';
                                }
                                if (naviOSee[index] === 'o') {
                                    naviOSee[index] = '';
                                }
                                if (driverOSee[index] === 'x') {
                                    driverOSee[index] = '';
                                }
                            }
                            io.to(socket.id).emit('updateBoardTeam', {
                                squares: currentRoomData.squares, pieceSizes: currentRoomData.pieceSizes,
                                playerTurn: currentRoomData.turns, winner: currentRoomData.winner,
                                xAvailableSizes: currentRoomData.xAvailableSizes, oAvailableSizes: currentRoomData.oAvailableSizes,
                                driverXSee: driverXSee, naviXSee: naviXSee, driverOSee: driverOSee, naviOSee: naviOSee,
                            });

                            rooms[roomCode].players.push({ email: user.email, id: socket.id });
                            const updatedRoomDoc = (await roomsCollection.doc(roomCode).get()).data().message;
                            io.to(roomCode).emit('chatMessage', updatedRoomDoc);
                            const updatedTeamDoc = currentRoomData.players[index].role === 'x' ? (await roomsCollection.doc(roomCode).get()).data().messageX
                                : (await roomsCollection.doc(roomCode).get()).data().messageO;
                            io.to(roomCode).emit('chatTeamMessage', { updatedRoomDoc: updatedTeamDoc, role: currentRoomData.players[index].role });
                            return;
                        }
                    }
                    return;
                }

                rooms[roomCode].players.push({ email: user.email, id: socket.id });

                if (players.length === 1) {
                    const teamRoles = ["navigator", "driver"];
                    let teamRole = "";
                    for (let i = 0; i < 1; i++) {
                        teamRole += teamRoles[Math.floor(Math.random() * 2)];
                    }
                    await roomsCollection.doc(roomCode).update({
                        teamO: [{
                            name: user.displayName,
                            email: user.email, teamRole: teamRole
                        }]
                    });
                    players.push({ name: user.displayName, email: user.email, role: 'o' });
                    await roomsCollection.doc(roomCode).update({ players: players });

                } else if (players.length === 2) {
                    playersX.push({
                        name: user.displayName, email: user.email, teamRole: playersX[0].teamRole === "navigator" ?
                            "driver" : "navigator"
                    });
                    await roomsCollection.doc(roomCode).update({ teamX: playersX });
                    players.push({ name: user.displayName, email: user.email, role: 'x' });
                    await roomsCollection.doc(roomCode).update({ players: players });
                } else if (players.length === 3) {
                    playersO.push({
                        name: user.displayName, email: user.email, teamRole: playersO[0].teamRole === "navigator" ?
                            "driver" : "navigator"
                    });
                    await roomsCollection.doc(roomCode).update({ teamO: playersO });
                    players.push({ name: user.displayName, email: user.email, role: 'o' });
                    await roomsCollection.doc(roomCode).update({ players: players });
                }
            }

            const currentRoomData = (await roomsCollection.doc(roomCode).get()).data();

            if (currentRoomData.players.length === 4) {
                const driverX = currentRoomData.teamX[0].teamRole === 'driver' ? currentRoomData.teamX[0] : currentRoomData.teamX[1];
                const driverO = currentRoomData.teamO[0].teamRole === 'driver' ? currentRoomData.teamO[0] : currentRoomData.teamO[1];
                const naviX = currentRoomData.teamX[0].teamRole === 'navigator' ? currentRoomData.teamX[0] : currentRoomData.teamX[1];
                const naviO = currentRoomData.teamO[0].teamRole === 'navigator' ? currentRoomData.teamO[0] : currentRoomData.teamO[1];
                roomsCollection.doc(roomCode).update({ gameStarted: true });
                io.to(roomCode).emit('gameStartTeam', {
                    driverX: driverX, driverO: driverO, naviX: naviX, naviO: naviO,
                });
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });


    socket.on('sendMessage', async (message) => {
        const currentRoomDataMessage = (await roomsCollection.doc(message.roomCode).get()).data().message;
        // currentRoomDataMessage.push(message);
        const storeMessage = { message: message.message, sender: message.displayName, email: message.email };

        await currentRoomDataMessage.push(storeMessage);

        await roomsCollection.doc(message.roomCode).update({ message: currentRoomDataMessage });

        const updatedRoomDoc = (await roomsCollection.doc(message.roomCode).get()).data().message;
        io.to(message.roomCode).emit('chatMessage', updatedRoomDoc);
    });

    socket.on('typing', ({ roomCode, displayName, isTyping }) => {
        socket.to(roomCode).emit('typing', { roomCode, isTyping, displayName });
    });

    socket.on('sendTeamMessage', async (message) => {

        console.log(message)
        const currentRoomDataMessage = message.role === 'x' ? (await roomsCollection.doc(message.roomCode).get()).data().messageX
            : (await roomsCollection.doc(message.roomCode).get()).data().messageO;
        const storeMessage = { message: message.message, sender: message.displayName };
        await currentRoomDataMessage.push(storeMessage);
        console.log(currentRoomDataMessage);

        message.role === 'x' ? await roomsCollection.doc(message.roomCode).update({ messageX: currentRoomDataMessage }) :
            await roomsCollection.doc(message.roomCode).update({ messageO: currentRoomDataMessage });


        const updatedRoomDoc = message.role === 'x' ? (await roomsCollection.doc(message.roomCode).get()).data().messageX
            : (await roomsCollection.doc(message.roomCode).get()).data().messageO;

        io.to(message.roomCode).emit('chatTeamMessage', { updatedRoomDoc: updatedRoomDoc, role: message.role });
    });

    socket.on('loadChat', async (message) => {
        const updatedRoomDoc = (await roomsCollection.doc(message.roomCode).get()).data().message;
        io.to(message.roomCode).emit('chatMessage', updatedRoomDoc);
        const updatedTeamDoc = message.role === 'x' ? (await roomsCollection.doc(message.roomCode).get()).data().messageX
            : (await roomsCollection.doc(message.roomCode).get()).data().messageO;
        io.to(message.roomCode).emit('chatTeamMessage', { updatedRoomDoc: updatedTeamDoc, role: message.role });
    })
    // socket.on('typingTeam', ({ team, displayName, isTyping }) => {
    //     socket.to(team[0]).to(team[0]).emit('typingTeam', { team, isTyping, displayName });
    // });

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
            squares: updatedRoomDoc.squares, nextPlayer: updatedRoomDoc.players[updatedRoomDoc.turns].email,
            pieceSizes: updatedRoomDoc.pieceSizes, playerTurn: updatedRoomDoc.players[updatedRoomDoc.turns].role,
            winner: updatedRoomDoc.winner, xAvailableSizes: updatedRoomDoc.xAvailableSizes,
            oAvailableSizes: updatedRoomDoc.oAvailableSizes,
        });

    });

    socket.on('playerMoveTeam', async ({ roomCode, newBoard, pieceSizes, xAvailableSizes, oAvailableSizes, teamRole, role }) => {
        const roomDoc = (await roomsCollection.doc(roomCode).get()).data();
        const driverXSee = [...newBoard];
        const naviXSee = [...newBoard];
        const driverOSee = [...newBoard];
        const naviOSee = [...newBoard];
        for (let index = 0; index < newBoard.length; index++) {
            if (naviXSee[index] === 'x') {
                naviXSee[index] = '';
            }
            if (driverXSee[index] === 'o') {
                driverXSee[index] = '';
            }
            if (naviOSee[index] === 'o') {
                naviOSee[index] = '';
            }
            if (driverOSee[index] === 'x') {
                driverOSee[index] = '';
            }
        }
        if (roomDoc.exists) return;
        const checkEndTheGame = () => {
            for (let square of newBoard) {
                if (!square) return false;
            }
            return true;
        };
        const combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        const checkWinner = async () => {
            for (let combo of combos) {
                const [a, b, c] = combo;
                if (
                    newBoard[a] &&
                    newBoard[a] === newBoard[b] &&
                    newBoard[a] === newBoard[c]
                ) {
                    return newBoard[a];
                }
            }
            return null;
        }
        await roomsCollection.doc(roomCode).update({ winner: checkEndTheGame() ? "x | o" : await checkWinner() });
        await roomsCollection.doc(roomCode).update({ squares: newBoard })
        await roomsCollection.doc(roomCode).update({ turns: roomDoc.turns === "x" ? "o" : "x" });
        await roomsCollection.doc(roomCode).update({ pieceSizes: pieceSizes });
        await roomsCollection.doc(roomCode).update({ xAvailableSizes: xAvailableSizes });
        await roomsCollection.doc(roomCode).update({ oAvailableSizes: oAvailableSizes });
        const updatedRoomDoc = (await roomsCollection.doc(roomCode).get()).data();

        io.to(roomCode).emit('updateBoardTeam', {
            squares: updatedRoomDoc.squares, pieceSizes: updatedRoomDoc.pieceSizes,
            playerTurn: updatedRoomDoc.turns, winner: updatedRoomDoc.winner,
            xAvailableSizes: updatedRoomDoc.xAvailableSizes, oAvailableSizes: updatedRoomDoc.oAvailableSizes,
            driverXSee: driverXSee, naviXSee: naviXSee, driverOSee: driverOSee, naviOSee: naviOSee,
        });

    });

    const findMatch = async () => {
        // Check if there are at least two players in the waiting room
        if (waitingRoom.length >= 2) {
            // Get the first two players from the waiting room
            const player1 = waitingRoom.shift(); // Remove the first player from the waiting room
            const player2 = waitingRoom.shift(); // Remove the second player from the waiting room

            // Create a new room code (you may want to implement a function to generate unique room codes)
            const roomCode = await generateRoomCode();

            rooms[roomCode] = {
                players: [
                    { name: player1.name, id: player1.id },
                    { name: player2.name, id: player2.id }
                ]
            };
            await io.to(player1.id).emit('matchFound', { roomCode });
            setTimeout(() => {
                io.to(player2.id).emit('matchFound', { roomCode });
            }, 700)

            console.log(`Match found! Players: ${player1.name} and ${player2.name} in room ${roomCode}`);
        }
    };


    const generateRoomCode = async () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let roomCode = "";

        for (let i = 0; i < 5; i++) {
            roomCode += letters[Math.floor(Math.random() * letters.length)];
        }
        roomsCollection.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (roomCode === doc.id) {
                    console.log(doc.id);
                    roomCode = generateRoomCode();
                }
            })
        })

        return roomCode;
    }

    socket.on('disconnect', async () => {
        console.log(`Socket disconnected: ${socket.id}`);
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter((player) => player.id !== socket.id);

            if (rooms[roomCode].players.length === 0) {
                await roomsCollection.doc(roomCode).delete();
                delete rooms[roomCode];
            }
        }
        waitingRoom = waitingRoom.filter((player) => player.id !== socket.id);
        console.log(waitingRoom);
    });
});


