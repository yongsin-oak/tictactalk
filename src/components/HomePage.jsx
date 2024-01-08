import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

function HomePage() {
    return (
        <div className="flex justify-center gap-2">
            <Link to="/Auth">
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </Link>

            <Link to="/Auth">
                <Button variant="outlined">Register</Button>
            </Link>
        </div>
    );
}

export default HomePage;
