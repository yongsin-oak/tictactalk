import React, {useEffect} from 'react'
import { useUserAuth } from '../context/UserAuthContext'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Home() {
  const { logOut, user } = useUserAuth();

  const navigate = useNavigate();

  console.log(user)

  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);


  const handleLogout = async () => {
    try {
        await logOut(); 
        navigate('/')
    } catch(err) {
        console.log(err.message);
    }
  }
  return (
    <div>
        <h1>Welcom to home page</h1>
        <p>Hi,</p>
        <p>{}</p>
        <Button onClick={handleLogout} variant='contained' color='error'>Logout</Button>
    </div>
  )
}

export default Home