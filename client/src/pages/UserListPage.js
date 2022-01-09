import React from 'react';
import { createTheme, Container, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import './UserListPage.scss';

export default function UserListPage() {
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h2">Liste des utilisateurs (Admin)</Typography>
                <ul>
                    <li>Liste</li>
                    <li>Ajouter un utilisateur</li>
                    <li>Supprimer un utilisateur</li>
                    <li>Mettre à jour un utilisateur</li>
                </ul>
            </Container>
        </ThemeProvider>
    );
}