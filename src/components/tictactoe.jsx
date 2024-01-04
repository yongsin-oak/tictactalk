import React, { useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X': 'O';

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (index) => (
    <Button
      variant="outlined"
      className=' w-36 h-36'
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </Button>
  );

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every((square) => square !== null)) {
      return 'Draw!';
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom className="text-center">
        Tic Tac Toe
      </Typography>
      <Typography variant="h5" gutterBottom className="text-center">
        {getStatus()}
      </Typography>
      <Grid container spacing={1}>
        {[0, 1, 2].map((row) => (
          <Grid container item key={row} justifyContent="center" spacing={1}>
            {[0, 1, 2].map((col) => (
              <Grid item key={col}>
                {renderSquare(row * 3 + col)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={resetGame}>
          Reset Game
        </Button>
      </div>
    </Container>
  );
};

// Helper function to calculate the winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

export default TicTacToe;
