import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db, provider} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CircularProgress, Stack } from '@mui/material';
import { GoogleAuthProvider } from 'firebase/auth';

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Introduce a loading state

  async function googleSignUp() {
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const uid = user.uid;
        const email = user.email;
        const userDocRef = doc(db, 'users', uid);
        setDoc(userDocRef, {
          uid: uid,
          email: email,
          username: user.displayName,
          // userName: username,
          // Add more user information as needed
        });
        setUser(user.user);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
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
  }, [user]);
  if (loading) {
    return (
      <Stack sx={{ display: 'flex' }} className='w-full items-center h-full fixed justify-center'>
        <CircularProgress size={80} />
      </Stack>
    )
  }

  return (
    <UserAuthContext.Provider value={{ user, logIn, signUp, logOut, googleSignUp }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
