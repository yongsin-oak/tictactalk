import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "./Button";
import './tictactoe.css';
import ChooseO from "./ChooseO";
import ChooseX from "./ChooseX";
import DrawXO from "./DrawXO";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Spinner from "./Spinner";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../firebase";
import Chat from "./Chat";

function Tictactoe() {
    const [squares, setSquares] = useState(Array(9).fill(""));
    const [sizeSquares, setSizeSquares] = useState(Array(9).fill(-1));
    const [turn, setTurn] = useState("x");
    const [winner, setWinner] = useState(null);
    const [role, setRole] = useState("x");

    const [xAvailableSizes, setXAvailableSize] = useState([3, 3, 3]);
    const [oAvailableSizes, setOAvailableSize] = useState([3, 3, 3]);

    const [xSize, setXSize] = useState(1);
    const [oSize, setOSize] = useState(1);

    const [socket, setSocket] = useState(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [player2Name, setPlayer2Name] = useState("");
    const location = useLocation();
    const { roomCode } = queryString.parse(location.search);
    const { user } = useUserAuth();
    const uid = auth.currentUser?.uid;

    useEffect(() => {
        if (socket) {
            return;
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
            if (socket) {
                socket.close();
            }
        };
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.emit('authenticate', ({ token: uid }))
        socket.emit('joinRoom', { roomCode, user });
        socket.on('gameStart', ({ currentPlayer, anotherPlayer }) => {
            setRole(currentPlayer.name === user.displayName ? currentPlayer.role : anotherPlayer.role);
            setIsMyTurn(currentPlayer.name === user.displayName);
            setPlayer2Name(currentPlayer.name === user.displayName ? anotherPlayer.name : currentPlayer.name);
            setIsGameStarted(true);
        });

        socket.on('updateBoard', ({ squares, nextPlayer, pieceSizes, playerTurn, winner, xAvailableSizes, oAvailableSizes }) => {
            setTurn(playerTurn);
            setSizeSquares(pieceSizes);
            setSquares(squares);
            setWinner(winner);
            setIsMyTurn(nextPlayer === user.displayName ? true : false);
            setXAvailableSize(xAvailableSizes);
            setOAvailableSize(oAvailableSizes);
        });

    }, [socket, roomCode, user]);


    const checkEndTheGame = () => {
        for (let square of squares) {
            if (!square) return false;
        }
        return true;
    };

    const checkWinner = () => {
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

        for (let combo of combos) {
            const [a, b, c] = combo;
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    };
    const canReplace = (ind) => {
        const currentSize = turn === "x" ? xSize : oSize;
        const availableSize = turn === "x" ? xAvailableSizes : oAvailableSizes;

        if (availableSize[currentSize] < 1) return false;
        if (squares[ind] && sizeSquares[ind] < currentSize) return true;
        if (!squares[ind]) return true;
        return false;
    };

    const updateSquares = (ind) => {
        if (!canReplace(ind) || winner) return;
        if (isGameStarted && !isMyTurn) return;
        const s = squares;
        let sizeAvailables = turn === "x" ? xAvailableSizes : oAvailableSizes
        let setSizeAvailables = turn === "x" ? setXAvailableSize : setOAvailableSize
        let setSize = turn === "x" ? setXSize : setOSize;
        let size = turn === "x" ? xSize : oSize

        s[ind] = turn;
        sizeSquares[ind] = size;
        sizeAvailables[size] = sizeAvailables[size] - 1;

        setSquares(s);
        setSizeSquares(sizeSquares);
        setSizeAvailables(sizeAvailables)
        const newBoard = squares;
        const pieceSizes = sizeSquares;
        newBoard[ind] = turn;
        setIsMyTurn(false);

        const W = checkEndTheGame() ? "x | o" : checkWinner();

        setTurn(turn === "x" ? "o" : "x");

        if (sizeAvailables[size] < 1)
            setSize(getMaxSelectableSize(turn === "x" ? xAvailableSizes : oAvailableSizes))

        socket.emit('playerMove', {
            roomCode: roomCode, newBoard: newBoard, pieceSizes: pieceSizes, winner: W,
            xAvailableSizes: xAvailableSizes, oAvailableSizes: oAvailableSizes
        });
    };

    const getMaxSelectableSize = (availableSize) => {
        for (let index = availableSize.length - 1; index > -1; index--) {
            const size = availableSize[index];
            if (size > 0) return index;
        }

        return -1;
    }

    const resetGame = () => {
        setSquares(Array(9).fill(""));
        setSizeSquares(Array(9).fill(-1));
        setXAvailableSize([3, 3, 3]);
        setOAvailableSize([3, 3, 3]);
        setWinner(null);
        const newBoard = Array(9).fill("");
        const pieceSizes = Array(9).fill(-1);
        socket.emit('playerMove', {
            roomCode: roomCode, newBoard: newBoard, pieceSizes: pieceSizes,
            winner: null, xAvailableSizes: [3, 3, 3], oAvailableSizes: [3, 3, 3]
        });
    };


    const getCurrentAvailableSize = () => {
        return oAvailableSizes;
    }
    const getCurrentAvailableSizeX = () => {
        return xAvailableSizes;
    }


    const renderGameContent = () => {
        if (!isGameStarted && winner === null) {
            return (
                <div className='flex flex-col justify-center items-center gap-6'>
                    <h1 className='text-4xl font-bold text-white text-center'>TicTacTalk</h1>

                    <div className='flex flex-col justify-center items-center gap-4 mb-4'>
                        <span title='Código de sala' className='text-xl font-semibold text-gray-400'>Room Code : {roomCode}</span>
                    </div>

                    <Spinner text='Waiting Player...' />
                </div>
            );
        }

        if (isGameStarted) {
            return (
                <div className='grid grid-cols-2 justify-center items-center gap-6'>
                    <div className='flex flex-col justify-center items-center gap-6'>
                        <div className='flex flex-col justify-center items-center gap-4 mb-4'>
                            <h3 className='text-2xl font-bold text-gray-300'>You are {role}</h3>
                            <h3 className='text-2xl font-bold text-gray-300'>{user.displayName} vs {player2Name}</h3>
                        </div>
                        <div className="tictactoe">
                            <Button resetGame={resetGame} />
                            <div className="game">
                                {squares.map((_, ind) => (
                                    <DrawXO
                                        key={ind}
                                        ind={ind}
                                        updateSquares={updateSquares}
                                        clsName={squares[ind]}
                                        turn={turn}
                                        size={sizeSquares[ind]}
                                    />
                                ))}
                            </div>
                            <div className={`turn ${turn === "x" ? "left" : "right"}`}>
                                <motion.svg
                                    width="100"
                                    height="100"
                                    viewBox="-25 0 200 200"
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.line
                                        x1="5"
                                        y1="30"
                                        x2="145"
                                        y2="170"
                                        stroke="#ffff"
                                        className="draw"
                                    />
                                    <motion.line
                                        x1="5"
                                        y1="170"
                                        x2="145"
                                        y2="30"
                                        stroke="#ffff"
                                        className="draw"
                                    />
                                </motion.svg>
                                <motion.svg
                                    width="100"
                                    height="100"
                                    viewBox="-25 0 200 200"
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.circle
                                        cx="75"
                                        cy="95"
                                        r="70"
                                        stroke="black"
                                        className="draw"
                                    />
                                </motion.svg>
                            </div>
                            <div className='grid grid-cols-3 gap-1 my-2'>
                                {
                                    [
                                        [0, 1, 2].map((valueSize, ind) => {
                                            if (xAvailableSizes[valueSize] < 1) return undefined;
                                            if (role === 'x') {
                                                return <div key={ind} className={"sizeBtn square " + (xSize === valueSize ? "enableSizeBtn" : "")}>
                                                    <ChooseX
                                                        clsName={turn}
                                                        ind={ind}
                                                        updateSquares={(idx) => {
                                                            let setSizeAvailables = setXSize;
                                                            setSizeAvailables(valueSize);
                                                        }}
                                                        size={valueSize}
                                                        customText={getCurrentAvailableSizeX()[valueSize]}
                                                    />
                                                </div>
                                            } else {
                                                return <div key={ind} className={"sizeBtn square " + (oSize === valueSize ? "enableSizeBtn" : "")}>
                                                    <ChooseO
                                                        clsName={turn}
                                                        updateSquares={(idx) => {
                                                            let setSizeAvailables = setOSize;
                                                            setSizeAvailables(valueSize)
                                                        }}
                                                        size={valueSize}
                                                        customText={getCurrentAvailableSize()[valueSize]}
                                                    />
                                                </div>
                                            }
                                        })
                                    ]
                                }
                            </div>
                            <AnimatePresence>
                                {winner && (
                                    <motion.div
                                        key={"parent-box"}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="winner"
                                    >
                                        <motion.div
                                            key={"child-box"}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="text"
                                        >
                                            <motion.h2
                                                initial={{ scale: 0, y: 100 }}
                                                animate={{
                                                    scale: 1,
                                                    y: 0,
                                                    transition: {
                                                        y: { delay: 0.7 },
                                                        duration: 0.7,
                                                    },
                                                }}
                                            >
                                                {winner === "x | o"
                                                    ? "No Winner :/"
                                                    : "Win !! :)"}
                                            </motion.h2>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{
                                                    scale: 1,
                                                    transition: {
                                                        delay: 1.3,
                                                        duration: 0.2,
                                                    },
                                                }}
                                                className="win w-fit h-fit"
                                            >
                                                {winner === "x | o" ? (
                                                    <>
                                                        <ChooseX
                                                            clsName={turn}
                                                            size={2}
                                                        />
                                                        <ChooseO
                                                            clsName={turn}
                                                            size={2}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <DrawXO
                                                            updateSquares={updateSquares}
                                                            clsName={winner}
                                                            size={1}
                                                        />
                                                    </>
                                                )}
                                            </motion.div>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{
                                                    scale: 1,
                                                    transition: { delay: 1.5, duration: 0.3 },
                                                }}
                                            >
                                                <Button resetGame={resetGame} />
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <Chat socket={socket} roomCode={roomCode} user={user}></Chat>
                </div>

            );
        }
    };
    return (
        <div className="text-center ">
            <h1 className=" text-white text-7xl"> Tic Tac Talk </h1>
            <div className='container flex justify-center items-center text-center w-full mx-auto'>
                {renderGameContent()}
            </div>
        </div>
    );
}

export default Tictactoe;
