import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';

const UserProfile = () => {
  // Assuming you have a user object with properties like displayName and email
  const [user, setUser] = useState({
    displayName: 'John Doe',
    email: 'john@example.com',
  });

  const [formValues, setFormValues] = useState({
    displayName: user.displayName,
    email: user.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
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
        />
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.email}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Container>
  );
};

export default UserProfile;
