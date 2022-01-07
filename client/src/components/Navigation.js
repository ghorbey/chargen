import React from 'react';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import { Container, Toolbar, AppBar, Box, Button } from '@mui/material';
import { CharacterListPage, CharacterPage, HomePage, PreferencesPage, UserListPage, UserPage } from '../pages';
import useToken from '../common/useToken';
import { Login } from '../components';

export default function Navigation(props) {
    const pages = props.pages;
    const { token, setToken } = useToken();

    if (!token) {
        return (
            <Router>
                <Routes>
                    <Route path='/' element={<Login setToken={setToken} />} />
                </Routes>
            </Router>
        );
    } else {
        return (
            <Router>
                <AppBar position="sticky">
                    <Container maxWidth="xl">
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
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/character-list' element={<CharacterListPage />} />
                    <Route path='/character' element={<CharacterPage />} />
                    <Route path='/user-list' element={<UserListPage />} />
                    <Route path='/user' element={<UserPage />} />
                    <Route path='/preferences' element={<PreferencesPage />} />
                </Routes>
            </Router>
        );
    }
}