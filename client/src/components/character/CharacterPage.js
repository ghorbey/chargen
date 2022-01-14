import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider, Container, CssBaseline, Alert, Button, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { Error, Loading, Character } from '../../components';
import { getCurrentUser, createNewCharacter } from '../../common';
import CharacterService from '../../services/Character.service';

export default function CharacterPage(props) {
    const [globalData] = useState(props.globalData);
    const { id, action } = useParams();
    const { userId, isAdmin } = getCurrentUser();
    const [character, setCharacter] = useState(createNewCharacter(id, userId));
    const [isEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);
    const [isFound, setIsFound] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState();
    const [characterId, setCharacterId] = useState();
    const theme = createTheme();

    const handlePrint = () => {
        console.log('print');
    };

    useEffect(() => {
        const loadData = () => {
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
        if (!isLoading && !character && isFound === undefined && characterId === undefined) {
            loadData();
        }
        //  else {
        //     if (+characterId >= 0) {
        //         setIsFound(true);
        //     } else {
        //         setIsFound(false);
        //         setCharacter(undefined);
        //     }
        // }
    }, [isLoading, userId, id, character, isFound, isAdmin, characterId, setCharacter]);

    return (
        (globalData && characterId) ?
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
                    <CssBaseline />
                    {isLoading
                        ? <Loading />
                        : isFound === false
                            ? <Alert severity="error">Aucun personnage avec l'id {id} existant.</Alert>
                            :
                            <Grid container spacing={2}>
                                {!false && isEdit
                                    ?
                                    <Grid item lg={2}>
                                        <Button color="primary" variant="outlined" onClick={handlePrint} sx={{ mr: 2, height: 56 }}>
                                            <FontAwesomeIcon icon={faFilePdf} size="lg" />
                                        </Button>
                                    </Grid>
                                    : null
                                }
                                <Grid item>
                                    <Character character={character} globalData={globalData} isEdit={isEdit} />
                                </Grid>
                            </Grid>
                    }
                    <Error errorMessage={errorMessage} />
                </Container>
            </ThemeProvider>
            : null
    );
}