import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  async function signUp(username, email, password) {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      // Get user UID
      const uid = userCredential.user.uid;

      // Add additional user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: uid,
        email: email,
        username: username
        // Add more user information as needed
      });
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
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
