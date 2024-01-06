import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

function HomePage() {
    return (
        <div className="flex justify-center gap-2">
            <Link to="/login">
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </Link>

            <Link to="/register">
                <Button variant="outlined">Register</Button>
            </Link>
        </div>
    );
}

export default HomePage;
