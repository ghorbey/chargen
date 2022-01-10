import React from 'react';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import { Container, Toolbar, AppBar, Box, Button, Breadcrumbs, Typography } from '@mui/material';
import { CharacterPage, CharacterListPage, CharacterUserPage, HomePage, LoginPage, PreferencesPage, UserListPage, UserPage } from '../pages';
import { useToken, getCurrentUser } from '../common';

export default function Navigation(props) {
    const { isAdmin, userId } = getCurrentUser();
    const { token, setToken } = useToken();

    let pages = [
        { key: '1', name: 'Accueil', path: '/', access: ['everyone'] },
        { key: '2', name: 'Liste des personnages', path: '/character-list', access: ['admin'] },
        { key: '3', name: 'Votre personnage', path: `/character/user/view`, access: ['pj'] },
        { key: '4', name: 'Liste des utilisateurs', path: '/user-list', access: ['admin'] },
        { key: '5', name: 'Votre profil', path: `/user/${userId}`, access: ['everyone'] },
        { key: '6', name: 'Vos préférences', path: `/preferences/${userId}`, access: ['everyone'] },
        { key: '7', name: 'Déconnexion', path: `/logout`, access: ['everyone'] }
    ];

    // Filter pages based on user type
    pages = pages.filter(page => {
        if (page.access.includes('everyone')) {
            return true;
        } else if (page.access.includes('admin') && isAdmin) {
            return true;
        } else if (page.access.includes('pj') && !isAdmin) {
            return true;
        }
        return false;
    });

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
            <Router>
                <AppBar position="sticky">
                    <Container component="main" maxWidth="lg">
                        <Toolbar disableGutters>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {pages.map((page) => (
                                    <Button key={page.key} component={Link} to={page.path} color="primary" sx={{ my: 2, color: 'white', display: 'block' }}>
                                        {page.name}
                                    </Button>
                                ))}
                            </Box>
                        </Toolbar>
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
                    <Route path='/character-list' element={<CharacterListPage />} />
                    <Route path='/character/:id/:action' element={<CharacterPage />} />
                    <Route path='/character/user/:action' element={<CharacterUserPage />} />
                    <Route path='/user-list' element={<UserListPage />} />
                    <Route path='/user/:userId' element={<UserPage />} />
                    <Route path='/preferences/:userId' element={<PreferencesPage />} />
                    <Route path='/logout' element={<HomePage />} />
                </Routes>
            </Router>
        );
    }
}