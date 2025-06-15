import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    InputAdornment
} from '@mui/material';
import { LockOutlined, Person, Lock } from '@mui/icons-material';
import api from "../services/api";
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import loginPic from '../assets/login-bg.jpg';

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
            login(token);
            navigate('/dashboard', { replace: true });
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
            height="100vh"
            width="100vw"
            sx={{
                backgroundImage: `url(${loginPic})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backdropFilter: 'blur(4px)',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    width: 400,
                    borderRadius: 4,
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                }}
            >
                <Box textAlign="center" mb={2}>
                    <LockOutlined color="primary" fontSize="large" />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                        Welcome 
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Please login to continue
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, py: 1.3, fontWeight: 'bold' }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
