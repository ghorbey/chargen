import React from 'react';
import { createTheme, Container, ThemeProvider, CssBaseline, Typography } from '@mui/material';

export default function PreferencesPage() {
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h2">Préférences</Typography>
                <ul>
                    <li>thème?</li>
                    <li>Paramètres divers</li>
                </ul>
            </Container>
        </ThemeProvider>
    );
}