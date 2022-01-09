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
                    : <Character character={currentCharacter} isEdit={isEdit} edit={handleEdit} save={handleSave} cancel={handleCancel} />
                }
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}

CharacterUserPage.propTypes = {
    action: PropTypes.string
}