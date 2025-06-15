// src/pages/Login.js
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
} from '@mui/material';
import api from "../services/api";
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const { login } = useAuth();
     const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', {
                username,
                password,
            });
            const { token } = res.data;
            console.log("token",token)
            login(token); // set token and mark as authenticated
              navigate('/dashboard', { replace: true });
            // optionally update the path using your custom router
            // navigate('/dashboard'); if you're using router.navigate
        } catch (err) {
            console.error(err)
            setError('Invalid username or password');
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
                <Typography variant="h5" gutterBottom textAlign="center">
                    Login
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Box component="form" onSubmit={handleLogin} mt={2}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
