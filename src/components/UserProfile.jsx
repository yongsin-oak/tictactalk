import React, { useEffect, useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useUserAuth } from '../context/UserAuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, } from '../firebase';
import { updateProfile } from 'firebase/auth';

const UserProfile = () => {
  // Assuming you have a user object with properties like displayName and email
  const { user } = useUserAuth();

  const [formValues, setFormValues] = useState({
    displayName: user.displayName,
  });
  useEffect(() => {
    // Update form values when user changes (e.g., on login)
    setFormValues({
      displayName: user.displayName,
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update user profile in Firebase Authentication
      await updateProfile(auth.currentUser,
        {displayName: formValues.displayName,
      });

      // Update user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: formValues.displayName,
        // Add more fields as needed
      });
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };


  return (
    <Container>
      <Typography variant="h2" gutterBottom className="text-center">
        User Profile Settings
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Display Name"
          name="displayName"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.displayName}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Container>
  );
};

export default UserProfile;
