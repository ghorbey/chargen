import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, Link as RouterLink } from 'react-router-dom';
import { Container, Toolbar, AppBar, Box, Button, Grid, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faSignOutAlt, faAddressCard, faHome } from '@fortawesome/free-solid-svg-icons';
import { CharacterPage, CharacterListPage, CharacterUserPage, HomePage, LoginPage, PreferencesPage, UserListPage, UserPage } from '../pages';
import { useToken, getCurrentUser } from '../common';
import DataService from '../services/Data.service';
import { RouterBreadcrumbs } from '../components'

export default function Navigation(props) {
    const [globalData, setGlobalData] = useState(undefined);
    const { isAdmin, userId } = getCurrentUser();
    const { token, setToken } = useToken();

    let menuLeft = [
        { key: '1', name: faHome, path: '/', access: ['everyone'], isIcon: true },
        { key: '2', name: faAddressCard, path: '/character-list', access: ['admin'], isIcon: true },
        { key: '3', name: faAddressCard, path: `/character/user/view`, access: ['pj'], isIcon: true },
        { key: '4', name: faUsers, path: '/user-list', access: ['admin'], isIcon: true }
    ];

    let menuRight = [
        { key: '5', name: faUser, path: `/user/${userId}/view`, access: ['everyone'], isIcon: true },
        { key: '6', name: faSignOutAlt, path: `/logout`, access: ['everyone'], isIcon: true }
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
                            <Grid container justifyContent="space-between">
                                <Grid item lg={2}>
                                    <Toolbar disableGutters>
                                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                            {menuLeft.map((element) => (
                                                <Button key={element.key} component={RouterLink} to={element.path} color="primary" sx={{ color: 'white', display: 'block' }}>
                                                    <FontAwesomeIcon icon={element.name} size="2x" />
                                                </Button>
                                            ))}
                                        </Box>
                                    </Toolbar>
                                </Grid>
                                <Grid item lg={2}>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Toolbar disableGutters>
                                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                                {menuRight.map((element) => (
                                                    <Button key={element.key} component={RouterLink} to={element.path} color="primary" sx={{ color: 'white', display: 'block' }}>
                                                        <FontAwesomeIcon icon={element.name} size="2x" />
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Toolbar>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Container>
                    </AppBar>
                    <Container>
                        <RouterBreadcrumbs></RouterBreadcrumbs>
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