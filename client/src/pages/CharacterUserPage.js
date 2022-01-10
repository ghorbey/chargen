import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, Container, CssBaseline } from '@mui/material';
import CharacterService from '../services/Character.service';
import { Error, Loading, Character } from '../components';
import { getCurrentUser } from '../common';

export default function CharacterUserPage() {
    let { action } = useParams();
    const { userId } = getCurrentUser();
    const [currentCharacter, setCurrentCharacter] = useState(undefined);
    const [isEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage] = useState();
    const theme = createTheme();

    useEffect(() => {
        const loadData = () => {
            if (!isLoading && +userId > 0) {
                setIsLoading(true);
                CharacterService
                    .getForUser(userId)
                    .then(response => {
                        if (response.data) {
                            setCurrentCharacter(response.data);
                        } else {
                            setCurrentCharacter({});
                        }
                    })
                    .finally(() => setIsLoading(false));
            } else {
                setCurrentCharacter({});
            }
        };
        if (!isLoading && !currentCharacter && +userId > 0) {
            loadData();
        }
    }, [isLoading, userId, currentCharacter, setIsLoading, setCurrentCharacter]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {isLoading
                    ? <Loading />
                    : <Character character={currentCharacter} isEdit={isEdit} />
                }
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}

CharacterUserPage.propTypes = {
    action: PropTypes.string
}