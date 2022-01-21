import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Toolbar, AppBar, Box, Button, Grid, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faSignOutAlt, faAddressCard, faHome } from '@fortawesome/free-solid-svg-icons';

import { getCurrentUser } from '../common';

export default function NavigationBar(props) {
    const { token } = props;
    const { isAdmin, userId } = getCurrentUser();

    let menuLeft = [
        { key: '1', name: faHome, path: '/', access: ['everyone'], isIcon: true },
        { key: '2', name: faAddressCard, path: '/character-list', access: ['admin'], isIcon: true },
        { key: '3', name: faAddressCard, path: `/character/user/view`, access: ['pj'], isIcon: true }
    ];

    let menuRight = [
        { key: '4', name: faUsers, path: '/user-list', access: ['admin'], isIcon: true },
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
    return (
        (token) ?
            <>
                <AppBar position="static">
                    <Container component="main" maxWidth="lg">
                        <Grid container justifyContent="space-between">
                            <Grid item lg={2}>
                                <Toolbar disableGutters>
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        {menuLeft.map((element) => (
                                            <Button key={element.key} component={Link} to={element.path} color="primary" sx={{ color: 'white', display: 'block' }}>
                                                <FontAwesomeIcon icon={element.name} size="2x" />
                                            </Button>
                                        ))}
                                    </Box>
                                </Toolbar>
                            </Grid>
                            <Grid item lg={8}></Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Toolbar disableGutters>
                                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                            {menuRight.map((element) => (
                                                <Button key={element.key} component={Link} to={element.path} color="primary" sx={{ color: 'white', display: 'block' }}>
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
            </>
            : null
    );
}