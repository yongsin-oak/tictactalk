import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { CircularProgress, Stack } from '@mui/material';

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Introduce a loading state

  async function signUp(email, password) {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // await updateProfile(userCredential.user, { displayName: username });
      // Get user UID
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      // Add additional user data to Firestore
      await setDoc(userDocRef, {
        uid: uid,
        email: email,
        // userName: username,
        // Add more user information as needed
      });
      setUser(userCredential.user);
  
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log('Auth', currentuser);
      setUser(currentuser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  if (loading) {
    return (
      <Stack sx={{ display: 'flex' }} className='w-full items-center h-full fixed justify-center'>
        <CircularProgress size={80}/>
      </Stack>
    )
  }

  return (
    <UserAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
