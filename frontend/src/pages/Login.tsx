import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // TODO: show toast
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Connexion</Typography>
        <form onSubmit={onSubmit}>
          <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Mot de passe" margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Se connecter
          </Button>
        </form>
      </Box>
    </Container>
  );
}
