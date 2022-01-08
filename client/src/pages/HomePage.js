import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTheme, Container, ThemeProvider, CssBaseline } from '@mui/material';
import { ActivityList, NewsList } from '../components';
import './HomePage.scss';

export default function HomePage() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const theme = createTheme();

    useEffect(() => {
        if (pathname === '/logout') {
            sessionStorage.removeItem('token');
            navigate('/');
            window.location.reload(false);
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <h2>Page d'accueil</h2>
                <NewsList />
                <ActivityList />
            </Container>
        </ThemeProvider>
    );
}