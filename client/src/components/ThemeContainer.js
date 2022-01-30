import React from 'react';
import { createTheme, ThemeProvider, Container, CssBaseline } from '@mui/material';

import { RouterBreadcrumbs } from '../components';

export default function ThemeContainer(props) {
    const { isLogin } = props;
    const theme = createTheme({
        typography: {
            list_header: {
                fontSize: 40,
                padding: 0
            },
            colored: {
                backgroundColor: 'red'
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {!isLogin ? <RouterBreadcrumbs /> : null}
                {props.children}
            </Container>
        </ThemeProvider>
    );
}