import React from 'react';
import { createTheme, Container, ThemeProvider, CssBaseline, Typography } from '@mui/material';

export default function UserPage() {
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h2">Utilisateur (Admin)</Typography>
                <ul>
                    <li>Mettre à jour l' utilisateur</li>
                    <li>Lien entre un utilisateur et un personnage</li>
                    <li>Statut Admin</li>
                    <li>Nom, prénom, téléphone, email, mot de passe, ...</li>
                </ul>
            </Container>
        </ThemeProvider>
    );
}