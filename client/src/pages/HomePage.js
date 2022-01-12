import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { createTheme, Container, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import { ActivityList, NewsList } from '../components';

export default function HomePage() {
    const { pathname } = useLocation();
    const theme = createTheme();

    useEffect(() => {
        if (pathname === '/logout') {
            sessionStorage.removeItem('token');
            <Navigate to='/' />;
            window.location.reload(false);
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h2">Page d'accueil</Typography>
                <NewsList />
                <ActivityList />
            </Container>
        </ThemeProvider>
    );
}