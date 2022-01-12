import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, Container, CssBaseline } from '@mui/material';
import CharacterService from '../services/Character.service';
import { Error, Loading, Character } from '../components';
import { getCurrentUser } from '../common';

function createNewCharacter(userId) {
    return { id: 0, user_id: +userId, character_name: '', character_type: 'pj', character_number: '000', fate_points: 2, country_id: 1, race_id: 1, religion_id: 1, vocation_id: 1, current_xp: 0, total_xp: 0, public_legend: '', background: '' };
}

export default function CharacterUserPage(props) {
    let { action } = useParams();
    const { userId } = getCurrentUser();
    const [character, setCharacter] = useState(undefined);
    const [isEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);
    const [isFound, setIsFound] = useState(undefined);
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
                            setIsFound(true);
                            setCharacter(response.data);
                        } else {
                            setIsFound(true);
                            setCharacter(createNewCharacter(userId));
                        }
                    })
                    .finally(() => setIsLoading(false));
            }
        };
        if (!isLoading && !character && isFound === undefined && +userId > 0) {
            loadData();
        }
    }, [isLoading, userId, character, isFound, setIsLoading, setCharacter]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {isLoading
                    ? <Loading />
                    : <Character character={character} isEdit={isEdit} />
                }
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}

CharacterUserPage.propTypes = {
    action: PropTypes.string
}