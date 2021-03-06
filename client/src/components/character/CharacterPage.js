import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Grid } from '@mui/material';

import { Error, Loading, Character, ThemeContainer } from '../../components';
import { getCurrentUser } from '../../common';
import CharacterService from '../../services/Character.service';
import createNewCharacter from './createNewCharacter';

export default function CharacterPage(props) {
    const globalData = props.globalData;
    const { userId, isAdmin, IsPnj } = getCurrentUser();
    const { id, action } = useParams();

    const [errorMessage, setErrorMessage] = useState();
    const [characterId, setCharacterId] = useState();
    const [character, setCharacter] = useState(undefined);
    const [isFound, setIsFound] = useState(undefined);
    const [isEdit, setIsEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = (id) => {
            setIsLoading(true);
            const promise = (id === 'user')
                ? CharacterService.getForUser(userId)
                : CharacterService.get(id);
            promise
                .then(response => {
                    if (response?.isSuccessful) {
                        if (response?.data?.user_id === userId || isAdmin || IsPnj) {
                            if (response.data) {
                                setIsFound(true);
                                setCharacter(response.data);
                                setCharacterId(response.data.id);
                            }
                        } else {
                            if (response?.data && response?.data?.user_id !== userId && !isAdmin && !IsPnj) {
                                setErrorMessage('Accès interdit');
                                console.error('Trying to access unauthorized resource!');
                                setCharacter(undefined);
                            } else {
                                const newCharacter = createNewCharacter(0, userId);
                                setCharacter(newCharacter);
                                setCharacterId(0);
                                setIsEdit(true);
                            }
                            setIsFound(true);
                        }
                    } else {
                        setErrorMessage(response?.message);
                        setIsFound(false);
                        setCharacter(undefined);
                    }

                })
                .finally(() => setIsLoading(false));
        };
        if (!isLoading && characterId === undefined && !isFound) {
            if (+id === 0) {
                setIsLoading(false);
                setIsFound(true);
                setCharacter(createNewCharacter(id, userId));
                setCharacterId(id);
            } else {
                loadData(id);
            }
        }
    }, [isLoading, isFound, userId, id, character, isAdmin, IsPnj, characterId]);

    return (
        (globalData && character && characterId >= 0)
            ? <ThemeContainer>
                {isLoading
                    ? <Loading />
                    : (isFound === false)
                        ? <Alert severity="error" sx={{ displayPrint: 'none' }}>Aucun personnage avec l'id {id} existant.</Alert>
                        : <Grid container spacing={2} className="bg">
                            <Grid item>
                                <Character character={character} globalData={globalData} isEdit={isEdit} />
                            </Grid>
                        </Grid>
                }
            </ThemeContainer>
            : <Error errorMessage={errorMessage} />
    );
}