import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

import { ActivityList, NewsList, ThemeContainer } from '../../components';
import { getCurrentUser } from '../../common';

export default function HomePage() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isAdmin } = getCurrentUser();

    useEffect(() => {
        if (pathname === '/logout') {
            sessionStorage.removeItem('token');
            navigate('/');
            window.location.reload(false);
        }
    }, [pathname, navigate]);

    return (
        <ThemeContainer>
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
        </ThemeContainer>
    );
}