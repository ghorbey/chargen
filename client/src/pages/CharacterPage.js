import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, Container, CssBaseline, Alert } from '@mui/material';
import CharacterService from '../services/Character.service';
import { Error, Loading, Character } from '../components';
import { getCurrentUser } from '../common';

function createNewCharacter(id, userId) {
    if (+id === 0) {
        return { id: 0, user_id: +userId, character_name: '', character_type: '', character_number: '000', fate_points: 2, country_id: 1, race_id: 1, religion_id: 1, vocation_id: 1, current_xp: 0, total_xp: 0, public_legend: '', background: '' };
    } else {
        return undefined;
    }
}

export default function CharacterPage() {
    const { id, action } = useParams();
    const navigate = useNavigate();
    const { userId } = getCurrentUser();
    const [character, setCharacter] = useState(createNewCharacter(id, userId));
    const [isEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);
    const [isFound, setIsFound] = useState(undefined);
    const [errorMessage] = useState();
    const theme = createTheme();

    useEffect(() => {
        const loadData = () => {
            if (!isLoading && id > 0) {
                setIsLoading(true);
                CharacterService
                    .get(id)
                    .then(response => {
                        if (response.data) {
                            if (response.data.user_id === userId) {
                                setIsFound(true);
                                console.log(response.data);
                                setCharacter(response.data);
                            } else {
                                console.error('Trying to access unauthorized resource!');
                                navigate('/');
                            }
                        } else {
                            setIsFound(false);
                            setCharacter(undefined);
                        }
                    })
                    .finally(() => setIsLoading(false));
            } else {
                setIsFound(false);
                setCharacter(undefined);
            }
        };
        if (!isLoading && !character && isFound === undefined && id >= 0) {
            loadData();
        }
    }, [isLoading, userId, id, character, isFound, setCharacter, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {isLoading
                    ? <Loading />
                    : isFound === false
                        ? <Alert severity="error">Aucun personnage avec l'id {id} existant.</Alert>
                        : <Character character={character} isEdit={isEdit} />
                }
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}

CharacterPage.propTypes = {
    id: PropTypes.number,
    action: PropTypes.string
}