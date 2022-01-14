import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTheme, Container, ThemeProvider, CssBaseline, Grid } from '@mui/material';

import { ActivityList, NewsList } from '../../components';
import { getCurrentUser } from '../../common';

export default function HomePage() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isAdmin } = getCurrentUser();
    const theme = createTheme();

    useEffect(() => {
        if (pathname === '/logout') {
            sessionStorage.removeItem('token');
            navigate('/');
            window.location.reload(false);
        }
    }, [pathname, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Grid container>
                    <Grid item lg={isAdmin ? 6 : 12}>
                        <NewsList />
                    </Grid>
                    {
                        isAdmin ?
                            <Grid item lg={6}>
                                <ActivityList />
                            </Grid>
                            : null
                    }
                </Grid>
            </Container>
        </ThemeProvider>
    );
}