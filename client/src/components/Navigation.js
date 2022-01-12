import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import { Container, Toolbar, AppBar, Box, Button, Breadcrumbs, Typography, Grid } from '@mui/material';
import { CharacterPage, CharacterListPage, CharacterUserPage, HomePage, LoginPage, PreferencesPage, UserListPage, UserPage } from '../pages';
import { useToken, getCurrentUser } from '../common';
import DataService from '../services/Data.service';

export default function Navigation(props) {
    const [globalData, setGlobalData] = useState(undefined);
    const { isAdmin, userId } = getCurrentUser();
    const { token, setToken } = useToken();

    let menuLeft = [
        { key: '1', name: 'Accueil', path: '/', access: ['everyone'] },
        { key: '2', name: 'Personnages', path: '/character-list', access: ['admin'] },
        { key: '3', name: 'Votre personnage', path: `/character/user/view`, access: ['pj'] },
        { key: '4', name: 'Utilisateurs', path: '/user-list', access: ['admin'] }
    ];

    let menuRight = [
        { key: '5', name: `Profil de ${userId}`, path: `/user/${userId}/view`, access: ['everyone'] },
        { key: '6', name: 'Préférences', path: `/preferences/${userId}`, access: ['everyone'] },
        { key: '7', name: 'Déconnexion', path: `/logout`, access: ['everyone'] }
    ];

    // Filter pages based on user type
    menuLeft = menuLeft.filter(page => {
        if (page.access.includes('everyone')) {
            return true;
        } else if (page.access.includes('admin') && isAdmin) {
            return true;
        } else if (page.access.includes('pj') && !isAdmin) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        const loadData = () => {
            DataService
                .getAll()
                .then(response => {
                    if (response?.isSuccessful) {
                        setGlobalData(response.data);
                    } else {
                        setGlobalData({});
                    }
                });
        };
        if (userId) {
            loadData();
        }
    }, [userId]);

    if (!token) {
        return (
            <Router>
                <Routes>
                    <Route exact path='*' element={<LoginPage setToken={setToken} />} />
                </Routes>
            </Router>
        );
    } else {
        return (
            (globalData) ?
                <Router>
                    <AppBar position="sticky">
                        <Container component="main" maxWidth="lg">
                            <Grid container>
                                <Grid item lg={6}>
                                    <Toolbar disableGutters>
                                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                            {menuLeft.map((element) => (
                                                <Button key={element.key} component={Link} to={element.path} color="primary" sx={{ my: 2, color: 'white', display: 'block' }}>
                                                    {element.name}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Toolbar>
                                </Grid>
                                <Grid item lg={6}>
                                    <Toolbar disableGutters>
                                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                            {menuRight.map((element) => (
                                                <Button key={element.key} component={Link} to={element.path} color="primary" sx={{ my: 2, color: 'white', display: 'block' }}>
                                                    {element.name}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Toolbar>
                                </Grid>
                            </Grid>

                        </Container>
                    </AppBar>
                    <Container>
                        <br />
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">Breadcrumbs</Typography>
                        </Breadcrumbs>
                        <br />
                    </Container>
                    <Routes>
                        <Route exact path='/' element={<HomePage />} />
                        <Route path='/character-list' element={<CharacterListPage globalData={globalData} />} />
                        <Route path='/character/:id/:action' element={<CharacterPage globalData={globalData} />} />
                        <Route path='/character/user/:action' element={<CharacterUserPage globalData={globalData} />} />
                        <Route path='/user-list' element={<UserListPage />} />
                        <Route path='/user/:id/:action' element={<UserPage />} />
                        <Route path='/preferences/:userId' element={<PreferencesPage />} />
                        <Route path='/logout' element={<HomePage />} />
                    </Routes>
                </Router>
                : null
        );
    }
}