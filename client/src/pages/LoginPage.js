import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider, Container, Button, Typography, Avatar, CssBaseline, TextField, Box } from '@mui/material';
import PropTypes from 'prop-types';
import sha256 from 'crypto-js/sha256';
import { Error } from '../components';
import UserService from '../services/User.service';
import './LoginPage.scss';

export default function LoginPage(props) {
    const { setToken } = props;
    const [errorMessage, setErrorMessage] = useState('');
    const theme = createTheme();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        UserService
            .login({ email: data.get('email'), password: sha256(data.get('password')).toString() })
            .then(response => {
                const { token, message } = response;
                setErrorMessage(message);
                if (token) {
                    setToken(token);
                }
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Connexion
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Connexion
                        </Button>
                        <Error errorMessage={errorMessage} />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
}