import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Grid, Typography } from '@mui/material';

import { Error, Loading, Character, ThemeContainer } from '../../components';
import { getCurrentUser, createNewCharacter } from '../../common';
import CharacterService from '../../services/Character.service';

export default function CharacterPage(props) {
    const globalData = props.globalData;
    const { userId, isAdmin } = getCurrentUser();
    const { id, action } = useParams();

    const [errorMessage, setErrorMessage] = useState();
    const [characterId, setCharacterId] = useState();
    const [character, setCharacter] = useState(undefined);
    const [isFound, setIsFound] = useState(undefined);
    const [isEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);

    const handlePrint = () => {
        console.log('print');
    };

    useEffect(() => {
        const loadData = (id) => {
            setIsLoading(true);
            const promise = (id === 'user')
                ? CharacterService.getForUser(userId)
                : CharacterService.get(id);
            promise
                .then(response => {
                    setErrorMessage(response?.message);
                    if (response?.data?.user_id === userId || isAdmin) {
                        if (response.data) {
                            setIsFound(true);
                            setCharacter(response.data);
                            setCharacterId(response.data.id);
                        }
                    } else {
                        if (response?.data?.user_id !== userId && !isAdmin) {
                            setErrorMessage('Accès interdit');
                        }
                        console.error('Trying to access unauthorized resource!');
                        setIsFound(false);
                        setCharacter(undefined);
                    }
                })
                .finally(() => setIsLoading(false));
        };
        if (!isLoading && characterId === undefined) {
            if (+id === 0) {
                setIsLoading(false);
                setIsFound(true);
                setCharacter(createNewCharacter(id, userId));
                setCharacterId(id);
            } else {
                loadData(id);
            }
        }
    }, [isLoading, userId, id, character, isAdmin, characterId]);

    return (
        (globalData && characterId)
            ? <ThemeContainer>
                {isLoading
                    ? <Loading />
                    : (isFound === false)
                        ? <Alert severity="error">Aucun personnage avec l'id {id} existant.</Alert>
                        : <Grid container spacing={2}>
                            <Grid item>
                                <Character character={character} globalData={globalData} isEdit={isEdit} handlePrint={handlePrint} />
                            </Grid>
                        </Grid>
                }
                <Error errorMessage={errorMessage} />
            </ThemeContainer>
            : <Typography>{characterId}</Typography>
    );
}