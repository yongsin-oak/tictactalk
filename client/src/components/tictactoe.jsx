import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "./Button";
import './tictactoe.css';
import ChooseO from "./ChooseO";
import ChooseX from "./ChooseX";
import DrawXO from "./DrawXO";

function Tictactoe() {
    const [squares, setSquares] = useState(Array(9).fill(""));
    const [sizeSquares, setSizeSquares] = useState(Array(9).fill(-1));
    const [turn, setTurn] = useState("x");
    const [winner, setWinner] = useState(null);

    const [xAvailableSizes, setXAvailableSize] = useState([3, 3, 3]);
    const [oAvailableSizes, setOAvailableSize] = useState([3, 3, 3]);

    const [xSize, setXSize] = useState(1);
    const [oSize, setOSize] = useState(1);

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
        setTurn(turn === "x" ? "o" : "x");

        if (sizeAvailables[size] < 1)
            setSize(getMaxSelectableSize(turn === "x" ? xAvailableSizes : oAvailableSizes))
        const W = checkWinner();
        if (W) setWinner(W);
        else if (checkEndTheGame()) setWinner("x | o");
    };
    const toAlert = () => {
        alert(xAvailableSizes)
    }

    const getMaxSelectableSize = (availableSize) => {
        for (let index = availableSize.length - 1; index > -1; index--) {
            const size = availableSize[index];
            if (size > 0) return index;
        }

        return -1;
    }

    const resetGame = () => {
        setSquares(Array(9).fill(""));
        setTurn("x");
        setWinner(null);
        setXAvailableSize([3, 3, 3]);
        setOAvailableSize([3, 3, 3]);
    };


    const getCurrentAvailableSize = () => {
        return oAvailableSizes;
    }
    const getCurrentAvailableSizeX = () => {
        return xAvailableSizes;
    }
    return (
        <div className="tictactoe">
            <h1> TIC-TAC-TOE </h1>
            <button onClick={toAlert}></button>
            <Button resetGame={resetGame} />
            <div className="game">
                {Array.from("012345678").map((ind) => (
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
                            return <div key={ind} className={"sizeBtn square " + (xSize === valueSize ? "enableSizeBtn" : "")}>
                                <ChooseX
                                    clsName={turn}
                                    ind={ind}
                                    updateSquares={(idx) => {
                                        let setSizeAvailables = setXSize;
                                        setSizeAvailables(valueSize)
                                    }}
                                    size={valueSize}
                                    customText={getCurrentAvailableSizeX()[valueSize]}
                                />
                            </div>
                        })
                    ]
                }
            </div>
            <div className='grid grid-cols-3 gap-1 my-2'>
                {
                    [
                        [0, 1, 2].map((valueSize2, ind) => {
                            if (oAvailableSizes[valueSize2] < 1) return undefined;
                            return <div key={ind} className={"sizeBtn square " + (oSize === valueSize2 ? "enableSizeBtn" : "")}>
                                <ChooseO
                                    clsName={turn}
                                    updateSquares={(idx) => {
                                        let setSizeAvailables = setOSize;
                                        setSizeAvailables(valueSize2)
                                    }}
                                    size={valueSize2}
                                    customText={getCurrentAvailableSize()[valueSize2]}
                                />
                            </div>
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
    );
}

export default Tictactoe;
