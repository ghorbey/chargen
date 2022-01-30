import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Avatar, TextField, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import sha256 from 'crypto-js/sha256';

import { Error, ThemeContainer } from '../../components';
import UserService from '../../services/User.service';

export default function LoginPage(props) {
    const { setToken } = props;
    const [errorMessage, setErrorMessage] = useState('');

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
        <ThemeContainer isLogin={true}>
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
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Connexion
                    </Button>
                    <Error errorMessage={errorMessage} />
                </Box>
            </Box>
        </ThemeContainer>
    );
}

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
}