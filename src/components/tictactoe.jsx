import React, { useState } from 'react';
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const calculateWinner = (squares) => {
  // Function to calculate the winner (similar to your implementation)
  // ...

  return null; // Return the winner ('X', 'O', or null)
};

const INITIAL_STATE = Array(9).fill(null);

const TicTacToe = () => {
  const [board, setBoard] = useState(INITIAL_STATE);
  const [xIsNext, setXIsNext] = useState(true);
  const [selectedSize, setSelectedSize] = useState(3);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = { player: xIsNext ? 'X' : 'O', size: selectedSize };
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const renderSquare = (index, size) => (
    <Button
      variant="outlined"
      size="large"
      style={{ width: `${size * 30}px`, height: `${size * 30}px`, fontSize: `${size * 1.5}rem` }}
      onClick={() => handleClick(index)}
    >
      {board[index] && board[index].player}
    </Button>
  );

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Tic Tac Toe
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <FormControl>
            <InputLabel id="size-label">Size</InputLabel>
            <Select
              labelId="size-label"
              id="size-select"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <MenuItem value={3}>3x3</MenuItem>
              <MenuItem value={4}>4x4</MenuItem>
              <MenuItem value={5}>5x5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <div>
        <div>
          <Typography variant="h6">{status}</Typography>
        </div>
        <div>
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ display: 'flex' }}>
              {[0, 1, 2].map((col) => (
                <div key={col}>{renderSquare(row * 3 + col, selectedSize)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
