import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider, Container, CssBaseline } from '@mui/material';
import CharacterService from '../services/Character.service';
import { checkAccess } from '../common';
import { Error, Loading, Character } from '../components';
import './CharacterPage.scss';

export default function CharacterPage() {
    const [character, setCharacter] = useState(undefined);
    const [originalCharacter, setOriginalCharacter] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    let { userId } = useParams();
    const theme = createTheme();
    const { authorized, currentUserId } = checkAccess(userId);
    if (!authorized) {
        console.error('Trying to access unauthorized resource!');
        userId = currentUserId;
    }

    useEffect(() => {
        setIsLoading(true);
        CharacterService
            .getOne(userId)
            .then(response => {
                setCharacter(response.character);
                setIsLoading(false);
            });
    }, [userId]);

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
    const handleCancel = (event) => {
        setCharacter(originalCharacter)
        setIsEdit(false);
        setErrorMessage('');
    };
    const handleEdit = (event) => {
        setOriginalCharacter(character);
        setIsEdit(true);
        setErrorMessage('');
    };
    const handleCreate = (event) => {
        setIsEdit(true);
        setCharacter({ user_id: +userId, character_name: 'Nom', character_type: 'pj', character_number: '000', fate_points: 2, country_id: 1, race_id: 1, religion_id: 1, vocation_id: 1, current_xp: 0, total_xp: 0, public_legend: '', background: '' });
        setErrorMessage('');
    };
    const handleDelete = (event) => {
        if (character.id) {
            CharacterService
                .delete([character.id])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setCharacter(undefined);
                    } else {
                        setErrorMessage(message);
                    }
                });
        } else {
            setCharacter(undefined);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {isLoading ? <Loading /> : <Character character={character} isEdit={isEdit} edit={handleEdit} save={handleSave} cancel={handleCancel} create={handleCreate} deleteCharacter={handleDelete} />}
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}