import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, Container, CssBaseline } from '@mui/material';
import CharacterService from '../services/Character.service';
import { Error, Loading, Character } from '../components';
import { getCurrentUser } from '../common';

export default function CharacterPage() {
    let { id, action } = useParams();
    const navigate = useNavigate();
    const { userId } = getCurrentUser();
    const [currentCharacter, setCurrentCharacter] = useState(undefined);
    const [originalCharacter, setOriginalCharacter] = useState(undefined);
    const [isEdit, setIsEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const theme = createTheme();

    const handleSave = (savedCharacter) => {
        if (savedCharacter.id) {
            CharacterService
                .update([savedCharacter])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setIsEdit(false);
                    }
                    setErrorMessage(message);
                });
        } else {
            CharacterService
                .add([savedCharacter])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setIsEdit(false);
                    }
                    setErrorMessage(message);
                });
        }
    };

    const handleCancel = () => {
        setCurrentCharacter(originalCharacter);
        setIsEdit(false);
        setErrorMessage('');
    };

    const handleEdit = (character) => {
        setOriginalCharacter(character);
        setIsEdit(true);
        setErrorMessage('');
    };

    useEffect(() => {
        const loadData = () => {
            if (+id === 0) {
                setCurrentCharacter({ user_id: +userId, character_name: 'Nom', character_type: 'pj', character_number: '000', fate_points: 2, country_id: 1, race_id: 1, religion_id: 1, vocation_id: 1, current_xp: 0, total_xp: 0, public_legend: '', background: '' });
            } else if (!isLoading && id > 0) {
                setIsLoading(true);
                CharacterService
                    .get(id)
                    .then(response => {
                        if (response.character) {
                            if (response.character.user_id === userId) {
                                setCurrentCharacter(response.character);
                            } else {
                                console.error('Trying to access unauthorized resource!');
                                navigate('/');
                            }
                        } else {
                            setCurrentCharacter({});
                        }
                    })
                    .finally(() => setIsLoading(false));
            } else {
                setCurrentCharacter({});
            }
        };
        if (!isLoading && !currentCharacter && id >= 0) {
            loadData();
        }
    }, [isLoading, userId, id, currentCharacter, setIsLoading, setCurrentCharacter, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {isLoading
                    ? <Loading />
                    : <Character character={currentCharacter} isEdit={isEdit} edit={handleEdit} save={handleSave} cancel={handleCancel} />
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